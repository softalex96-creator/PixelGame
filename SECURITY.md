# PixelGame production security baseline

PixelGame keeps OAuth client secrets, Apple private keys, Steam Web API credentials, Telegram bot tokens, and session-signing keys exclusively in protected server environment variables. They must never be committed to Git, stored in browser storage, embedded in Vite variables, or exposed through GitHub Pages artifacts.

The production deployment sends baseline anti-framing, anti-sniffing, permissions, and referrer headers. HTTPS-only deployments additionally send HSTS and a restrictive Content Security Policy. Any new third-party script, font, image host, or OAuth provider must be explicitly reviewed and allowlisted in the Content Security Policy before use.

When the storefront is published through GitHub Pages, it is a public static artifact rather than the Express deployment described above. No OAuth secret, provider token, session-signing key, or server callback is included in that artifact. Before the custom-domain release, the tracked source and produced Pages files were scanned for common provider-secret markers and the development debug collector was excluded from the static build. GitHub Pages cannot provide application-specific server headers, session protection, or secure OAuth callbacks; those controls require a separate HTTPS backend.

The planned Cloudflare OAuth Worker will keep all provider credentials and the session-signing key as encrypted Worker secrets. Its login and callback endpoints will use a Worker Rate Limiting binding with a separate namespace and a conservative 10-second window, and will return `429` before making any upstream provider request when the limit is exceeded. Cloudflare documents that edge rate-limit counters are eventually consistent and scoped per Cloudflare location; this is an abuse-control layer rather than an accounting control. GitHub Pages records remain DNS-only to preserve its domain and certificate validation, while the future `auth` Worker hostname will be its own proxied Custom Domain. [1] [2]

### References

[1] [Cloudflare Workers — Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
[2] [Cloudflare Workers — Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

The custom domain should be configured only after HTTPS is active. Production callback URLs must use the exact HTTPS origin `https://pixelgame.pro`; wildcard origins, HTTP callback URLs, and redirect URI patterns are prohibited. OAuth implementations must validate the provider issuer, signature, audience/client ID, redirect URI, expiry, and a one-time `state` value; Google and Apple flows must additionally use nonce and PKCE where supported.

Sessions must use `HttpOnly`, `Secure`, and `SameSite=Lax` cookies on the custom domain. The application must apply rate limits to login starts, callback errors, and Telegram/Steam verification endpoints, return generic authentication errors without credential details, and redact access tokens or secrets from logs.

Before going live, validate DNS ownership, force HTTPS, review the active OAuth redirect URIs, test login and logout on `pixelgame.pro`, check browser CSP reports, and rotate any credential that has been displayed outside a protected secret field.
