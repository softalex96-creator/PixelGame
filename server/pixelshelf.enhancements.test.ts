import { describe, expect, it } from "vitest";
import { readSavedFavourites, toggleFavouriteId } from "../client/src/contexts/FavouritesContext";
import { resolveInitialTheme } from "../client/src/contexts/ThemeContext";
import { getSearchSuggestions } from "../client/src/lib/pixelshelf-data";

describe("PixelShelf preferences", () => {
  it("uses a valid stored theme and safely falls back to the game-dark default", () => {
    expect(resolveInitialTheme("light")).toBe("light");
    expect(resolveInitialTheme("dark")).toBe("dark");
    expect(resolveInitialTheme("neon")).toBe("dark");
    expect(resolveInitialTheme(null)).toBe("dark");
    expect(resolveInitialTheme("dark", "dark", "?theme=light")).toBe("light");
  });

  it("adds, removes, and de-duplicates favourite bundle IDs", () => {
    const saved = toggleFavouriteId([], "product-nova-explorer");
    expect(saved).toEqual(["product-nova-explorer"]);
    expect(toggleFavouriteId(saved, "product-nova-explorer")).toEqual([]);
    expect(readSavedFavourites('["product-nova-explorer","product-nova-explorer",9]')).toEqual(["product-nova-explorer"]);
    expect(readSavedFavourites("invalid")).toEqual([]);
  });
});

describe("PixelShelf autocomplete", () => {
  it("returns short ranked suggestions from game, currency, and bundle data", () => {
    const suggestions = getSearchSuggestions("neon");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeLessThanOrEqual(5);
    expect(suggestions[0]?.label.toLowerCase()).toContain("neon");
    expect(suggestions.some((suggestion) => suggestion.label === "Neon Drift")).toBe(true);
    expect(suggestions.some((suggestion) => suggestion.type === "currency")).toBe(true);
    expect(getSearchSuggestions("   ")).toEqual([]);
  });
});
