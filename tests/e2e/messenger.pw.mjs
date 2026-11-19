import { test } from "playwright/test";
import { reviewMessenger } from "../../scripts/review-messenger.mjs";

test("channel and thread drafts survive navigation at desktop and mobile sizes", async ({ browser }) => {
  await reviewMessenger(browser, process.env.TAKT_TEST_ORIGIN);
});
