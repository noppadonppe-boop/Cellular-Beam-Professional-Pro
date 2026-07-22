import { expect, test } from "@playwright/test";

test("opens the dashboard demonstration workspace", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Design dashboard" })).toBeVisible();
  await expect(page.getByText("Demonstration workspace")).toBeVisible();
});

test("opens the Manual from the sidebar", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Manual" }).click();
  await expect(page).toHaveURL(/\/manual$/);
  await expect(page.getByRole("heading", { name: "คู่มือการใช้งาน / Manual" })).toBeVisible();
  await expect(page.getByText("ทำงานตามลำดับนี้")).toBeVisible();
});
