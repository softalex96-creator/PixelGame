export const OAUTH_STATE_COOKIE = "__Host-pixelgame-oauth";
export const SESSION_COOKIE = "__Host-pixelgame-session";
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export type OAuthProvider = "google";

export interface OAuthStatePayload {
  provider: OAuthProvider;
  state: string;
  nonce: string;
  codeVerifier: string;
  expiresAt: number;
}

export interface BuyerSession {
  sub: string;
  email: string;
  provider: OAuthProvider;
  expiresAt: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  const raw = String.fromCharCode(...Array.from(bytes));
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function utf8(value: string): ArrayBuffer {
  return toArrayBuffer(textEncoder.encode(value));
}

function randomBase64Url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", utf8(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function signValue(value: string, secret: string): Promise<string> {
  const signature = await crypto.subtle.sign("HMAC", await importHmacKey(secret), utf8(value));
  return `${value}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function readSignedValue<T>(signedValue: string, secret: string): Promise<T | null> {
  const separator = signedValue.lastIndexOf(".");
  if (separator < 1) return null;

  const encodedValue = signedValue.slice(0, separator);
  const suppliedSignature = signedValue.slice(separator + 1);
  const signature = base64UrlDecode(suppliedSignature);
  const isValid = await crypto.subtle.verify("HMAC", await importHmacKey(secret), toArrayBuffer(signature), utf8(encodedValue));
  if (!isValid) return null;

  try {
    return JSON.parse(textDecoder.decode(base64UrlDecode(encodedValue))) as T;
  } catch {
    return null;
  }
}

export async function createOAuthState(provider: OAuthProvider, sessionSecret: string, now = Date.now()) {
  const payload: OAuthStatePayload = {
    provider,
    state: randomBase64Url(32),
    nonce: randomBase64Url(32),
    codeVerifier: randomBase64Url(48),
    expiresAt: now + 5 * 60 * 1000,
  };
  const encodedPayload = base64UrlEncode(textEncoder.encode(JSON.stringify(payload)));
  return { payload, cookieValue: await signValue(encodedPayload, sessionSecret) };
}

export async function readOAuthState(cookieValue: string | undefined, sessionSecret: string, now = Date.now()): Promise<OAuthStatePayload | null> {
  if (!cookieValue) return null;
  const payload = await readSignedValue<OAuthStatePayload>(cookieValue, sessionSecret);
  if (!payload || payload.expiresAt <= now || payload.provider !== "google") return null;
  return payload;
}

export async function codeChallenge(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", utf8(codeVerifier));
  return base64UrlEncode(new Uint8Array(digest));
}

export async function createBuyerSession(session: BuyerSession, sessionSecret: string): Promise<string> {
  return signValue(base64UrlEncode(textEncoder.encode(JSON.stringify(session))), sessionSecret);
}

export async function readBuyerSession(cookieValue: string | undefined, sessionSecret: string, now = Date.now()): Promise<BuyerSession | null> {
  if (!cookieValue) return null;
  const session = await readSignedValue<BuyerSession>(cookieValue, sessionSecret);
  if (!session || session.expiresAt <= now || session.provider !== "google" || !session.sub || !session.email) return null;
  return session;
}

export function readCookie(request: Request, name: string): string | undefined {
  const source = request.headers.get("cookie") ?? "";
  const entry = source.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return entry?.slice(name.length + 1);
}

export function serializeCookie(name: string, value: string, maxAgeSeconds: number): string {
  return `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearCookie(name: string): string {
  return `${name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export function securityHeaders(): Headers {
  return new Headers({
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
}

export function corsHeaders(publicOrigin: string): Headers {
  return new Headers({
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": publicOrigin,
    Vary: "Origin",
  });
}
