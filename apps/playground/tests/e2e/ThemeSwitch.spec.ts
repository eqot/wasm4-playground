import { test, expect } from "@playwright/test";

test.describe("Theme switch", () => {
  test("choose light theme", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("menu")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  });

  test("choose dark theme", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("switch").click();

    await expect(page.getByRole("menu")).toHaveCSS("background-color", "rgb(20, 20, 20)");
  });

  test("choose light theme again", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("switch").click();
    await page.getByRole("switch").click();

    await expect(page.getByRole("menu")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  });
});
