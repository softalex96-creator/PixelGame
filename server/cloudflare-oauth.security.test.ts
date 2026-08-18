import { describe, expect, it } from "vitest";
import {
  accountReturnUrl,
  codeChallenge,
  createOAuthState,
  readOAuthState,
  securityHeaders,
  steamIdFromClaimedId,
} from "../cloudflare/oauth-worker/src/security";

describe("Cloudflare OAuth security helpers", () => {
  const secret = "test-only-hmac-secret";

  it("issues a short-lived signed state and rejects a tampered state cookie", async () => {
    const now = 1_700_000_000_000;
    const { cookieValue, payload } = await createOAuthState("google", secret, now);
    const restored = await readOAuthState(cookieValue, secret, "google", now + 60_000);

    expect(restored).toMatchObject({ provider: "google", state: payload.state, nonce: payload.nonce });
    expect(await readOAuthState(`${cookieValue}x`, secret, "google", now + 60_000)).toBeNull();
    expect(await readOAuthState(cookieValue, secret, "google", now + 5 * 60 * 1000)).toBeNull();
  });

  it("creates an S256 PKCE challenge without leaking the verifier", async () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    expect(await codeChallenge(verifier)).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });

  it("emits restrictive headers for the OAuth origin", () => {
    const headers = securityHeaders();
    expect(headers.get("Content-Security-Policy")).toContain("default-src 'none'");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Strict-Transport-Security")).toContain("includeSubDomains");
  });

  it("returns to the exact hash-account route without OAuth query text", () => {
    expect(accountReturnUrl("https://pixelgame.pro")).toBe("https://pixelgame.pro/#/account");
  });

  it("accepts only a canonical 17-digit Steam OpenID claimed ID", () => {
    expect(steamIdFromClaimedId("https://steamcommunity.com/openid/id/76561198000000000")).toBe("76561198000000000");
    expect(steamIdFromClaimedId("http://steamcommunity.com/openid/id/76561198000000000")).toBeNull();
    expect(steamIdFromClaimedId("https://steamcommunity.com/openid/id/1234")).toBeNull();
  });
});
