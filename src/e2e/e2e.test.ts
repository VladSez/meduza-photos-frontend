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

  // meta data tags
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Лента событий войны в Украине."
  );

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute(
    "content",
    "Фотографии войны в Украине."
  );

  const ogImageFormat = page.locator('meta[property="og:image:type"]');
  await expect(ogImageFormat).toHaveAttribute("content", "image/png");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Фотографии войны в Украине. Лента событий"
  );

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBeTruthy();

  // check that open graph image is accessible
  const ogImageResponse = await fetch(ogImageUrl ?? "").catch(console.error);

  expect(ogImageResponse?.ok).toBeTruthy();
  expect(ogImageResponse?.status).toBe(200);
  expect(ogImageResponse?.headers.get("content-type")).toBe("image/png");

  // twitter meta tags
  const twiiterMetaTitle = page.locator('meta[name="twitter:title"]');
  await expect(twiiterMetaTitle).toHaveAttribute(
    "content",
    "Фотографии войны в Украине."
  );

  const twitterImageFormat = page.locator('meta[name="twitter:image:type"]');
  await expect(twitterImageFormat).toHaveAttribute("content", "image/png");

  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(twitterImageUrl).toBeTruthy();

  // check that twitter image is accessible
  const twitterImageResponse = await fetch(twitterImageUrl ?? "").catch(
    console.error
  );

  expect(twitterImageResponse?.ok).toBeTruthy();
  expect(twitterImageResponse?.status).toBe(200);
  expect(twitterImageResponse?.headers.get("content-type")).toBe("image/png");

  // check nav bar
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

  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Календарь событий войны в Украине."
  );

  // open graph meta tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute(
    "content",
    "Фотографии войны в Украине."
  );

  const ogImageFormat = page.locator('meta[property="og:image:type"]');
  await expect(ogImageFormat).toHaveAttribute("content", "image/png");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Фотографии войны в Украине. Календарь событий"
  );

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBeTruthy();

  // check that open graph image is accessible
  const ogImageResponse = await fetch(ogImageUrl ?? "").catch(console.error);

  expect(ogImageResponse?.ok).toBeTruthy();
  expect(ogImageResponse?.status).toBe(200);
  expect(ogImageResponse?.headers.get("content-type")).toBe("image/png");

  // twitter meta tags
  const twitterImageFormat = page.locator('meta[name="twitter:image:type"]');
  await expect(twitterImageFormat).toHaveAttribute("content", "image/png");

  const twitterImageAlt = page.locator('meta[name="twitter:image:alt"]');
  await expect(twitterImageAlt).toHaveAttribute(
    "content",
    "Фотографии войны в Украине. Календарь событий"
  );

  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(twitterImageUrl).toBeTruthy();

  // check that open graph image is accessible
  const twitterImageResponse = await fetch(twitterImageUrl ?? "").catch(
    console.error
  );

  expect(twitterImageResponse?.ok).toBeTruthy();
  expect(twitterImageResponse?.status).toBe(200);
  expect(twitterImageResponse?.headers.get("content-type")).toBe("image/png");

  await page.getByRole("button", { name: "Выберите дату" }).click();

  const calendar = page.getByTestId("calendar-date-picker");

  await expect(calendar).toBeVisible();

  const yesterday = dayjs().subtract(1, "day");

  const dateTimeTitle = yesterday.format("YYYY-MM-DD");

  const dateButtonInCalendar = page.locator(`[datetime='${dateTimeTitle}']`);

  // click date on calendar (you will be redirected to article page)
  await dateButtonInCalendar.click();

  // article page is shown (you are on new page)

  const articleDate = yesterday.format("DD MMMM YYYY");

  await expect(page.getByTestId("article-header")).toBeVisible();
  await expect(page.getByTestId("article-date")).toHaveText(articleDate);
  await expect(page.getByTestId("article-body")).toBeVisible();

  // check meta tags

  // open graph meta tags
  const articleMetaContent = page
    .locator('meta[name="description"]')
    .getAttribute("content");

  expect(articleMetaContent).toBeDefined();
  expect(articleMetaContent).not.toBe("");

  const articleOgTitle = page.locator('meta[property="og:title"]');
  const title = await articleOgTitle.getAttribute("content");
  expect(title).toBeTruthy();

  const articleOgMetaContent = page
    .locator('meta[property="og:description"]')
    .getAttribute("content");

  expect(articleOgMetaContent).toBeDefined();
  expect(articleOgMetaContent).not.toBe("");

  const articleOgImageFormat = page.locator('meta[property="og:image:type"]');
  await expect(articleOgImageFormat).toHaveAttribute("content", "image/png");

  const articleOgImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(articleOgImageAlt).toHaveAttribute(
    "content",
    "Фотографии войны в Украине"
  );

  const articleOgImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(articleOgImageUrl).toBeTruthy();

  // check that open graph image is accessible
  const articleOgImageResponse = await fetch(articleOgImageUrl ?? "").catch(
    console.error
  );

  expect(articleOgImageResponse?.ok).toBeTruthy();
  expect(articleOgImageResponse?.status).toBe(200);
  expect(articleOgImageResponse?.headers.get("content-type")).toBe("image/png");

  // twitter meta tags
  const articleTwitterImageFormat = page.locator(
    'meta[name="twitter:image:type"]'
  );
  await expect(articleTwitterImageFormat).toHaveAttribute(
    "content",
    "image/png"
  );

  const articleTwitterImageAlt = page.locator('meta[name="twitter:image:alt"]');
  await expect(articleTwitterImageAlt).toHaveAttribute(
    "content",
    "Фотографии войны в Украине"
  );

  const articleTwitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(articleTwitterImageUrl).toBeTruthy();

  // check that twitter image is accessible
  const articleTwitterImageResponse = await fetch(
    articleTwitterImageUrl ?? ""
  ).catch(console.error);

  expect(articleTwitterImageResponse?.ok).toBeTruthy();
  expect(articleTwitterImageResponse?.status).toBe(200);
  expect(articleTwitterImageResponse?.headers.get("content-type")).toBe(
    "image/png"
  );
});

