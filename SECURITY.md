# PixelGame production security baseline

PixelGame keeps OAuth client secrets, Apple private keys, Steam Web API credentials, Telegram bot tokens, and session-signing keys exclusively in protected server environment variables. They must never be committed to Git, stored in browser storage, embedded in Vite variables, or exposed through GitHub Pages artifacts.

The production deployment sends baseline anti-framing, anti-sniffing, permissions, and referrer headers. HTTPS-only deployments additionally send HSTS and a restrictive Content Security Policy. Any new third-party script, font, image host, or OAuth provider must be explicitly reviewed and allowlisted in the Content Security Policy before use.

The custom domain should be configured only after HTTPS is active. Production callback URLs must use the exact HTTPS origin `https://pixelgame.pro`; wildcard origins, HTTP callback URLs, and redirect URI patterns are prohibited. OAuth implementations must validate the provider issuer, signature, audience/client ID, redirect URI, expiry, and a one-time `state` value; Google and Apple flows must additionally use nonce and PKCE where supported.

Sessions must use `HttpOnly`, `Secure`, and `SameSite=Lax` cookies on the custom domain. The application must apply rate limits to login starts, callback errors, and Telegram/Steam verification endpoints, return generic authentication errors without credential details, and redact access tokens or secrets from logs.

Before going live, validate DNS ownership, force HTTPS, review the active OAuth redirect URIs, test login and logout on `pixelgame.pro`, check browser CSP reports, and rotate any credential that has been displayed outside a protected secret field.

