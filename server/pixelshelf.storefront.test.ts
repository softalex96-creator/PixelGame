import { describe, expect, it } from "vitest";
import { addProductToLocalCart, setLocalCartQuantity } from "../client/src/contexts/LocalCartContext";
import { filterProducts, products } from "../client/src/lib/pixelshelf-data";

describe("PixelGame storefront data", () => {
  it("filters the catalog by each required category label", () => {
    expect(filterProducts(products, "Templates", "").every((product) => product.category === "Templates")).toBe(true);
    expect(filterProducts(products, "Design Resources", "").every((product) => product.category === "Design Resources")).toBe(true);
    expect(filterProducts(products, "Business Tools", "").every((product) => product.category === "Business Tools")).toBe(true);
  });

  it("filters the catalog by each featured game world", () => {
    expect(filterProducts(products, "All", "", "NovaVerse").every((product) => product.game === "NovaVerse")).toBe(true);
    expect(filterProducts(products, "All", "", "Arcane Realms").every((product) => product.game === "Arcane Realms")).toBe(true);
    expect(filterProducts(products, "All", "", "Neon Circuit").every((product) => product.game === "Neon Circuit")).toBe(true);
  });

  it("matches currency packs by title and game name", () => {
    expect(filterProducts(products, "All", "champion")).toHaveLength(1);
    expect(filterProducts(products, "All", "novaverse")).toHaveLength(3);
  });

  it("ships three original local-preview bundles for each featured world", () => {
    expect(products).toHaveLength(9);
    for (const world of ["NovaVerse", "Arcane Realms", "Neon Circuit"] as const) {
      const worldProducts = filterProducts(products, "All", "", world);
      expect(worldProducts).toHaveLength(3);
      expect(worldProducts.every((product) => product.image.startsWith("/manus-storage/"))).toBe(true);
      expect(worldProducts.every((product) => product.longDescription.includes("fictional") || product.longDescription.includes("original"))).toBe(true);
    }
  });
});

describe("PixelShelf local cart", () => {
  it("increments an existing item and removes a line when its quantity becomes zero", () => {
    const product = products[0];
    const once = addProductToLocalCart([], product);
    const twice = addProductToLocalCart(once, product);
    expect(twice).toEqual([{ product, quantity: 2 }]);
    expect(setLocalCartQuantity(twice, product.id, 0)).toEqual([]);
  });
});
