import type { RequestHandler } from "express";

export function getSecurityHeaders(isProduction: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };

  if (isProduction) {
    headers["Content-Security-Policy"] = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https://files.manuscdn.com",
      "object-src 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "upgrade-insecure-requests",
    ].join("; ");
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
  }

  return headers;
}

export function securityHeaders(): RequestHandler {
  const headers = getSecurityHeaders(process.env.NODE_ENV === "production");
  return (_req, res, next) => {
    for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
    next();
  };
}