test("search works", async ({ page }) => {
  // go to page via url
  await page.goto("/");

  await expect(page).toHaveURL("/feed");

  // open search modal
  await page.getByRole("button", { name: "Поиск..." }).click();

  // get all search chips
  const searchSuggestionsButtons = page.getByTestId("search-chip");
  const searchSuggestionsButtonsCount = await searchSuggestionsButtons.count();

  // all search chips are visible
  for (let i = 0; i < searchSuggestionsButtonsCount; ++i) {
    await expect(searchSuggestionsButtons.nth(i)).toBeVisible();

    const text = SEARCH_TERMS[i];
    await expect(searchSuggestionsButtons.nth(i)).toHaveText(text ?? "");
    await expect(searchSuggestionsButtons.nth(i)).toBeEnabled();
  }

  // start search screen
  await expect(page.getByText("Попробуйте поискать что-нибудь")).toBeVisible();

  const searchInput = page.getByTestId("search-input");

  const validSearchQuery = "Киев";

  await searchInput.fill(validSearchQuery);
  await expect(searchInput).toHaveValue(validSearchQuery);

  // all search chips are disabled during loading
  for (let i = 0; i < searchSuggestionsButtonsCount; ++i) {
    await expect(searchSuggestionsButtons.nth(i)).toBeDisabled();
  }

  const searchSpinner = page
    .getByTestId("search-screen-loading")
    .filter({ hasText: "Загрузка..." });

  await expect(searchSpinner).toBeVisible();

  await expect(page.getByText("Результаты: 40")).toBeVisible();

  const searchResult = page.getByTestId(`search-result-0`);
  await expect(searchResult).toBeVisible();

  await searchInput.clear();
  await expect(searchInput).toHaveValue("");

  // history is shown when input is empty and search query is saved in history
  await expect(page.getByText("История:")).toBeVisible();
  await expect(
    page
      .getByRole("button")
      .and(page.getByTestId(`apply-history-search-query-${validSearchQuery}`))
  ).toBeVisible();

  // click on search query from history
  const applySearchQueryBtn = page.getByTestId(
    `apply-history-search-query-${validSearchQuery}`
  );

  // click on search query from history
  await applySearchQueryBtn.click();
  await expect(searchInput).toHaveValue(validSearchQuery);

  await expect(searchSpinner).toBeVisible();

  // search results are shown
  await expect(page.getByText("Результаты: 40")).toBeVisible();

  // clear input
  await searchInput.clear();
  await expect(searchInput).toHaveValue("");

  // history is shown once again
  await expect(page.getByText("История:")).toBeVisible();

  await expect(
    page
      .getByRole("button")
      .and(page.getByTestId(`apply-history-search-query-${validSearchQuery}`))
  ).toBeVisible();

  // delete search query from history
  const deleteSearchQueryBtn = page.getByTestId(
    `delete-history-search-query-${validSearchQuery}`
  );
  // delete search query from history
  await deleteSearchQueryBtn.click();

  // search history is cleared
  await expect(page.getByText("История:")).toBeHidden();

  await expect(
    page
      .getByRole("button")
      .and(page.getByTestId(`apply-history-search-query-${validSearchQuery}`))
  ).toBeHidden();

  // start search screen is again visible when history is empty and input is empty
  await expect(page.getByText("Попробуйте поискать что-нибудь")).toBeVisible();

  const invalidSearchQuery = "Киев 9999999";

  await searchInput.fill(invalidSearchQuery);
  await expect(searchInput).toHaveValue(invalidSearchQuery);

  await expect(searchSpinner).toBeVisible();

  await expect(
    page.getByText(`Ничего не найдено по запросу "${invalidSearchQuery}"`)
  ).toBeVisible();

  // clear input
  await searchInput.clear();
  await expect(searchInput).toHaveValue("");

  // start search screen is again visible when history is empty and input is empty
  await expect(page.getByText("Попробуйте поискать что-нибудь")).toBeVisible();

  // click on search suggestion
  const searchSuggestionButton = page.getByRole("button", {
    name: SEARCH_TERMS[0],
  });

  await searchSuggestionButton.click();
  await expect(searchInput).toHaveValue(SEARCH_TERMS[0]);

  await expect(searchSuggestionButton).toHaveAttribute("data-active", "true");

  await expect(searchSpinner).toBeVisible();

  await expect(page.getByText("Результаты: 1")).toBeVisible();
  await expect(page.getByTestId(`search-result-0`)).toBeVisible();

  // tip is shown in footer
  await expect(page.getByText("Подсказка")).toBeVisible();
});
