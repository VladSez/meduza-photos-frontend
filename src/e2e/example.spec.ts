import { expect, test } from "@playwright/test";

test("can navigate the app", async ({ page }) => {
  // to to page via url
  await page.goto("/");

  // default url is /feed
  await expect(page).toHaveURL("/feed");

  const feedLink = page.getByRole("link", { name: "Лента" });
  const calendarLink = page.getByRole("link", { name: "Календарь" });

  await expect(feedLink).toBeVisible();
  await expect(calendarLink).toBeVisible();

  // click calendar link in nav (client-side navigation)
  await calendarLink.click();

  await expect(page).toHaveURL("/calendar");

  await expect(
    page.getByRole("heading", { name: "Хроники войны в Украине" })
  ).toBeVisible();

  await expect(page.getByText("Источник: meduza.io")).toBeVisible();
});
