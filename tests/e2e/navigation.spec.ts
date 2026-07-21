import { expect, test } from "@playwright/test";

test("opens the dashboard demonstration workspace", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Design dashboard" })).toBeVisible();
  await expect(page.getByText("Demonstration workspace")).toBeVisible();
});
