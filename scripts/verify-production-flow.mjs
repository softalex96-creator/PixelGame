import assert from "node:assert/strict";
import { chromium } from "playwright";

const storefrontUrl = process.env.PIXELGAME_STOREFRONT_URL ?? "https://pixelgame.pro/";
const usesHashRouting = storefrontUrl.includes("pixelgame.pro");
const route = (path) => `${storefrontUrl}${usesHashRouting ? `#${path}` : path.slice(1)}`;
const productPath = "/product/neon-drift-turbo-credit-stack";
const runs = [
  { name: "desktop", viewport: { width: 1280, height: 720 } },
  { name: "mobile", viewport: { width: 375, height: 812 } },
];

async function verifyViewport(browser, { name, viewport }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);

  await page.goto(route("/"), { waitUntil: "networkidle" });
  if (name === "desktop") {
    await page.locator(".desktop-nav a").nth(1).click();
    await page.locator("#catalog").waitFor();
    assert.equal(new URL(page.url()).hash.includes("#/#"), false, `${name}: production section navigation must never create a double hash route`);
  }
  await page.getByRole("button", { name: "RUB", exact: true }).click();
  await page.waitForFunction(() => window.localStorage.getItem("pixelgame:display-currency") === "RUB");

  await page.goto(route(productPath), { waitUntil: "networkidle" });
  await page.locator(".product-detail-page button.instant-button").click();
  const quantityIncrease = page.getByRole("button", { name: "Increase quantity" });
  assert.equal(await page.getByRole("button", { name: "Decrease quantity" }).isDisabled(), true, `${name}: a one-item line must not decrement below one`);
  await quantityIncrease.click();
  assert.equal(await page.locator(".quantity-control span").first().textContent(), "2", `${name}: quantity control must update the local cart`);
  await page.getByRole("button", { name: "Continue to checkout" }).click();
  const confirmationDialog = page.getByRole("dialog");
  await confirmationDialog.waitFor();
  assert.equal(await confirmationDialog.getByText("SIMULATED ONLY", { exact: true }).count(), 1, `${name}: confirmation must explicitly identify the local simulation`);
  assert.match(await confirmationDialog.textContent() ?? "", /No payment, account delivery or order is sent outside this browser/, `${name}: dialog must explain that checkout remains local`);
  await page.screenshot({ path: `/home/ubuntu/webdev-static-assets/pixelgame-simulated-checkout-${name}.png`, fullPage: false });
  await confirmationDialog.getByRole("button", { name: "Open simulated checkout" }).click();
  await page.getByRole("heading", { name: "Complete your local order" }).waitFor();
  await page.getByLabel("Email for the delivery preview").fill("qa@example.test");
  await page.getByLabel("Player tag").fill("PixelGameQA#001");
  await page.locator("button.payment-button").click();
  await page.getByRole("heading", { name: "Simulated payment successful" }).waitFor();

  await page.getByRole("link", { name: "View account" }).click();
  await page.getByRole("heading", { name: "Order history" }).waitFor();
  assert.equal(await page.locator(".order-card").count(), 1, `${name}: completed order must appear in account history`);
  assert.equal(await page.getByRole("button", { name: /Apple ID/ }).isDisabled(), true, `${name}: Apple ID must remain disabled`);
  assert.equal(await page.getByRole("button", { name: /Telegram/ }).isDisabled(), true, `${name}: Telegram must remain disabled`);

  await context.close();
  return `${name}: display currency, simulated checkout, account history, and deferred providers passed`;
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
