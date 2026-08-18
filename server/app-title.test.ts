import { describe, expect, it } from "vitest";

describe("managed application title", () => {
  it("uses the requested PixelGame title configuration", () => {
    expect(process.env.VITE_APP_TITLE).toBe("PixelGame");
  });
});
