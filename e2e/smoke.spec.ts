import { test, expect, type Page } from "@playwright/test";

/*
 * Public smoke tests: they need no backend and write no data.
 * They check that the built app boots and routes anonymous visitors right.
 */

const SIGN_IN_URL = /\/auth\/sign-in$/;

/** First visit lands on onboarding; skipping it marks it as seen. */
async function skipOnboarding(page: Page) {
  await page.goto("/");
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: /skip/i }).click();
  await expect(page).toHaveURL(SIGN_IN_URL);
}

test.describe("Public smoke", () => {
  test("first visit shows onboarding", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /next/i })).toBeVisible();
  });

  test("skipping onboarding leads to the sign-in form", async ({ page }) => {
    await skipOnboarding(page);

    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("onboarding is shown only once", async ({ page }) => {
    await skipOnboarding(page);

    await page.goto("/");
    await expect(page).toHaveURL(SIGN_IN_URL);
  });

  test("protected routes redirect anonymous visitors to sign-in", async ({
    page,
  }) => {
    await skipOnboarding(page);

    await page.goto("/transactions");
    await expect(page).toHaveURL(SIGN_IN_URL);
  });

  test("legal pages are public", async ({ page }) => {
    await skipOnboarding(page);

    await page.goto("/terms-and-conditions");
    await expect(page).toHaveURL(/\/terms-and-conditions$/);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("sign-in links to sign-up", async ({ page }) => {
    await skipOnboarding(page);

    await page.getByRole("link", { name: /create one/i }).click();
    await expect(page).toHaveURL(/\/auth\/sign-up$/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
});
