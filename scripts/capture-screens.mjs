import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("1. Logging in as guest...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.click("button:has-text('Continue as Guest')");
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Capture /dashboard
  console.log("2. Capturing /dashboard...");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/dashboard-desktop.png" });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: "/tmp/dashboard-tablet.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/dashboard-mobile.png" });

  // Capture /dashboard/questions
  console.log("3. Capturing /dashboard/questions...");
  await page.goto("http://localhost:3000/dashboard/questions");
  await page.waitForTimeout(1000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/questions-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/questions-mobile.png" });

  // Capture /dashboard/interview/new
  console.log("4. Capturing /dashboard/interview/new...");
  await page.goto("http://localhost:3000/dashboard/interview/new");
  await page.waitForTimeout(1000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/interview-new-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/interview-new-mobile.png" });

  // Capture /dashboard/interview/session
  console.log("5. Capturing /dashboard/interview/session...");
  await page.evaluate(() => {
    const mockSession = {
      role: "Senior Software Engineer",
      experienceLevel: "Senior",
      focusArea: "System Architecture & High-Scale Systems",
      questionCount: 3,
      currentQuestionIndex: 0,
      questions: [
        {
          id: "q-1",
          question: "How do you design a distributed rate limiter capable of handling 500,000 requests per second across multiple data centers?",
          category: "System Design",
          difficulty: "Hard",
          rubric: {
            situation: "High-traffic multi-region API infrastructure",
            task: "Prevent cascading failures and enforce fair usage limits",
            action: "Token bucket or sliding window algorithm with Redis Cluster or Local Cache + Batching",
            result: "Sub-millisecond latency, minimal cross-datacenter sync overhead"
          }
        },
        {
          id: "q-2",
          question: "Tell me about a time you resolved a critical production incident under tight SLA deadlines.",
          category: "Behavioral",
          difficulty: "Medium"
        },
        {
          id: "q-3",
          question: "Explain how database sharding differs from partitioning and how you handle distributed transactions.",
          category: "Technical",
          difficulty: "Hard"
        }
      ]
    };
    sessionStorage.setItem("interviewSession", JSON.stringify(mockSession));
  });
  await page.goto("http://localhost:3000/dashboard/interview/session");
  await page.waitForTimeout(1500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/session-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/session-mobile.png" });

  // Open End Call Modal and capture
  console.log("6. Capturing End Call Modal...");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click("button:has-text('End Call')");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/end-call-modal.png" });

  console.log("All screenshots captured successfully!");
  await browser.close();
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
