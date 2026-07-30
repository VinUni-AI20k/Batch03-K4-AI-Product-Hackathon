import { chromium } from "playwright-core";

const shotDir = "/private/tmp/claude-501/-Users-phamminh-Desktop-phamminh-AIThucChien-K3-hackathon-TeamB-E402/2c39c93c-63e9-4d85-986c-d2d40ffc13ae/scratchpad";

const browser = await chromium.launch({
  executablePath:
    "/Users/phamminh/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  args: ["--no-sandbox"],
});
const context = await browser.newContext();
const page = await context.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

await page.goto("http://127.0.0.1:5190", { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=Trợ lý của bạn", { timeout: 15000 });
await page.screenshot({ path: `${shotDir}/01-initial.png`, fullPage: true });

// Send a real chat message.
await page.fill("#chat-input", "Bây giờ là mấy giờ rồi?");
await page.click('button[aria-label="Gửi"]');
await page.waitForSelector("text=StudyPulse đang xử lý", { timeout: 5000 }).catch(() => {});
await page.screenshot({ path: `${shotDir}/02-sending.png`, fullPage: true });

await page.waitForFunction(
  () => !document.body.innerText.includes("StudyPulse đang xử lý"),
  { timeout: 20000 },
);
await page.screenshot({ path: `${shotDir}/03-chat-reply.png`, fullPage: true });

// Click a quick action to seed the dashboard with a real derived card.
await page.click('button:has-text("Deadline tuần")');
await page.waitForSelector("text=StudyPulse đang xử lý", { timeout: 5000 }).catch(() => {});
await page.waitForFunction(
  () => !document.body.innerText.includes("StudyPulse đang xử lý"),
  { timeout: 30000 },
);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${shotDir}/04-quickaction-timeline.png`, fullPage: true });

console.log("CONSOLE ERRORS:", JSON.stringify(consoleErrors, null, 2));

await browser.close();
