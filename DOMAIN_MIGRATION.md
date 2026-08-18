# PixelGame custom domain runbook

## Scope

This runbook covers the migration of the production PixelGame application to `https://pixelgame.pro`. It does not authorize changes to the existing DNS zone until the managed hosting platform has provided the exact verification and routing records.

## Current DNS observation

At the time of preparation, the zone contained an apex `A` record and a `www` CNAME to the apex. They may belong to an existing web host. Do not remove, replace, or add competing apex records until the platform’s required values are visible and the current service owner has approved a cutover window. Preserve any MX, TXT, DKIM, SPF, and DMARC records because they may support email.

## Safe sequence

1. In the PixelGame project settings, request the custom domain `pixelgame.pro` and capture the exact DNS verification and routing values.
2. Compare the required values with the existing DNS zone. If the platform supplies a TXT record, add it without replacing unrelated records. If it supplies an A, AAAA, ALIAS, or CNAME record for the apex, plan a deliberate cutover because it can replace the existing website route.
3. Apply the smallest required change at the registrar. Use a short TTL only while validating the cutover, then restore a normal TTL after success.
4. Wait until ownership verification and TLS are confirmed. Do not register production OAuth redirect URLs before the domain resolves over HTTPS.
5. Configure exact callback URLs under `https://pixelgame.pro`, test sign-in and logout, then retain the former route until the replacement has been validated.

## GitHub Pages destination

The current GitHub Pages deployment is active at `https://softalex96-creator.github.io/PixelGame/` and uses a GitHub Actions workflow. To move the static storefront to `pixelgame.pro`, first set the custom domain in the repository Pages settings, then make the following exact DNS changes at Hostinger.

| Record type | Host | Required value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `softalex96-creator.github.io` |

The existing `A @ → 2.57.91.91` must be removed during the cutover because it conflicts with the required GitHub Pages apex routing. The existing `www → pixelgame.pro` record must be replaced by the direct CNAME to `softalex96-creator.github.io`; pointing `www` to the apex can prevent GitHub Pages HTTPS provisioning. Do not create wildcard records. After DNS resolves, enable GitHub Pages HTTPS enforcement and verify the `CNAME` setting persists in the Pages configuration.

The static storefront must not collect or transmit passwords, payment data, OAuth client secrets, or provider tokens. Secure Google, Steam, Apple ID, and Telegram authentication remains a separate server-side service with exact HTTPS callbacks; it cannot be implemented safely within GitHub Pages alone.

## Cutover status

On 18 August 2026, `pixelgame.pro` was saved as the GitHub Pages custom domain and GitHub started its DNS check. The Hostinger zone has one conflicting apex `A` record (`2.57.91.91`) and a `www` CNAME pointed at the apex. The zone export was downloaded before changing records. The approved next action is to replace only these two routes with the four documented GitHub Pages apex A records and the direct `www → softalex96-creator.github.io` CNAME, then verify DNS resolution and enable HTTPS once GitHub offers the control.

The DNS cutover was completed with all four GitHub Pages IPv4 records at the apex and a direct `www → softalex96-creator.github.io` CNAME. Independent resolution returned all four expected IPv4 addresses, the `www` alias resolved through GitHub, and HTTP returned a GitHub Pages response. GitHub certificate provisioning remained in progress immediately after the DNS change; until it completes and HTTPS is enforced, the domain must not be used for authentication, data entry, or any sensitive action.

The GitHub Actions workflow now builds with a root asset base when `GITHUB_PAGES_CUSTOM_DOMAIN=true`, so production assets resolve at `/assets/...` on `pixelgame.pro` rather than the previous repository path `/PixelGame/assets/...`. The existing hash-based client routing remains in place because GitHub Pages is a static host and needs it for direct navigation to account, checkout, and product routes.

## Planned Cloudflare OAuth backend

The secure OAuth backend will run as a separate Cloudflare Worker at `auth.pixelgame.pro`; GitHub Pages will continue to serve only the public storefront. Cloudflare Workers store provider credentials as encrypted Worker secrets rather than plaintext configuration. A Worker Custom Domain requires an active Cloudflare zone, so `pixelgame.pro` must first be added to Cloudflare and its authoritative nameservers changed at Hostinger before `auth.pixelgame.pro` can become a Cloudflare-managed Custom Domain. The GitHub Pages A and `www` CNAME records must be recreated inside the Cloudflare zone before the nameserver cutover, preserving the storefront while Cloudflare adds the Worker hostname and its certificate. [1] [2] [3]

Cloudflare imported the expected five storefront records: four apex A records and one `www` CNAME. Before activation, every imported GitHub Pages record must be switched to **DNS only** (gray cloud), not proxied. GitHub Pages needs its documented A/CNAME responses visible for custom-domain and certificate validation; proxying the records would hide that routing and risk breaking issuance. A future `auth` Worker hostname may be proxied only after it is attached to the Worker as a Cloudflare Custom Domain.

## TLS status after Cloudflare delegation

Cloudflare nameserver delegation is active and authoritative DNS resolves the expected GitHub Pages A and `www` CNAME records. The GitHub Pages settings page currently shows **DNS Check in Progress** and reports that Enforce HTTPS remains unavailable because its certificate for `pixelgame.pro` has not been issued. The currently served `*.github.io` certificate does not include `pixelgame.pro`, so browsers correctly block the HTTPS page with `NET::ERR_CERT_COMMON_NAME_INVALID`. Do not bypass this warning or enable a production login surface until GitHub finishes its certificate issuance and the Pages setting exposes Enforce HTTPS.

### References

[1] [Cloudflare Workers — Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
[2] [Cloudflare Workers — Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
[3] [Cloudflare Workers — Routes and Domains](https://developers.cloudflare.com/workers/configuration/routing/)

## Rollback

If the custom domain stops serving PixelGame, restore the previous apex record and `www` record exactly as captured before cutover. Do not alter email records as part of rollback. Disable any new OAuth redirect URI that is no longer served by HTTPS.

## Security gate

Before proceeding to external sign-in, validate that HTTPS is active, the browser shows the expected certificate for `pixelgame.pro`, redirect URLs are exact, session cookies are `Secure` and `HttpOnly`, and no secret has been committed to source control or exposed in a client-side environment variable.
