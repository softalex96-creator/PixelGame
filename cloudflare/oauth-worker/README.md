# PixelGame OAuth Worker

This Worker is the only location for provider credentials and signed buyer-session cookies. The GitHub Pages storefront must never receive OAuth client secrets, provider tokens, the session-signing key, or callback traffic.

## Current provider

Google uses Authorization Code with PKCE, a signed five-minute state cookie, nonce validation, token signature verification against Google's JWKS, and an eight-hour signed `HttpOnly; Secure; SameSite=Lax` session cookie scoped to `auth.pixelgame.pro`.

## Required Cloudflare configuration

The Worker requires a verified Cloudflare zone and a Custom Domain at `auth.pixelgame.pro`. Configure the following encrypted Worker secrets in the Cloudflare dashboard after deployment: `SESSION_HMAC_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, and `GOOGLE_OAUTH_CLIENT_SECRET`. Do not commit `.dev.vars`, `.env`, provider private keys, or API tokens.

The Worker config declares an edge rate-limit binding for OAuth start and callback routes. The limiter is an abuse-control layer; session and authorization security never depend on the counter being exact.

## Provider rollout order

Google is implemented first. Steam uses OpenID 2.0, Apple requires a signed client-secret JWT, and Telegram validates a signed login payload; each will be added as a provider-specific server flow only after its developer credential and exact production callback are registered. Do not add generic client-side buttons that claim those providers are active before their server validation exists.
