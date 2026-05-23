import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the landing page successfully", async ({ page }) => {
    await page.goto("/");

    // Verify page title
    await expect(page).toHaveTitle(/univerdict|collegecompass/i);

    // Verify main page title text
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify main interactive blocks like searching
    const searchInput = page.locator("input[placeholder*='Search']");
    await expect(searchInput).toBeVisible();
  });

  test("should redirect to colleges page on query submission", async ({
    page
  }) => {
    await page.goto("/");

    const searchInput = page.locator("input[placeholder*='Search']");
    await searchInput.fill("IIT");
    await searchInput.press("Enter");

    // Assert that the page redirected to the filter page
    await expect(page).toHaveURL(/.*\/colleges\?search=IIT.*/);
  });
});
