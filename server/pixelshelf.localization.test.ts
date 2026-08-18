import { describe, expect, it } from "vitest";
import { getLocalizedCategory, getLocalizedProduct, resolveInitialLocale } from "../client/src/contexts/LanguageContext";
import { products } from "../client/src/lib/pixelshelf-data";

describe("PixelShelf language localization", () => {
  it("returns the default English product presentation", () => {
    const product = products[0];
    expect(getLocalizedProduct(product, "en")).toBe(product);
  });

  it("returns Russian buyer-facing product text while preserving commerce identity", () => {
    const product = products[0];
    const localized = getLocalizedProduct(product, "ru");
    expect(localized.id).toBe(product.id);
    expect(localized.price).toBe(product.price);
    expect(localized.title).toBe(product.title);
    expect(localized.description).toContain("Оригинальный товар PixelGame");
    expect(localized.delivery).toBe("Локальная демонстрационная выдача");
  });

  it("resolves Russian category labels and honors query language over persisted language", () => {
    expect(getLocalizedCategory("Currency", "ru")).toBe("Валюта");
    expect(resolveInitialLocale("ru", "?lang=en")).toBe("en");
    expect(resolveInitialLocale("ru", "")).toBe("ru");
    expect(resolveInitialLocale(null, "?lang=ru")).toBe("ru");
  });
});
