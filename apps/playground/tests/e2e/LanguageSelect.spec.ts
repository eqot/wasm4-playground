import { test, expect } from "@playwright/test";

test.describe("Language select", () => {
  test("choose AssemblyScript", async ({ page }) => {
    await page.goto("/");
    await page.locator(".ant-select-selector").click();
    await page.locator(".ant-select-dropdown").getByTitle("AssemblyScript").click();

    await expect(page.getByRole("main")).toContainText("main.ts");
  });

  test("choose WebAssemblyText", async ({ page }) => {
    await page.goto("/");
    await page.locator(".ant-select-selector").click();
    await page.locator(".ant-select-dropdown").getByTitle("WebAssemblyText").click();

    await expect(page.getByRole("main")).toContainText("main.wat");
  });
});
