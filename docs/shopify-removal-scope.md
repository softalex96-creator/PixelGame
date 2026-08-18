# Shopify removal scope — PixelGame

## Decision

PixelGame will no longer use Shopify in its storefront runtime. The public catalogue, cart and simulated checkout will remain local and self-contained. This change does **not** delete or mutate the externally configured Shopify store, its account, products or credentials; it only removes the project’s runtime code and automated checks that depend on it.

## Confirmed current dependency inventory

| Area | Current dependency | Planned action |
| --- | --- | --- |
| Backend routing | `server/routers.ts` mounts `commerceRouter` | Remove commerce router mount and import |
| Server integration | `server/_core/shopify.ts`, `server/_core/shopifyNormalize.ts`, `server/routers/commerce.ts` | Remove unused runtime scaffold |
| Client integration | `client/src/contexts/CartContext.tsx` and `shared/commerce/types.ts` | Remove unused external-cart context and types; `App.tsx` already uses `LocalCartProvider` only |
| Test/release tooling | `server/commerce.router.test.ts`, `server/shopify.smoke.test.ts`, `scripts/shopify-probe.runner.ts`, package scripts | Remove Shopify-specific tests and scripts; preserve/extend local catalog coverage |
| Documentation | `references/shopify.md` | Remove or archive project-local integration reference so it cannot guide future storefront work |

## Retained behaviour

`LocalCartContext`, local orders, the simulated checkout, favourites, display currency, bilingual UI and the separate OAuth worker remain unchanged. No real payment processing, seller marketplace, account trading or external delivery claims will be introduced as part of this redesign.
