import { describe, expect, it } from "vitest";
import { editorialDrops, retroClassics } from "../client/src/lib/editorial-drops";

describe("PixelGame New cartridge drops editorial shelf", () => {
  it("keeps a compact factual selection with official sources and no third-party artwork", () => {
    expect(editorialDrops).toHaveLength(3);
    expect(editorialDrops.map((drop) => drop.id)).toEqual(["hades-ii", "split-fiction", "expedition-33"]);
    expect(editorialDrops.every((drop) => drop.officialUrl.startsWith("https://"))).toBe(true);
    expect(editorialDrops.every((drop) => drop.sourceUrl === drop.officialUrl)).toBe(true);
    expect(editorialDrops.every((drop) => !Object.hasOwn(drop, "image"))).toBe(true);
  });

  it("provides editorial descriptions in English and Russian without scores or ratings", () => {
    for (const drop of editorialDrops) {
      expect(drop.copy.en.label).toBeTruthy();
      expect(drop.copy.en.description).toBeTruthy();
      expect(drop.copy.ru.label).toBeTruthy();
      expect(drop.copy.ru.description).toBeTruthy();
      expect(`${drop.copy.en.description} ${drop.copy.ru.description}`).not.toMatch(/\b\d+\s*\/\s*\d+\b|rating|рейтинг/i);
    }
  });

  it("keeps the retro shelf factual, source-linked, and free of third-party artwork fields", () => {
    expect(retroClassics.map((drop) => drop.id)).toEqual(["tetris", "pac-man", "legend-of-zelda"]);
    expect(retroClassics.every((drop) => drop.officialUrl.startsWith("https://") && drop.sourceUrl === drop.officialUrl)).toBe(true);
    expect(retroClassics.every((drop) => !Object.hasOwn(drop, "image"))).toBe(true);
    expect(retroClassics.every((drop) => drop.copy.en.description && drop.copy.ru.description)).toBe(true);
  });
});
