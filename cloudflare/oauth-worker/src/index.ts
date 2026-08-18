import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  clearCookie,
  codeChallenge,
  corsHeaders,
  createBuyerSession,
  createOAuthState,
  OAUTH_STATE_COOKIE,
  readBuyerSession,
  readCookie,
  readOAuthState,
  securityHeaders,
  serializeCookie,
  SESSION_COOKIE,
} from "./security";

interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  AUTH_ORIGIN: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  OAUTH_RATE_LIMITER: RateLimitBinding;
  PUBLIC_ORIGIN: string;
  SESSION_HMAC_KEY: string;
}

const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function redirect(location: string, cookies: string[] = []): Response {
  const headers = securityHeaders();
  headers.set("Location", location);
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

function json(payload: unknown, status = 200, extraHeaders?: Headers): Response {
  const headers = securityHeaders();
  headers.set("Content-Type", "application/json; charset=utf-8");
  extraHeaders?.forEach((value, key) => headers.set(key, value));
  return new Response(JSON.stringify(payload), { status, headers });
}

function isExpectedOrigin(request: Request, expectedOrigin: string): boolean {
  const origin = request.headers.get("Origin");
  return origin === null || origin === expectedOrigin;
}

async function rateLimit(request: Request, env: Env, route: string): Promise<Response | null> {
  const actor = request.headers.get("cf-connecting-ip") ?? "unknown";
  const result = await env.OAUTH_RATE_LIMITER.limit({ key: `${route}:${actor}` });
  return result.success ? null : json({ error: "rate_limited" }, 429);
}

async function startGoogleLogin(request: Request, env: Env): Promise<Response> {
  const limited = await rateLimit(request, env, "google-start");
  if (limited) return limited;

  const { payload, cookieValue } = await createOAuthState("google", env.SESSION_HMAC_KEY);
  const callbackUrl = `${env.AUTH_ORIGIN}/v1/callback/google`;
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    client_id: env.GOOGLE_OAUTH_CLIENT_ID,
    code_challenge: await codeChallenge(payload.codeVerifier),
    code_challenge_method: "S256",
    nonce: payload.nonce,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state: payload.state,
  }).toString();

  return redirect(authorizationUrl.toString(), [serializeCookie(OAUTH_STATE_COOKIE, cookieValue, 300)]);
}

async function finishGoogleLogin(request: Request, env: Env): Promise<Response> {
  const limited = await rateLimit(request, env, "google-callback");
  if (limited) return limited;

  const url = new URL(request.url);
  const state = await readOAuthState(readCookie(request, OAUTH_STATE_COOKIE), env.SESSION_HMAC_KEY);
  const suppliedState = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!state || state.state !== suppliedState || !code || url.searchParams.has("error")) {
    return redirect(`${env.PUBLIC_ORIGIN}/#/account?signin=failed`, [clearCookie(OAUTH_STATE_COOKIE)]);
  }

  const callbackUrl = `${env.AUTH_ORIGIN}/v1/callback/google`;
  const body = new URLSearchParams({
    client_id: env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    code,
    code_verifier: state.codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: callbackUrl,
  });
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  });
  const tokenPayload = (await tokenResponse.json()) as { id_token?: string };
  if (!tokenResponse.ok || !tokenPayload.id_token) {
    return redirect(`${env.PUBLIC_ORIGIN}/#/account?signin=failed`, [clearCookie(OAUTH_STATE_COOKIE)]);
  }

  try {
    const { payload } = await jwtVerify(tokenPayload.id_token, googleJwks, {
      audience: env.GOOGLE_OAUTH_CLIENT_ID,
      issuer: ["https://accounts.google.com", "accounts.google.com"],
    });
    if (payload.nonce !== state.nonce || typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.email_verified !== true) {
      throw new Error("Invalid Google identity payload");
    }
    const sessionCookie = await createBuyerSession(
      { email: payload.email, expiresAt: Date.now() + 8 * 60 * 60 * 1000, provider: "google", sub: payload.sub },
      env.SESSION_HMAC_KEY,
    );
    return redirect(`${env.PUBLIC_ORIGIN}/#/account?signin=google`, [
      clearCookie(OAUTH_STATE_COOKIE),
      serializeCookie(SESSION_COOKIE, sessionCookie, 8 * 60 * 60),
    ]);
  } catch {
    return redirect(`${env.PUBLIC_ORIGIN}/#/account?signin=failed`, [clearCookie(OAUTH_STATE_COOKIE)]);
  }
}

async function getSession(request: Request, env: Env): Promise<Response> {
  if (!isExpectedOrigin(request, env.PUBLIC_ORIGIN)) return json({ error: "origin_forbidden" }, 403);
  const session = await readBuyerSession(readCookie(request, SESSION_COOKIE), env.SESSION_HMAC_KEY);
  return json({ session }, 200, corsHeaders(env.PUBLIC_ORIGIN));
}

function logout(request: Request, env: Env): Response {
  if (request.headers.get("Origin") !== env.PUBLIC_ORIGIN) return json({ error: "origin_forbidden" }, 403);
  const headers = corsHeaders(env.PUBLIC_ORIGIN);
  headers.append("Set-Cookie", clearCookie(SESSION_COOKIE));
  return json({ ok: true }, 200, headers);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.protocol !== "https:" || url.origin !== env.AUTH_ORIGIN) return json({ error: "invalid_host" }, 400);
    if (request.method === "OPTIONS" && url.pathname === "/v1/session") return new Response(null, { status: 204, headers: corsHeaders(env.PUBLIC_ORIGIN) });
    if (request.method === "GET" && url.pathname === "/v1/login/google") return startGoogleLogin(request, env);
    if (request.method === "GET" && url.pathname === "/v1/callback/google") return finishGoogleLogin(request, env);
    if (request.method === "GET" && url.pathname === "/v1/session") return getSession(request, env);
    if (request.method === "POST" && url.pathname === "/v1/logout") return logout(request, env);
    return json({ error: "not_found" }, 404);
  },
};
