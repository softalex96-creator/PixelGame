import { describe, expect, it } from "vitest";
import { parsePendingHomeSectionState } from "../client/src/components/HomeSectionLink";

describe("PixelGame GitHub Pages section navigation", () => {
  it("accepts only useful pending catalogue state and safely ignores malformed storage", () => {
    expect(parsePendingHomeSectionState('{"query":"turbo","showSaved":true}')).toEqual({ query: "turbo", showSaved: true });
    expect(parsePendingHomeSectionState('{"query":"   "}')).toBeNull();
    expect(parsePendingHomeSectionState('{"showSaved":false}')).toBeNull();
    expect(parsePendingHomeSectionState("not-json")).toBeNull();
  });
});
