import { test, expect } from "@playwright/test";

// Content-based baseline oracle. The stippling output is stochastic, so we
// assert structural facts (GUI mounted, no console errors, the render pipeline
// drew non-blank content) rather than comparing pixels exactly.
//
// A fresh load shows a blank canvas (the app waits for an image; its built-in
// flower default is loaded via a broken code path), so we drive a deterministic
// image through the app's real image pipeline to exercise sampling + stippling.
test("app boots, mounts GUI, stipples a driven image", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/index.html");

  await expect(page.locator("#canvas")).toBeVisible();
  // dat.gui control panels mounted (the .dg.main roots; the bare .dg.ac
  // auto-place wrapper is intentionally hidden).
  await expect(page.locator(".dg.main").first()).toBeVisible();

  // Feed a deterministic gradient image through the real pipeline.
  await page.evaluate(async () => {
    const tmp = document.createElement("canvas");
    tmp.width = tmp.height = 64;
    const tg = tmp.getContext("2d")!;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const v = (x * 4) & 255;
        tg.fillStyle = `rgb(${v}, ${(y * 4) & 255}, ${(x ^ y) & 255})`;
        tg.fillRect(x, y, 1, 1);
      }
    }
    const url = tmp.toDataURL("image/png");
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("img load failed"));
      img.src = url;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const app = win._appstate;
    app.on_image_read(img, () => {
      app.source_image_read(img);
      // "Run" button == one stipple step + redraw.
      app.bluenoise.step();
      win.redraw_all();
    });
  });

  // Poll until the progressive render loop has drawn stipple points (avoids
  // racing requestAnimationFrame with a fixed sleep).
  await page
    .waitForFunction(
      () => {
        const c = document.getElementById("canvas") as HTMLCanvasElement | null;
        if (!c || !c.width || !c.height) return false;
        const ctx = c.getContext("2d");
        if (!ctx) return false;
        const { data } = ctx.getImageData(0, 0, c.width, c.height);
        let first = -1;
        for (let i = 0; i < data.length; i += 4) {
          const px = data[i] + data[i + 1] + data[i + 2];
          if (first === -1) first = px;
          else if (px !== first) return true; // some variation -> drew content
        }
        return false;
      },
      undefined,
      { timeout: 10000, polling: 250 },
    )
    .catch(() => {
      throw new Error("canvas should have rendered non-blank content");
    });

  expect(errors, `console/page errors:\n${errors.join("\n")}`).toEqual([]);
});
