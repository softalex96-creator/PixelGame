import { describe, expect, it } from "vitest";
import { getSecurityHeaders } from "./_core/security";

describe("production security headers", () => {
  it("sets baseline anti-sniffing, framing, referrer, and permissions protections", () => {
    const headers = getSecurityHeaders(false);
    expect(headers).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    expect(headers["Permissions-Policy"]).toContain("payment=()");
    expect(headers["Strict-Transport-Security"]).toBeUndefined();
  });

  it("adds CSP and HTTPS-only transport controls in production", () => {
    const headers = getSecurityHeaders(true);
    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["Strict-Transport-Security"]).toContain("includeSubDomains");
  });
});
