import { expect, test } from "@playwright/test";

test.describe("College Comparison Flow", () => {
  test("should allow adding colleges to comparison and viewing comparison results", async ({
    page
  }) => {
    // 1. Navigate to the listing page
    await page.goto("/colleges");

    // 2. Select first college to compare
    const compareButtons = page.locator("button:has-text('+ Compare')");
    await expect(compareButtons.first()).toBeVisible();
    await compareButtons.first().click();

    // Verify compare tray appears
    const compareTray = page.locator("aside[aria-label='Compare tray']");
    await expect(compareTray).toBeVisible();
    await expect(compareTray).toContainText("Compare (1/3)");

    // 3. Add second college
    await compareButtons.first().click();
    await expect(compareTray).toContainText("Compare (2/3)");

    // Verify 'Compare now' CTA is active
    const compareNowBtn = compareTray.locator("text=Compare now");
    await expect(compareNowBtn).toBeVisible();

    // 4. Click 'Compare now' to navigate to comparison table page
    await compareNowBtn.click();
    await expect(page).toHaveURL(/\/compare\?ids=/);

    // Verify comparison components rendered, allowing extra time for database connection timeout/fallback
    await expect(page.locator("h1")).toContainText("Compare colleges", {
      timeout: 25000
    });
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Check columns count: Details th + 2 college headers + 1 empty spacer = 4
    const headers = table.locator("thead th");
    await expect(headers).toHaveCount(4);

    // 5. Click remove icon to eject a college
    const removeBtn = table
      .locator("thead th button[aria-label^='Remove']")
      .first();
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
  });
});
