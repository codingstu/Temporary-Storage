import { expect, test } from "@playwright/test";

test.describe("share flow", () => {
  test("renders editor", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("临时文本与图片分享中转站")).toBeVisible();
    await expect(page.getByRole("button", { name: "生成分享链接" })).toBeVisible();
    await expect(page.getByText("最新内容流")).toBeVisible();
  });

  test("creates share when kv is configured", async ({ page }) => {
    test.skip(!process.env.KV_REST_API_URL, "KV 未配置");
    await page.goto("/");
    await page.getByRole("textbox").first().fill("hello");
    await page.getByRole("button", { name: "生成分享链接" }).click();
    await expect(page.getByText("查看分享内容")).toBeVisible();
  });
});
