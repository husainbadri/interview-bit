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

  // 2. Capture /dashboard/questions
  console.log("2. Capturing /dashboard/questions...");
  await page.goto("http://localhost:3000/dashboard/questions", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/questions-desktop-v2.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/questions-mobile-v2.png" });

  // 3. Seed interviewSession and capture /dashboard/interview/session
  console.log("3. Seeding session and capturing /dashboard/interview/session...");
  await page.goto("http://localhost:3000/dashboard");
  await page.evaluate(() => {
    sessionStorage.setItem(
      "interviewSession",
      JSON.stringify({
        jobRole: "Software Engineer",
        experienceLevel: "Senior (5-8 years)",
        questions: [
          "Explain the difference between microservices and monolithic architecture. When would you choose one over the other?",
          "How would you design a distributed rate limiter that handles 100,000 requests per second across multiple regions?",
          "Describe a time when you had to resolve a severe production outage caused by a concurrency deadlock.",
        ],
      })
    );
  });
  await page.goto("http://localhost:3000/dashboard/interview/session", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/session-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/session-mobile.png" });

  // 4. Seed interviewResults and capture /dashboard/interview/results
  console.log("4. Seeding results and capturing /dashboard/interview/results...");
  await page.evaluate(() => {
    sessionStorage.setItem(
      "interviewResults",
      JSON.stringify([
        {
          question: "Explain the difference between microservices and monolithic architecture. When would you choose one over the other?",
          answer: "In a monolithic architecture, all functional modules reside within a unified codebase and deploy as a single service. This simplifies early development, transactions, and end-to-end testing. In microservices, business domains are decoupled into independently deployable services communicating via gRPC or message queues. I recommend monoliths for early-stage products and microservices when team boundaries and scale demand autonomous deployment cycles.",
          feedback: {
            rating: 9,
            feedback: "Exceptional articulation of trade-offs. You demonstrated strong practical judgment by emphasizing team topologies and transaction boundaries rather than purely theoretical scalability.",
            strengths: [
              "Clear distinction between development velocity and operational overhead",
              "Concrete communication protocols mentioned (gRPC, message queues)",
              "Pragmatic recommendation aligned with product lifecycle stages"
            ],
            improvements: [
              "Could briefly mention data consistency strategies like the Saga pattern",
              "Consider touching on distributed tracing (OpenTelemetry)"
            ]
          }
        },
        {
          question: "How would you design a distributed rate limiter that handles 100,000 requests per second across multiple regions?",
          answer: "I would use a token bucket algorithm implemented in Redis with Redis Cluster or ElastiCache, paired with local in-memory token buffers at the API gateway layer to prevent hot-key contention. For multi-region consistency, an asynchronous reconciliation model with eventual consistency prevents cross-region latency overhead.",
          feedback: {
            rating: 8,
            feedback: "Solid system design response. The two-tier caching strategy with local in-memory buffers demonstrates real-world production experience with high-throughput rate limiting.",
            strengths: [
              "Identified hot-key contention risk and solved it with local buffers",
              "Balanced latency with multi-region eventual consistency"
            ],
            improvements: [
              "Specify failure mode: fail-open vs fail-closed policy during Redis partition"
            ]
          }
        }
      ])
    );
  });
  await page.goto("http://localhost:3000/dashboard/interview/results", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "/tmp/results-desktop.png" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "/tmp/results-mobile.png" });

  console.log("All session & results screenshots captured successfully!");
  await browser.close();
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
