import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const skillTestReport = readFileSync(new URL("../docs/skill-tests/INDIE_EDITORIAL_SHELF_TEST.md", import.meta.url), "utf8");

describe("verified-editorial-game-shelf skill test", () => {
  it("records three factual indie selections with official HTTPS sources and an artwork-safety decision", () => {
    expect(skillTestReport).toContain("Balatro");
    expect(skillTestReport).toContain("Animal Well");
    expect(skillTestReport).toContain("Blue Prince");
    expect(skillTestReport).toContain("https://www.playbalatro.com/");
    expect(skillTestReport).toContain("https://www.animalwell.net/");
    expect(skillTestReport).toContain("https://www.blueprincegame.com/");
    expect(skillTestReport.match(/Original CSS title card only/g)).toHaveLength(3);
  });

  it("labels the selection as editorial and excludes numeric score patterns", () => {
    expect(skillTestReport).toMatch(/editorial only/i);
    expect(skillTestReport).toMatch(/not a PixelGame product catalogue/i);
    expect(skillTestReport).not.toMatch(/\b\d+\s*\/\s*\d+\b|★★★★★|★{3,}/);
  });
});
