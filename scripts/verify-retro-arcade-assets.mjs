import assert from "node:assert/strict";
import { chromium } from "playwright";

const storefrontUrl = process.env.PIXELGAME_STOREFRONT_URL ?? "http://127.0.0.1:3000/";
const expectedHeroUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/oWVWGFhAlxuRGpau.png";
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

  const hero = page.locator(".retro-hero-art");
  await hero.waitFor();
  const heroSource = await hero.evaluate((image) => image.currentSrc || image.getAttribute("src") || "");
  const heroDimensions = await hero.evaluate((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight }));
  assert.equal(heroSource, expectedHeroUrl, `${name}: hero must use the final public CDN asset`);
  assert.ok(heroDimensions.complete && heroDimensions.width > 0 && heroDimensions.height > 0, `${name}: hero must resolve to a real image`);

  const laneButtons = page.locator(".arcade-lane-button");
  assert.equal(await laneButtons.count(), 4, `${name}: Arcade Selection Deck must expose four product lanes`);

  assert.equal(await page.locator(".cabinet-game-screen, .pixel-alien, .pixel-defender, .pixel-laser").count(), 0, `${name}: removed hero game-screen animation must not remain in the DOM`);
  const heroIndex = page.locator(".retro-hero-index");
  await heroIndex.waitFor();
  assert.equal(await heroIndex.locator(".retro-hero-stats > div").count(), 3, `${name}: static hero library panel must expose three catalogue facts`);
  const movingHeroDescendants = await heroIndex.locator("*").evaluateAll((elements) => elements.filter((element) => getComputedStyle(element).animationName !== "none").length);
  assert.equal(movingHeroDescendants, 0, `${name}: hero library panel must remain static`);

  const rarityControls = page.locator(".rarity-filter-row button");
  assert.equal(await rarityControls.count(), 6, `${name}: catalogue must expose all rarity filter controls`);

  const productImages = page.locator("#catalog article.retro-product-card .retro-product-image img");
  await productImages.first().waitFor();
  assert.equal(await productImages.count(), 16, `${name}: retro catalogue must render sixteen local-preview goods`);
  const sources = await productImages.evaluateAll((images) => images.map((image) => image.currentSrc || image.getAttribute("src") || ""));
  assert.equal(new Set(sources).size, 4, `${name}: four fictional arcade worlds must have distinct public artwork sources`);
  assert.ok(sources.every((source) => source.startsWith("https://files.manuscdn.com/") && !source.includes("/manus-storage/")), `${name}: product cards must never use preview-only image paths`);
  const rendered = await productImages.evaluateAll((images) => images.map((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight })));
  for (const image of rendered) assert.ok(image.complete && image.width > 0 && image.height > 0, `${name}: product asset must resolve to a real image`);
  const rarityBadges = page.locator("#catalog .retro-rarity-badge");
  assert.equal(await rarityBadges.count(), 16, `${name}: every catalogue card must display its rarity`);
  if (name === "desktop") {
    const firstCard = page.locator("#catalog article.retro-product-card").first();
    await firstCard.hover();
    await page.waitForTimeout(220);
    const hoverTransform = await firstCard.evaluate((element) => getComputedStyle(element).transform);
    assert.notEqual(hoverTransform, "none", `${name}: cartridge card must expose a pixel hover transform`);
  }
  await context.close();
  return `${name}: static hero library, rarity controls, and sixteen public-CDN product images render`;
}

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium", args: ["--no-sandbox"] });
try {
  const results = [];
  for (const run of runs) results.push(await verifyViewport(browser, run));
  console.log(results.join("\n"));
} finally {
  await browser.close();
}
