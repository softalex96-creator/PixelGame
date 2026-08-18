import { describe, expect, it } from "vitest";
import { filterProducts, products } from "./pixelshelf-data";

describe("PixelShelf catalog filters", () => {
  it("uses each required category as an exact filter", () => {
    expect(filterProducts(products, "Templates", "").every((product) => product.category === "Templates")).toBe(true);
    expect(filterProducts(products, "Design Resources", "").every((product) => product.category === "Design Resources")).toBe(true);
    expect(filterProducts(products, "Business Tools", "").every((product) => product.category === "Business Tools")).toBe(true);
  });

  it("searches products by product title and creator", () => {
    expect(filterProducts(products, "All", "orbit")).toHaveLength(1);
    expect(filterProducts(products, "All", "Northstar").map((product) => product.creator)).toEqual(["Northstar Studio", "Northstar Studio"]);
  });
});
