import { describe, expect, it } from "vitest";

describe("Cloudflare deployment credential", () => {
  it("validates the configured token without exposing its value", async () => {
    const token = process.env.CLOUDFLARE_API_TOKEN;
    expect(token, "CLOUDFLARE_API_TOKEN must be configured").toBeTruthy();

    const response = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(12_000),
    });
    const payload = (await response.json()) as { success?: boolean };

    expect(response.ok).toBe(true);
    expect(payload.success).toBe(true);
  }, 15_000);
});

describe("Google OAuth deployment credentials", () => {
  it("reaches the Google token endpoint with configured client credentials without exposing them", async () => {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    expect(clientId, "GOOGLE_OAUTH_CLIENT_ID must be configured").toBeTruthy();
    expect(clientSecret, "GOOGLE_OAUTH_CLIENT_SECRET must be configured").toBeTruthy();

    const response = await fetch("https://oauth2.googleapis.com/token", {
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code: "pixelgame-credential-probe",
        grant_type: "authorization_code",
        redirect_uri: "https://auth.pixelgame.pro/v1/callback/google",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    });
    const payload = (await response.json()) as { error?: string };

    // A deliberately unusable code must fail after client authentication with invalid_grant.
    // Invalid or mismatched client credentials instead return invalid_client.
    expect(payload.error).toBe("invalid_grant");
  });
});
