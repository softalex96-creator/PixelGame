import { describe, expect, it } from "vitest";
import { providerLoginUrl, resolveAuthConfig } from "../client/src/lib/auth-client";

describe("static storefront auth client", () => {
  it("enables sign-in only for an explicit HTTPS OAuth origin", () => {
    expect(resolveAuthConfig("true", "https://auth.pixelgame.pro")).toEqual({ authOrigin: "https://auth.pixelgame.pro", enabled: true });
    expect(resolveAuthConfig("true", "http://auth.pixelgame.pro").enabled).toBe(false);
    expect(resolveAuthConfig(undefined, "https://auth.pixelgame.pro").enabled).toBe(false);
  });

  it("uses fixed server-side endpoints for the enabled providers", () => {
    expect(providerLoginUrl("https://auth.pixelgame.pro", "google")).toBe("https://auth.pixelgame.pro/v1/login/google");
    expect(providerLoginUrl("https://auth.pixelgame.pro", "steam")).toBe("https://auth.pixelgame.pro/v1/login/steam");
  });
});
