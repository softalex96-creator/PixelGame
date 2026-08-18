import { describe, expect, it } from "vitest";
import { addProductToLocalCart, setLocalCartQuantity } from "../client/src/contexts/LocalCartContext";
import { filterProducts, products } from "../client/src/lib/pixelshelf-data";

describe("PixelShelf storefront data", () => {
  it("filters the catalog by each required category label", () => {
    expect(filterProducts(products, "Templates", "").every((product) => product.category === "Templates")).toBe(true);
    expect(filterProducts(products, "Design Resources", "").every((product) => product.category === "Design Resources")).toBe(true);
    expect(filterProducts(products, "Business Tools", "").every((product) => product.category === "Business Tools")).toBe(true);
  });

  it("matches assets by product title and creator", () => {
    expect(filterProducts(products, "All", "orbit")).toHaveLength(1);
    expect(filterProducts(products, "All", "Northstar")).toHaveLength(2);
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
