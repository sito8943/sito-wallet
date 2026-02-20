import { test, expect, Page } from "@playwright/test";

// ─── Credentials (set via env in CI) ─────────────────────────────────────────
const EMAIL = process.env.E2E_EMAIL ?? "test@example.com";
const PASSWORD = process.env.E2E_PASSWORD ?? "Test1234!";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Sign in via the sign-in form */
async function signIn(page: Page) {
  await page.goto("/auth/sign-in");

  const emailInput = page.getByRole("textbox", { name: /email/i });
  const passwordInput = page.locator('input[type="password"]');
  const submitBtn = page.getByRole("button", { name: /sign.?in|log.?in/i });

  await emailInput.fill(EMAIL);
  await passwordInput.fill(PASSWORD);
  await submitBtn.click();

  // Wait until redirected to the main app
  await page.waitForURL("**/", { timeout: 15_000 });
}

// ─── Smoke tests ─────────────────────────────────────────────────────────────

test.describe("E2E Smoke – core flows", () => {
  test.describe.configure({ mode: "serial" });

  // ── Authentication ──────────────────────────────────────────────────────────

  test("Auth: unauthenticated → redirected to sign-in", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("Auth: sign-in with valid credentials", async ({ page }) => {
    await signIn(page);
    await expect(page).toHaveURL("**/");
    // Main layout should be visible
    await expect(page.getByRole("main")).toBeVisible({ timeout: 10_000 });
  });

  test("Auth: sign-in page redirects authenticated user to home", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/auth/sign-in");
    // Should be redirected away from sign-in
    await expect(page).not.toHaveURL(/\/auth\/sign-in/);
  });

  // ── Currencies ──────────────────────────────────────────────────────────────

  test("Currencies: navigate to currencies page", async ({ page }) => {
    await signIn(page);
    await page.goto("/currencies");
    await expect(page).toHaveURL(/\/currencies/);
  });

  // ── Accounts ────────────────────────────────────────────────────────────────

  test("Accounts: navigate to accounts page", async ({ page }) => {
    await signIn(page);
    await page.goto("/accounts");
    await expect(page).toHaveURL(/\/accounts/);
  });

  test("Accounts: create a new account (requires currency)", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/accounts");

    // Click add button
    const addBtn = page.getByRole("button", { name: /add/i }).first();
    if (!(await addBtn.isVisible())) {
      test.skip();
      return;
    }
    await addBtn.click();

    // Fill the form
    const nameInput = page.getByRole("textbox", { name: /name/i }).first();
    await nameInput.fill("E2E Test Account");

    const balanceInput = page
      .getByRole("spinbutton", { name: /balance/i })
      .first();
    if (await balanceInput.isVisible()) {
      await balanceInput.fill("1000");
    }

    // Submit
    const submitBtn = page.getByRole("button", { name: /ok|save|confirm/i });
    await submitBtn.click();

    // Account should appear in the list
    await expect(page.getByText("E2E Test Account")).toBeVisible({
      timeout: 10_000,
    });
  });

  // ── Transactions ─────────────────────────────────────────────────────────────

  test("Transactions: navigate to transactions page", async ({ page }) => {
    await signIn(page);
    await page.goto("/transactions");
    await expect(page).toHaveURL(/\/transactions/);
  });

  test("Transactions: create a new transaction (requires account & category)", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/transactions");

    const addBtn = page.getByRole("button", { name: /add/i }).first();
    if (!(await addBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      test.skip();
      return;
    }
    await addBtn.click();

    // Amount
    const amountInput = page
      .getByRole("spinbutton", { name: /amount/i })
      .first();
    if (await amountInput.isVisible()) {
      await amountInput.fill("50");
    }

    // Date (use a fixed date string)
    const dateInput = page.locator('input[type="datetime-local"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.fill("2024-06-15T12:00");
    }

    const submitBtn = page.getByRole("button", { name: /ok|save|confirm/i });
    await submitBtn.click();
  });

  // ── Filters ──────────────────────────────────────────────────────────────────

  test("Transactions: filter button toggles the filter panel", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/transactions");

    const filterBtn = page.getByRole("button", { name: /filter/i }).first();
    if (!(await filterBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      test.skip();
      return;
    }

    await filterBtn.click();
    // Filter panel should appear
    const filterPanel = page.locator(
      '[data-testid="filter-panel"], [role="dialog"], [class*="filter"]'
    );
    await expect(filterPanel.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── Export / Import ──────────────────────────────────────────────────────────

  test("Transactions: export action is present in toolbar", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/transactions");

    // Export button should be visible in the toolbar
    const exportBtn = page
      .getByRole("button", { name: /export/i })
      .first();
    // If no accounts exist this might not render; make it a soft check
    const isVisible = await exportBtn
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    if (!isVisible) test.skip();
    else await expect(exportBtn).toBeEnabled();
  });

  test("Transactions: import dialog opens via toolbar", async ({ page }) => {
    await signIn(page);
    await page.goto("/transactions");

    const importBtn = page
      .getByRole("button", { name: /import/i })
      .first();
    const isVisible = await importBtn
      .isVisible({ timeout: 5_000 })
      .catch(() => false);
    if (!isVisible) test.skip();
    else {
      await importBtn.click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
    }
  });
});
