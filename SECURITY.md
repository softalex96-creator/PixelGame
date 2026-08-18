# PixelGame production security baseline

PixelGame keeps OAuth client secrets, Apple private keys, Steam Web API credentials, Telegram bot tokens, and session-signing keys exclusively in protected server environment variables. They must never be committed to Git, stored in browser storage, embedded in Vite variables, or exposed through GitHub Pages artifacts.

The production deployment sends baseline anti-framing, anti-sniffing, permissions, and referrer headers. HTTPS-only deployments additionally send HSTS and a restrictive Content Security Policy. Any new third-party script, font, image host, or OAuth provider must be explicitly reviewed and allowlisted in the Content Security Policy before use.

When the storefront is published through GitHub Pages, it is a public static artifact rather than the Express deployment described above. No OAuth secret, provider token, session-signing key, or server callback is included in that artifact. Before the custom-domain release, the tracked source and produced Pages files were scanned for common provider-secret markers and the development debug collector was excluded from the static build. GitHub Pages cannot provide application-specific server headers, session protection, or secure OAuth callbacks; those controls require a separate HTTPS backend.

The deployed Cloudflare OAuth Worker keeps the Google client credentials and session-signing key as encrypted Worker secrets. Its Google and Steam login/callback endpoints use a Worker Rate Limiting binding with a separate namespace and a conservative 10-second window, returning `429` before upstream provider requests when the limit is exceeded. Cloudflare documents that edge rate-limit counters are eventually consistent and scoped per Cloudflare location; this is an abuse-control layer rather than an accounting control. GitHub Pages records remain DNS-only to preserve domain and certificate validation, while `auth.pixelgame.pro` is a separate proxied Worker Custom Domain. [1] [2]

### References

[1] [Cloudflare Workers — Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
[2] [Cloudflare Workers — Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

The custom domain should be configured only after HTTPS is active. Production callback URLs must use the exact HTTPS origin `https://pixelgame.pro`; wildcard origins, HTTP callback URLs, and redirect URI patterns are prohibited. OAuth implementations must validate the provider issuer, signature, audience/client ID, redirect URI, expiry, and a one-time `state` value; Google and Apple flows must additionally use nonce and PKCE where supported.

Sessions must use `HttpOnly`, `Secure`, and `SameSite=Lax` cookies on the custom domain. The application must apply rate limits to login starts, callback errors, and Telegram/Steam verification endpoints, return generic authentication errors without credential details, and redact access tokens or secrets from logs.

## Production verification — 18 August 2026

The review confirmed `http://pixelgame.pro` redirects to HTTPS, `pixelgame.pro` has GitHub Pages HTTPS enforcement, and `auth.pixelgame.pro` presents an HTTPS Worker endpoint. The storefront uses no OAuth secret or session-signing key; those values remain in protected Worker secrets. Google login was completed through the exact callback URI and returns to `/#/account` without a route error. Steam login starts with a signed five-minute state cookie and validates the returned OpenID assertion server-side before issuing a session.

Cross-origin probing confirmed that the OAuth session endpoint rejects an untrusted origin with `403` and returns credentials CORS headers only for `https://pixelgame.pro`. The Worker response supplies HSTS, `default-src 'none'` CSP, anti-framing, anti-sniffing, and restrictive permissions headers. Sessions use `HttpOnly`, `Secure`, and `SameSite=Lax` cookies. Apple ID and Telegram remain deliberately disabled until separate credentials and provider-specific reviews are approved.

The final browser check rendered `https://pixelgame.pro/#/account` with the authenticated Google identity, account statistics, USD/EUR/RUB controls, and cart shortcut. Separately, the Steam start route redirected to the official `steamcommunity.com/openid/loginform` endpoint with `auth.pixelgame.pro` as the relying-party realm. This production routing check is accepted without a login to a particular Steam account.
