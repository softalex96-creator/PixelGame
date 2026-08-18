import assert from "node:assert/strict";
import { chromium } from "playwright";

const storefrontUrl = process.env.PIXELGAME_STOREFRONT_URL ?? "http://127.0.0.1:3000/";
const expectedAssetNames = [
  "pixelgame-world-novaverse-v2_89f75f77.png",
  "pixelgame-world-arcane-v2_d0db31c9.png",
  "pixelgame-world-neon-v2_f2a96e53.png",
];
const runs = [
  { name: "desktop", viewport: { width: 1280, height: 720 } },
  { name: "mobile", viewport: { width: 375, height: 812 } },
];

async function verifyViewport(browser, { name, viewport }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);

  await page.goto(`${storefrontUrl}#/`, { waitUntil: "networkidle" });
  const directoryImages = page.locator(".world-directory-card img");
  await assert.doesNotReject(() => directoryImages.first().waitFor());
  assert.equal(await directoryImages.count(), 3, `${name}: the world directory must display three world images`);

  const sources = await directoryImages.evaluateAll((images) => images.map((image) => image.currentSrc || image.getAttribute("src") || ""));
  const assetNames = sources.map((source) => new URL(source).pathname.split("/").pop());
  assert.deepEqual(assetNames, expectedAssetNames, `${name}: directory image order must match the three final world assets`);
  assert.equal(new Set(sources).size, 3, `${name}: world directory assets must be distinct`);

  const rendered = await directoryImages.evaluateAll((images) => images.map((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight })));
  for (const image of rendered) {
    assert.equal(image.complete, true, `${name}: world asset must complete loading`);
    assert.ok(image.width > 0 && image.height > 0, `${name}: world asset must resolve to a real image`);
  }

  const productImageSources = await page.locator("article.product-card .product-image-wrap img").evaluateAll((images) => images.map((image) => image.currentSrc || image.getAttribute("src") || ""));
  for (const source of sources) assert.ok(productImageSources.includes(source), `${name}: directory asset must also appear in a product card`);

  await context.close();
  return `${name}: three distinct, completed world assets render in directory and cards`;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

try {
  const results = [];
  for (const run of runs) results.push(await verifyViewport(browser, run));
  console.log(results.join("\n"));
} finally {
  await browser.close();
}
