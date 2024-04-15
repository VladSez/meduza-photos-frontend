import { expect, test } from "@playwright/test";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { SEARCH_TERMS } from "@/ui/search";

import "dayjs/locale/ru";

dayjs.locale("ru");
dayjs.extend(utc);

test("can navigate the app", async ({ page }) => {
  // go to page via url
  await page.goto("/");

  // default url is /feed
  await expect(page).toHaveURL("/feed");

  await expect(page).toHaveTitle("Фотографии войны в Украине | Лента");

  const feedLink = page.getByRole("link", { name: "Лента" });
  const calendarLink = page.getByRole("link", { name: "Календарь" });
  const searchButton = page.getByRole("button", { name: "Поиск..." });

  // nav is shown
  await expect(feedLink).toBeVisible();
  await expect(calendarLink).toBeVisible();
  await expect(searchButton).toBeVisible();

  // timeline is shown
  await expect(page.getByTestId("timeline-month-with-days")).toBeVisible();

  // click calendar link in nav (client-side navigation)
  await calendarLink.click();

  await expect(page).toHaveURL("/calendar");

  await expect(page).toHaveTitle("Фотографии войны в Украине | Календарь");

  await expect(
    page.getByRole("heading", { name: "Хроники войны в Украине" })
  ).toBeVisible();

  await expect(page.getByText("Источник: meduza.io")).toBeVisible();

  // click first article link
  await page.getByTestId("calenday-day-card-link-0").first().click();

  // matches url pattern like /calendar/798, /calendar/123, etc
  await expect(page).toHaveURL(/\/calendar\/\d+/);

  // article is shown
  await expect(page.getByTestId("article-header")).toBeVisible();
  await expect(page.getByTestId("article-date")).toBeVisible();
  await expect(page.getByTestId("article-body")).toBeVisible();
});

test("show 404 for non-existant page", async ({ page }) => {
  // go to page via url
  await page.goto("/non-existant-page");

  await expect(page).toHaveURL("/non-existant-page");

  await expect(page.getByTestId("404-error-page-text")).toBeVisible();

  // below text is splitted so we need two assertions
  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByText("Страница не найдена")).toBeVisible();
});

test("calendar navigation works", async ({ page }) => {
  // go to page via url
  await page.goto("/calendar");

  await expect(page).toHaveURL("/calendar");
  await expect(page).toHaveTitle("Фотографии войны в Украине | Календарь");

  await page.getByRole("button", { name: "Выберите дату" }).click();

  const calendar = page.getByTestId("calendar-date-picker");

  await expect(calendar).toBeVisible();

  const yesterday = dayjs().subtract(1, "day");

  const dateTimeTitle = yesterday.format("YYYY-MM-DD");

  const dateButtonInCalendar = page.locator(`[datetime='${dateTimeTitle}']`);

  // click date on calendar
  await dateButtonInCalendar.click();

  const articleDate = yesterday.format("DD MMMM YYYY");

  // article is shown
  await expect(page.getByTestId("article-header")).toBeVisible();
  await expect(page.getByTestId("article-date")).toHaveText(articleDate);
  await expect(page.getByTestId("article-body")).toBeVisible();
});

test("search works", async ({ page }) => {
  // go to page via url
  await page.goto("/");

  await expect(page).toHaveURL("/feed");

  // open search modal
  await page.getByRole("button", { name: "Поиск..." }).click();

  await expect(
    page.getByRole("button", { name: SEARCH_TERMS[0] })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: SEARCH_TERMS[1] })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: SEARCH_TERMS[2] })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: SEARCH_TERMS[3] })
  ).toBeVisible();

  // start search screen
  await expect(page.getByText("Ничего не найдено")).toBeVisible();

  const searchInput = page.getByTestId("search-input");

  await searchInput.fill("Киев");
  await expect(searchInput).toHaveValue("Киев");

  await expect(
    page.getByRole("button", { name: SEARCH_TERMS[0] })
  ).toBeDisabled();

  await expect(
    page.locator("span").filter({ hasText: "Загрузка..." })
  ).toBeVisible();

  await expect(page.getByText("Результаты: 40")).toBeVisible();

  const searchResult = page.getByTestId(`search-result-0`);
  await expect(searchResult).toBeVisible();

  await searchInput.clear();
  await expect(searchInput).toHaveValue("");

  await expect(page.getByText("История:")).toBeVisible();
  await expect(page.getByRole("button", { name: "киев" })).toBeVisible();

  const deleteSearchQueryBtn = page.getByTestId(`delete-history-0`);
  await deleteSearchQueryBtn.click();

  // search history is cleared
  await expect(page.getByText("История:")).toBeHidden();
  await expect(page.getByRole("button", { name: "киев" })).toBeHidden();

  // start search screen is again visible
  await expect(page.getByText("Ничего не найдено")).toBeVisible();

  const invalidSearchQuery = "Киев 9999999";

  await searchInput.fill(invalidSearchQuery);
  await expect(searchInput).toHaveValue(invalidSearchQuery);

  await expect(
    page.locator("span").filter({ hasText: "Загрузка..." })
  ).toBeVisible();

  await expect(
    page.getByText(`Ничего не найдено по запросу "${invalidSearchQuery}"`)
  ).toBeVisible();

  await expect(page.getByText("Подсказка")).toBeVisible();
});
