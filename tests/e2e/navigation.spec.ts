import { expect, test } from "@playwright/test";

test("opens the dashboard foundation", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /แดชบอร์ด|Dashboard/ })).toBeVisible();
  await expect(page.getByText("No verified calculation modules loaded")).toBeVisible();
});
