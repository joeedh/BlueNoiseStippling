import { defineConfig, devices } from "@playwright/test";

const PORT = 5733;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          // Software-render canvas/WebGL so it works headless / in CI.
          args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
        },
      },
    },
  ],
  webServer: {
    command: `node dev.mjs`,
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/index.html`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
