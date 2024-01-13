import { test, expect } from "@playwright/test";

test.describe("RootView", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("WASM-4 Playground");
  });
});
