import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.pw.mjs",
  projects: [
    { name: "catalog", testIgnore: "**/messenger.pw.mjs" },
    ...["chromium", "firefox", "webkit"].map(browserName => ({
      name: browserName + "-messenger", testMatch: "**/messenger.pw.mjs", use: { browserName },
    })),
  ],
  snapshotPathTemplate: "{testDir}/snapshots/{testFileName}/{arg}{ext}",
  workers: 1,
  retries: 0,
  reporter: "list",
  use: { trace: "retain-on-failure" },
  webServer: {
    command: "bun run start --hostname 127.0.0.1 --port 0",
    wait: { stdout: /Local:\s*(?<takt_test_origin>http:\/\/127\.0\.0\.1:\d+)/ },
    stdout: "pipe",
  },
});
