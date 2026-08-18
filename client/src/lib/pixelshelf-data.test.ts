import { describe, expect, it } from "vitest";
import { filterProducts, products } from "./pixelshelf-data";

describe("PixelGame retro arcade catalog filters", () => {
  it("uses each required product type as an exact filter", () => {
    for (const category of ["Currency", "Skins", "Mods", "Guides"] as const) {
      const results = filterProducts(products, category, "");
      expect(results).toHaveLength(4);
      expect(results.every((product) => product.category === category)).toBe(true);
    }
  });

  it("searches products by original title, game and product type", () => {
    expect(filterProducts(products, "All", "chrome comet")).toHaveLength(1);
    expect(filterProducts(products, "All", "neon drift")).toHaveLength(4);
    expect(filterProducts(products, "All", "guide")).toHaveLength(4);
  });
});
