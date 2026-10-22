import { test, expect } from "@playwright/test";
import * as allure from "allure-js-commons";

test.describe("Hootel", () => {
  test.beforeEach(async ({ page }) => {
    await allure.epic("Hootel");
    await page.goto("/");
  });

  test("Hootel Login", async ({ page }) => {
    await allure.description("A belépés tesztelése");
    await allure.feature("Bejelentkezés");
    await allure.severity("trivial");
    await allure.tag("login");

    await allure.step("Bejelentkezés oldal megnyitása", async () => {
      await page.locator('a:has-text("Bejelentkezés")').click();
    });

    await allure.step("Belépési adatok megadása", async () => {
      await page.locator("#email").fill("hiwasi1765@wisnick.com");
      await page.locator("#password").fill("tesztelek2021");
      await page.locator('button[name="submit"]').click();
    });

    await allure.step("Kilépés link ellenőrzése", async () => {
      await expect(page.locator("#logout-link")).toHaveText("Kilépés");
    });
  });

  test("Hotel lista", async ({ page }) => {
    await allure.description("A hotelek listájának betöltődése");
    await allure.feature("Hotel lista");
    await allure.severity("critical");
    await allure.tag("hotel-list");

    await allure.step("Hotel lista megnyitása", async () => {
      await page.locator("button.btn-outline-primary").click();
      await expect(page).toHaveURL(/\/hotel$/);
    });

    await allure.step("Egy oldalon 10 hotel jelenik meg", async () => {
      const hotelList = page.locator('h4[style="cursor: pointer"]');
      await expect(hotelList).toHaveCount(10);
    });
  });

  test("Szűrők törlése", async ({ page }) => {
    await allure.description(
      "A szoba szolgáltatás szűrők bejelölése, majd törlése",
    );
    await allure.feature("Hotel lista");
    await allure.severity("normal");
    await allure.tags("hotel-list", "filter");

    await page.locator("button.btn-outline-primary").click();
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes.first()).toBeVisible();

    await allure.step("Összes szűrő bejelölése", async () => {
      for (const checkbox of await checkboxes.all()) {
        await checkbox.check();
        await expect(checkbox).toBeChecked();
      }
    });

    await allure.step("Szűrések törlése", async () => {
      await page.locator("#redstar").click();
      for (const checkbox of await checkboxes.all()) {
        await expect(checkbox).not.toBeChecked();
      }
    });
  });
});
