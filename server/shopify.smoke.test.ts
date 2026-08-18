/**
 * Live smoke test for the Shopify Storefront integration.
 *
 * Goal: verify the declared catalog state. An unseeded store must return no
 * products; a populated store must return at least one usable product with a
 * title, an image, and a non-zero price. This prevents an empty starter store
 * from failing the suite while keeping the populated-catalog check explicit.
 *
 * Behavior:
 *   - Calls the real Storefront API via `listProducts()` (no mocking).
 *   - Auto-skips when `SHOPIFY_STORE_DOMAIN` and the storefront token aren't
 *     configured, so CI environments without credentials stay green.
 *   - Uses SHOPIFY_CATALOG_STATE=populated when a real published catalog is
 *     expected. The current local-preview storefront deliberately defaults to
 *     unseeded, and any unexpected product then fails the test.
 *   - Logs the first 3 normalized products so the agent can see the actual
 *     output (titles, prices, image URLs) without reaching for `curl`.
 *
 * For a more verbose, standalone version see `scripts/shopify-probe.mjs`.
 */

import { describe, expect, it } from "vitest";
import { isShopifyConfigured, listProducts } from "./_core/shopify";

const configured = isShopifyConfigured();
const catalogState = process.env.SHOPIFY_CATALOG_STATE ?? "unseeded";

if (catalogState !== "unseeded" && catalogState !== "populated") {
  throw new Error("SHOPIFY_CATALOG_STATE must be either 'unseeded' or 'populated'");
}

describe.skipIf(!configured)("shopify smoke (live)", () => {
  it(
    "matches the declared catalog state and validates usable products when populated",
    { timeout: 30_000 },
    async () => {
    const products = await listProducts({ first: 10 });

    // Print a compact view so the agent can see the actual normalized output
    // (titles, prices, image URLs) directly in test logs.
    const preview = products.slice(0, 3).map(p => ({
      handle: p.handle,
      title: p.title,
      price: `${p.priceRange.min.amount} ${p.priceRange.min.currencyCode}`,
      firstImage: p.images[0]?.url ?? null,
      variantCount: p.variants.length,
    }));
    // eslint-disable-next-line no-console
    console.log("[shopify smoke] products:", JSON.stringify(preview, null, 2));

    if (catalogState === "unseeded") {
      expect(products, "The local-preview catalog must remain empty until live products are approved").toHaveLength(0);
      return;
    }

    expect(products.length).toBeGreaterThanOrEqual(1);

    const usable = products.find(p => {
      const hasTitle = typeof p.title === "string" && p.title.trim().length > 0;
      const hasImage = (p.images[0]?.url ?? "").length > 0;
      const priceNum = Number.parseFloat(p.priceRange.min.amount);
      const hasPrice = Number.isFinite(priceNum) && priceNum > 0;
      return hasTitle && hasImage && hasPrice;
    });

      expect(
        usable,
        "No product had all three of: title, first image URL, and price > 0"
      ).toBeTruthy();
    }
  );
});

// Visible reminder when the suite is skipped — keeps it from looking like a
// silent pass on misconfigured sandboxes.
describe.skipIf(configured)("shopify smoke (skipped)", () => {
  it("is skipped because SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_API_ACCESS_TOKEN are not set", () => {
    expect(true).toBe(true);
  });
});
