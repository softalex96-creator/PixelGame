import { describe, expect, it } from "vitest";
import { addProductToLocalCart, setLocalCartQuantity } from "../client/src/contexts/LocalCartContext";
import { filterProducts, products } from "../client/src/lib/pixelshelf-data";

describe("PixelGame retro arcade storefront data", () => {
  it("filters the catalog by every local product-type lane", () => {
    for (const category of ["Currency", "Skins", "Mods", "Guides"] as const) {
      expect(filterProducts(products, category, "").every((product) => product.category === category)).toBe(true);
    }
  });

  it("filters every featured fictional arcade world", () => {
    for (const world of ["Neon Drift", "Star Siege '86", "Ironwood Quest", "Circuit Brawl"] as const) {
      const results = filterProducts(products, "All", "", world);
      expect(results).toHaveLength(4);
      expect(results.every((product) => product.game === world)).toBe(true);
    }
  });

  it("filters rarity tiers independently and alongside game/category filters", () => {
    const legendary = filterProducts(products, "All", "", "All games", "Legendary");
    expect(legendary.map((product) => product.title)).toEqual(["Ion Ranger Suit"]);
    const rareIronwood = filterProducts(products, "Skins", "", "Ironwood Quest", "Rare");
    expect(rareIronwood.map((product) => product.title)).toEqual(["Mossbound Cloak"]);
    expect(filterProducts(products, "All", "", "All games", "All rarity")).toHaveLength(16);
  });

  it("ships sixteen original local-preview digital goods without preview-only image paths", () => {
    expect(products).toHaveLength(16);
    expect(products.every((product) => product.image.startsWith("https://files.manuscdn.com/"))).toBe(true);
    expect(products.every((product) => !product.image.startsWith("/manus-storage/"))).toBe(true);
    expect(products.every((product) => product.delivery === "Local preview delivery")).toBe(true);
    expect(products.every((product) => product.longDescription.includes("No real charge"))).toBe(true);
    expect(products.every((product) => ["Common", "Uncommon", "Rare", "Epic", "Legendary"].includes(product.rarity))).toBe(true);
  });
});

describe("PixelGame local arcade cart", () => {
  it("increments an existing item and removes a line when its quantity becomes zero", () => {
    const product = products[0];
    const once = addProductToLocalCart([], product);
    const twice = addProductToLocalCart(once, product);
    expect(twice).toEqual([{ product, quantity: 2 }]);
    expect(setLocalCartQuantity(twice, product.id, 0)).toEqual([]);
  });
});
