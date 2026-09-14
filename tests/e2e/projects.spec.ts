import { test, expect } from "@playwright/test";

const names = [
  "Portfolio",
  "Sarveshsivasankaran",
  "Visualec",
  "Students-Notes-Manager---Notezilla",
  "CollegeSapien",
  "240701479-CS23532-CN-G2",
  "Web-Crawler",
  "Beru-AI",
  "Telegram-Bot-Beru",
  "Seamless-Translate",
  "Matrix-Calculator-using-C",
  "Disaster-Management-System",
  "Smart_Buoy",
  "Food-Delivery-Management-System",
  "Water-Quality-monitoring-ML-model",
  "Baby_monitoring_system",
  "Home-automation",
  "Skillcraft_Intern",
  "Extra-build",
];
test("project universe is operable on desktop and mobile without overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/github", (route) =>
    route.fulfill({
      json: names.map((name, index) => ({
        id: index,
        name,
        description:
          "A project built to explore ideas and solve practical problems.",
        html_url: `https://github.com/Sarveshsivasankaran/${name}`,
        homepage:
          index === 0 ? "https://solo-p-leveller-portfolio.vercel.app" : null,
        language: index % 2 ? "Python" : "TypeScript",
        topics: [],
        stargazers_count: index,
        forks_count: 0,
        updated_at: `2026-09-${String(28 - index).padStart(2, "0")}T00:00:00Z`,
        pushed_at: "2026-09-01T00:00:00Z",
      })),
    }),
  );
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/tests/e2e/harness.html?view=projects");
  const panels = page.locator(".project-portal");
  await expect(panels).toHaveCount(18);
  await expect(page.locator(".project-character img")).toHaveJSProperty(
    "naturalWidth",
    1024,
  );
  await panels.nth(8).click();
  await expect(page.locator(".inspector-copy h3")).toHaveText(
    "Telegram Bot Beru",
  );
  await panels.nth(8).press("ArrowRight");
  await expect(panels.nth(9)).toBeFocused();
  await page.getByRole("button", { name: "Pause scene animation" }).click();
  await expect(page.locator("#projects")).toHaveAttribute(
    "data-moving",
    "false",
  );
  await page.screenshot({
    path: "test-results/project-universe-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Next project group" }).click();
  await expect(panels).toHaveCount(1);
  await page.getByRole("button", { name: "Previous project group" }).click();
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await panels.nth(17).click();
    await expect(page.locator(".inspector-copy h3")).toHaveText(
      "Skillcraft Intern",
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "test-results/project-universe-mobile.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#projects")).toHaveAttribute(
    "data-moving",
    "false",
  );
  await page.getByRole("button", { name: "Project list view" }).click();
  await expect(page.locator(".directory-project")).toHaveCount(19);
  expect(errors).toEqual([]);
});
