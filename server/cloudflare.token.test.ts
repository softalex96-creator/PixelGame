import { describe, expect, it } from "vitest";

describe("Cloudflare deployment credential", () => {
  it("validates the configured token without exposing its value", async () => {
    const token = process.env.CLOUDFLARE_API_TOKEN;
    expect(token, "CLOUDFLARE_API_TOKEN must be configured").toBeTruthy();

    const response = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = (await response.json()) as { success?: boolean };

    expect(response.ok).toBe(true);
    expect(payload.success).toBe(true);
  });
});
