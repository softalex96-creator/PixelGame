import assert from "node:assert/strict";
import { chromium } from "playwright";

const storefrontUrl = process.env.PIXELGAME_STOREFRONT_URL ?? "http://127.0.0.1:3000/";
const expectedHeroUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/MrhPryEQKFgGvutG.png";
const expectedAssetUrls = [
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/MQfMAJcQaECgYWXj.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/AzvJOJBbUFPCUsIJ.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/ygYQmPsRXarhNggd.png",
];
const runs = [
  { name: "desktop", viewport: { width: 1280, height: 720 } },
  { name: "mobile", viewport: { width: 375, height: 812 } },
];

async function verifyViewport(browser, { name, viewport }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  page.setDefaultNavigationTimeout(45_000);

  await page.goto(`${storefrontUrl}#/`, { waitUntil: "commit" });
  const hero = page.locator(".loadout-hero-image");
  await hero.waitFor();
  const heroSource = await hero.evaluate((image) => image.currentSrc || image.getAttribute("src") || "");
  const heroDimensions = await hero.evaluate((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight }));
  assert.equal(heroSource, expectedHeroUrl, `${name}: hero must use the final public CDN asset`);
  assert.ok(heroDimensions.complete && heroDimensions.width > 0 && heroDimensions.height > 0, `${name}: hero must resolve to a real image`);

  const directoryImages = page.locator(".world-directory-card img");
  await assert.doesNotReject(() => directoryImages.first().waitFor());
  assert.equal(await directoryImages.count(), 3, `${name}: the world directory must display three world images`);

  const sources = await directoryImages.evaluateAll((images) => images.map((image) => image.currentSrc || image.getAttribute("src") || ""));
  assert.deepEqual(sources, expectedAssetUrls, `${name}: directory image order must match the three final public CDN assets`);
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
