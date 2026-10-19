import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Capturing /agentic desktop...");
  await page.goto("http://localhost:3000/agentic", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/agentic-desktop.png" });

  console.log("Capturing /agentic full-page desktop...");
  await page.screenshot({ path: "/tmp/agentic-desktop-full.png", fullPage: true });

  console.log("Capturing /agentic mobile...");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/agentic-mobile.png" });

  console.log("Done!");
  await browser.close();
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
