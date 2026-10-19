export interface LibraryQuestion {
  id: number;
  role: string;
  level: "Fresher" | "Junior" | "Mid-level" | "Senior" | "Lead";
  category: string;
  question: string;
  keyTopics: string[];
}

export const VAST_QUESTIONS: LibraryQuestion[] = [
  // --- Software Engineer ---
  {
    id: 1,
    role: "Software Engineer",
    level: "Senior",
    category: "System Design",
    question: "Explain the difference between microservices and monolithic architecture. Under what circumstances would you advocate decomposing a monolith, and when is a monolith superior?",
    keyTopics: ["Distributed Systems", "Domain-Driven Design", "Organizational Scaling"],
  },
  {
    id: 2,
    role: "Software Engineer",
    level: "Mid-level",
    category: "System Design",
    question: "How would you design a globally distributed URL shortening service like bit.ly? Walk through the database schema, unique hash generation, and caching tier.",
    keyTopics: ["Hashing / Base62", "Redis Caching", "Read-Heavy Architecture"],
  },
  {
    id: 3,
    role: "Software Engineer",
    level: "Junior",
    category: "Database Engineering",
    question: "Describe how database indexing works internally (B-Trees vs Hash indexes). How do composite indexes affect query performance and sort operations?",
    keyTopics: ["B-Tree Indexes", "Execution Plans", "Query Optimization"],
  },
  {
    id: 4,
    role: "Software Engineer",
    level: "Senior",
    category: "Concurrency & State",
    question: "How do you detect, reproduce, and eliminate race conditions and deadlocks in a high-throughput multithreaded or asynchronous distributed system?",
    keyTopics: ["Thread Synchronization", "Optimistic Locking", "Idempotency"],
  },
  {
    id: 5,
    role: "Software Engineer",
    level: "Lead",
    category: "API Architecture",
    question: "Walk me through how you design an idempotent payment processing API to strictly prevent double-charging during network timeouts and retries.",
    keyTopics: ["Idempotency Keys", "Two-Phase Commit", "Distributed Locking"],
  },
  {
    id: 6,
    role: "Software Engineer",
    level: "Senior",
    category: "Data Infrastructure",
    question: "What strategies and zero-downtime patterns do you use for running database schema migrations on tables containing hundreds of millions of records?",
    keyTopics: ["Expand and Contract", "Shadow Tables", "Ghost Online Schema Migration"],
  },
  {
    id: 7,
    role: "Software Engineer",
    level: "Mid-level",
    category: "Diagnostics & Reliability",
    question: "How do you determine whether a degrading service is bottlenecked by CPU contention, memory leaks, garbage collection pauses, or database I/O latency?",
    keyTopics: ["APM Profiling", "Flamegraphs", "Linux Metrics"],
  },

  // --- Frontend Developer ---
  {
    id: 8,
    role: "Frontend Developer",
    level: "Senior",
    category: "Framework Internals",
    question: "Explain how React's Fiber reconciler and concurrent rendering engine prioritize updates, schedule cooperative multitasking, and interrupt lower-priority work.",
    keyTopics: ["React Fiber", "Concurrent Mode", "Scheduler & Time Slicing"],
  },
  {
    id: 9,
    role: "Frontend Developer",
    level: "Mid-level",
    category: "Web Performance",
    question: "How would you diagnose and optimize a Web Vitals bottleneck where Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) fail production thresholds?",
    keyTopics: ["Core Web Vitals", "Resource Preloading", "Layout Stability"],
  },
  {
    id: 10,
    role: "Frontend Developer",
    level: "Senior",
    category: "Design Systems",
    question: "Describe how you architect an enterprise design system token pipeline that supports multiple themes, high-contrast modes, and fluid responsive typography.",
    keyTopics: ["Design Tokens", "CSS Variables", "Component Composability"],
  },
  {
    id: 11,
    role: "Frontend Developer",
    level: "Senior",
    category: "Architecture",
    question: "Explain the architectural trade-offs between SSR, SSG, ISR, and React Server Components (RSC). When is streaming SSR preferred over client-side hydration?",
    keyTopics: ["Server Components", "Streaming SSR", "Hydration Cost"],
  },
  {
    id: 12,
    role: "Frontend Developer",
    level: "Junior",
    category: "Accessibility & DOM",
    question: "What is your systematic approach to enforcing WCAG 2.1 AA accessibility standards for complex interactive widgets like modal dialogs, focus traps, and custom dropdowns?",
    keyTopics: ["ARIA Roles", "Keyboard Navigation", "Screen Reader Support"],
  },
  {
    id: 13,
    role: "Frontend Developer",
    level: "Mid-level",
    category: "State Management",
    question: "How do you structure client-side state between server cache (React Query/SWR), URL search params, and ephemeral local UI state to avoid cache synchronization bugs?",
    keyTopics: ["Server State vs Client State", "URL-Driven State", "Optimistic UI"],
  },
  {
    id: 14,
    role: "Frontend Developer",
    level: "Lead",
    category: "Architecture & Scale",
    question: "How do you architect micro-frontends or multi-team monorepos without causing bundle duplication, CSS collisions, or fragmented navigation experiences?",
    keyTopics: ["Module Federation", "Micro-frontends", "Monorepo Governance"],
  },

  // --- Backend Developer ---
  {
    id: 15,
    role: "Backend Developer",
    level: "Senior",
    category: "Distributed Systems",
    question: "How would you design a distributed rate limiter that enforces per-user and per-IP throttles at 150,000 requests per second across multiple regional edges?",
    keyTopics: ["Token Bucket / Leaky Bucket", "Redis Sliding Window", "Edge Compute"],
  },
  {
    id: 16,
    role: "Backend Developer",
    level: "Senior",
    category: "Distributed Systems",
    question: "Explain the CAP theorem and PACELC theorem. Can you describe a production architecture where you explicitly chose eventual consistency over strong consistency, and why?",
    keyTopics: ["PACELC Theorem", "Eventual Consistency", "CRDTs & Consensus"],
  },
  {
    id: 17,
    role: "Backend Developer",
    level: "Senior",
    category: "Database Engines",
    question: "Compare PostgreSQL MVCC with MySQL InnoDB row-level locking under heavy write concurrency. How do write amplification, vacuuming, and dead tuples impact storage?",
    keyTopics: ["MVCC Internals", "Vacuuming", "Write Amplification"],
  },
  {
    id: 18,
    role: "Backend Developer",
    level: "Lead",
    category: "Event Streaming",
    question: "How would you architect an event-driven transaction ledger using Apache Kafka or AWS Kinesis ensuring strict ordering and exactly-once processing semantics?",
    keyTopics: ["Kafka Partitions", "Consumer Groups", "Outbox Pattern"],
  },
  {
    id: 19,
    role: "Backend Developer",
    level: "Mid-level",
    category: "API Security",
    question: "How do you secure inter-service communication across a polyglot microservice network? Compare mutual TLS (mTLS), scoped JWTs, and OAuth2 token exchange.",
    keyTopics: ["mTLS", "JWT Security", "Service Mesh Identity"],
  },
  {
    id: 20,
    role: "Backend Developer",
    level: "Junior",
    category: "Reliability & Resilience",
    question: "Walk me through how you implement exponential backoff, jitter, and circuit breaker patterns when calling unpredictable third-party webhooks.",
    keyTopics: ["Circuit Breaker Pattern", "Exponential Backoff", "Jitter / Thundering Herd"],
  },
  {
    id: 21,
    role: "Backend Developer",
    level: "Mid-level",
    category: "In-Memory Systems",
    question: "Explain how Redis clustering, Sentinel failover, and memory eviction policies (such as volatile-lru vs allkeys-lfu) prevent cascade failures during cache stampedes.",
    keyTopics: ["Cache Stampede", "Redis Clustering", "Eviction Policies"],
  },

  // --- Full Stack Developer ---
  {
    id: 22,
    role: "Full Stack Developer",
    level: "Mid-level",
    category: "Full Stack Delivery",
    question: "Walk me through an end-to-end feature delivery: from database schema design and ORM migrations to GraphQL/REST endpoint design, client data fetching, and optimistic UI.",
    keyTopics: ["Schema Migrations", "API Contracts", "Optimistic Mutations"],
  },
  {
    id: 23,
    role: "Full Stack Developer",
    level: "Senior",
    category: "Real-time Protocols",
    question: "Explain how WebSockets, Server-Sent Events (SSE), and HTTP/2 long-polling compare for live collaborative apps. Which protocol would you choose for a multi-user cursor sync?",
    keyTopics: ["WebSockets", "SSE", "Binary Framing & Overhead"],
  },
  {
    id: 24,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Web Security",
    question: "How do you systematically protect a full-stack Next.js web application against XSS, CSRF, SSRF, SQL Injection, and timing attacks?",
    keyTopics: ["Content Security Policy", "SameSite Cookies", "Parameterized Queries"],
  },
  {
    id: 25,
    role: "Full Stack Developer",
    level: "Senior",
    category: "Auth & Identity",
    question: "Describe how you design a session management architecture supporting multi-factor authentication, refresh token rotation, and instant revoking of active devices.",
    keyTopics: ["Refresh Token Rotation", "Stateless vs Stateful Sessions", "Revocation Lists"],
  },
  {
    id: 26,
    role: "Full Stack Developer",
    level: "Mid-level",
    category: "Developer Experience",
    question: "How do you structure end-to-end type safety across client and server boundaries using tools like TypeScript, Zod, and RPC / OpenAPI generators?",
    keyTopics: ["End-to-End Type Safety", "Zod Validation", "Schema Generation"],
  },

  // --- Product Manager ---
  {
    id: 27,
    role: "Product Manager",
    level: "Senior",
    category: "Product Strategy",
    question: "How do you prioritize features and roadmap trade-offs when you have limited engineering bandwidth and conflicting demands from Enterprise Sales, Support, and Founders?",
    keyTopics: ["RICE Framework", "Opportunity Cost", "Strategic Alignment"],
  },
  {
    id: 28,
    role: "Product Manager",
    level: "Mid-level",
    category: "Success Metrics",
    question: "What leading and lagging metrics would you define to measure the true success and adoption of a revamped user onboarding experience after 30, 60, and 90 days?",
    keyTopics: ["Activation Rate", "Retention Cohorts", "North Star Metric"],
  },
  {
    id: 29,
    role: "Product Manager",
    level: "Senior",
    category: "Root Cause Analysis",
    question: "Imagine weekly active users (WAU) on our core product dropped by 14% week-over-week. Walk me through your step-by-step diagnostic and root-cause discovery plan.",
    keyTopics: ["Funnel Breakdown", "Cohort Segmentation", "Telemetry Audit"],
  },
  {
    id: 30,
    role: "Product Manager",
    level: "Mid-level",
    category: "Product Discovery",
    question: "Tell me about a product or major feature you championed that underperformed. What core hypothesis turned out to be false, and how did you pivot?",
    keyTopics: ["Hypothesis Validation", "Continuous Discovery", "Failing Fast"],
  },
  {
    id: 31,
    role: "Product Manager",
    level: "Junior",
    category: "Execution & PRDs",
    question: "How do you write a Product Requirement Document (PRD) that provides absolute clarity on user problems and edge cases without prescribing technical architecture to engineers?",
    keyTopics: ["PRD Structure", "User Stories & Criteria", "Cross-Functional Clarity"],
  },
  {
    id: 32,
    role: "Product Manager",
    level: "Senior",
    category: "Unit Economics",
    question: "How do you analyze Customer Acquisition Cost (CAC), Lifetime Value (LTV), and churn rates to justify building a freemium self-serve motion vs an enterprise sales-assist funnel?",
    keyTopics: ["LTV/CAC Ratio", "Payback Period", "Product-Led Growth"],
  },
  {
    id: 33,
    role: "Product Manager",
    level: "Lead",
    category: "Experimentation",
    question: "Walk me through how you construct an A/B experimentation program for a high-stakes checkout funnel. How do you handle sample ratio mismatch and statistical power?",
    keyTopics: ["Statistical Significance", "Sample Ratio Mismatch", "Minimum Detectable Effect"],
  },

  // --- Data Scientist & ML Engineer ---
  {
    id: 34,
    role: "Data Scientist",
    level: "Junior",
    category: "Machine Learning Fundamentals",
    question: "Explain the bias-variance tradeoff. How do you diagnose high variance versus high bias from training and validation loss curves, and what are the respective remedies?",
    keyTopics: ["Overfitting vs Underfitting", "Regularization", "Learning Curves"],
  },
  {
    id: 35,
    role: "Data Scientist",
    level: "Senior",
    category: "Recommender Systems",
    question: "How would you design a real-time recommendation system for an e-commerce platform with sparse cold-start user telemetry and high item catalog turnover?",
    keyTopics: ["Two-Tower Embeddings", "Approximate Nearest Neighbor", "Cold-Start Strategies"],
  },
  {
    id: 36,
    role: "Data Scientist",
    level: "Mid-level",
    category: "Model Architecture",
    question: "Explain the differences between bagging and boosting. When would you choose XGBoost or LightGBM over Random Forest or Deep Neural Networks for tabular data?",
    keyTopics: ["Gradient Boosting", "Ensemble Methods", "Tabular Learning"],
  },
  {
    id: 37,
    role: "Data Scientist",
    level: "Senior",
    category: "MLOps & Monitoring",
    question: "How do you detect data drift and concept drift in production ML pipelines? What automated retraining gates and shadow deployments do you put in place?",
    keyTopics: ["Covariate Shift", "Population Stability Index", "Shadow Model Testing"],
  },
  {
    id: 38,
    role: "Data Scientist",
    level: "Senior",
    category: "Generative AI & LLMs",
    question: "Walk me through how you build and evaluate an enterprise Retrieval-Augmented Generation (RAG) system with hybrid vector search, chunking, and semantic reranking.",
    keyTopics: ["RAG Architecture", "Vector Embeddings", "RAG Triad Evaluation"],
  },
  {
    id: 39,
    role: "Data Scientist",
    level: "Junior",
    category: "Evaluation Metrics",
    question: "Explain Precision, Recall, F1-score, and ROC-AUC. Which metric would you prioritize for a credit card fraud detection system with 99.9% negative class skew?",
    keyTopics: ["Class Imbalance", "Precision-Recall Tradeoff", "Confusion Matrix"],
  },
  {
    id: 40,
    role: "Data Scientist",
    level: "Mid-level",
    category: "Feature Engineering",
    question: "How do you manage real-time feature stores (e.g. Feast) and prevent data leakage or lookahead bias when preprocessing temporal time-series datasets?",
    keyTopics: ["Data Leakage Prevention", "Point-in-Time Joins", "Feature Stores"],
  },

  // --- DevOps & Cloud Engineer ---
  {
    id: 41,
    role: "DevOps & Cloud Engineer",
    level: "Senior",
    category: "Kubernetes & Orchestration",
    question: "How do you implement blue-green deployments versus canary releases in Kubernetes? How do you automate instant rollback based on Prometheus error rates?",
    keyTopics: ["Canary Deployments", "Argo Rollouts", "Prometheus Automated Rollback"],
  },
  {
    id: 42,
    role: "DevOps & Cloud Engineer",
    level: "Mid-level",
    category: "Infrastructure as Code",
    question: "Explain Infrastructure as Code (IaC) drift detection and remediation using Terraform. How do you structure remote state locking, modules, and secrets securely?",
    keyTopics: ["Terraform State", "Drift Detection", "Secrets Injection"],
  },
  {
    id: 43,
    role: "DevOps & Cloud Engineer",
    level: "Senior",
    category: "Incident Management",
    question: "Describe an incident where a critical production service went down under unexpected traffic. Walk me through your real-time incident triage, communication, and blameless post-mortem.",
    keyTopics: ["Blameless Post-Mortem", "Incident Commander Role", "SLA / SLO Tracking"],
  },
  {
    id: 44,
    role: "DevOps & Cloud Engineer",
    level: "Lead",
    category: "High Availability & DR",
    question: "How do you architect a multi-region cloud disaster recovery strategy with a Recovery Point Objective (RPO) under 5 minutes and Recovery Time Objective (RTO) under 15 minutes?",
    keyTopics: ["Multi-Region Replication", "RPO vs RTO", "Global DNS Failover"],
  },
  {
    id: 45,
    role: "DevOps & Cloud Engineer",
    level: "Junior",
    category: "Containers & CI/CD",
    question: "Explain Docker multi-stage builds and layer caching optimization. How do you minimize production container image size and eliminate security vulnerabilities?",
    keyTopics: ["Multi-Stage Builds", "Layer Caching", "Distroless Images"],
  },
  {
    id: 46,
    role: "DevOps & Cloud Engineer",
    level: "Senior",
    category: "Observability",
    question: "How do you implement the three pillars of observability (logs, metrics, and distributed tracing via OpenTelemetry) across a microservices cluster without ballooning ingest costs?",
    keyTopics: ["OpenTelemetry", "Distributed Tracing", "Trace Sampling & Cost"],
  },

  // --- UX/UI Designer ---
  {
    id: 47,
    role: "UX/UI Designer",
    level: "Senior",
    category: "Product Design Ethics",
    question: "How do you balance user advocacy and cognitive ease when executive stakeholders push for aggressive, high-conversion dark patterns in a pricing and checkout flow?",
    keyTopics: ["Ethical UX", "Cognitive Load", "Stakeholder Negotiation"],
  },
  {
    id: 48,
    role: "UX/UI Designer",
    level: "Mid-level",
    category: "Design Process",
    question: "Walk me through your end-to-end design process: from qualitative discovery research and journey mapping to interactive Figma prototypes and developer handoff specs.",
    keyTopics: ["Double Diamond", "User Journey Mapping", "Design Handoff"],
  },
  {
    id: 49,
    role: "UX/UI Designer",
    level: "Senior",
    category: "Design Systems",
    question: "How do you establish typographic hierarchy, spatial grid systems (e.g. 4pt/8pt grids), and semantic color tokens that bridge the gap between design and front-end code?",
    keyTopics: ["Grid Systems", "Semantic Color Tokens", "Design System Governance"],
  },
  {
    id: 50,
    role: "UX/UI Designer",
    level: "Junior",
    category: "User Research",
    question: "Describe how you plan and execute an unmoderated usability study. How do you synthesize qualitative video clips into actionable, prioritized design backlog tickets?",
    keyTopics: ["Usability Testing", "Affinity Diagramming", "Actionable Synthesis"],
  },
  {
    id: 51,
    role: "UX/UI Designer",
    level: "Senior",
    category: "Information Architecture",
    question: "How do you structure data-dense interfaces or financial dashboards for power users without overwhelming novices or triggering cognitive fatigue?",
    keyTopics: ["Progressive Disclosure", "Data Density", "Visual Hierarchy"],
  },

  // --- Behavioral & Leadership ---
  {
    id: 52,
    role: "Behavioral & Leadership",
    level: "Senior",
    category: "Conflict & Alignment",
    question: "Tell me about a time you strongly disagreed with a major architectural or product decision made by a tech lead or VP. How did you advocate your perspective, and what was the outcome?",
    keyTopics: ["Constructive Dissent", "Data-Driven Persuasion", "Disagree and Commit"],
  },
  {
    id: 53,
    role: "Behavioral & Leadership",
    level: "Lead",
    category: "Ownership & Crisis",
    question: "Describe a situation where a multi-month project was dangerously falling behind schedule with an unmovable release deadline. How did you triage scope and rally your team?",
    keyTopics: ["Scope Triaging", "Stakeholder Communication", "Team Morale"],
  },
  {
    id: 54,
    role: "Behavioral & Leadership",
    level: "Senior",
    category: "Mentorship",
    question: "Tell me about a time you mentored an engineer or teammate who was struggling with delivery or technical confidence. How did you diagnose their blockers and foster sustained growth?",
    keyTopics: ["Active Listening", "Growth Mindset", "Actionable Feedback"],
  },
  {
    id: 55,
    role: "Behavioral & Leadership",
    level: "Mid-level",
    category: "Accountability",
    question: "Describe a time you shipped a bug or broke production that impacted active customers. How did you handle immediate notification, incident containment, and long-term prevention?",
    keyTopics: ["Extreme Ownership", "Incident Transparency", "Root-Cause Fixes"],
  },
  {
    id: 56,
    role: "Behavioral & Leadership",
    level: "Senior",
    category: "Technical Pragmatism",
    question: "Give an example of a technical project where you intentionally took on technical debt to meet a market window. How did you document the debt and ensure it was repaid later?",
    keyTopics: ["Pragmatic Engineering", "Technical Debt Balance", "Business Value"],
  },
  {
    id: 57,
    role: "Behavioral & Leadership",
    level: "Senior",
    category: "Dealing with Ambiguity",
    question: "Tell me about a time you were tasked with leading a mission-critical initiative with extremely vague requirements and little guidance. How did you create momentum?",
    keyTopics: ["Navigating Ambiguity", "Rapid Prototyping", "Stakeholder Buy-In"],
  },
  {
    id: 58,
    role: "Behavioral & Leadership",
    level: "Fresher",
    category: "Adaptability & Learning",
    question: "Describe a time you had to learn an unfamiliar programming language, framework, or domain in a matter of days to complete a deadline. What was your learning strategy?",
    keyTopics: ["Learning Velocity", "Resourcefulness", "Applied Delivery"],
  },

  // =========================================================================
  // --- FRONTEND DEVELOPER: FRESHER (0 Years / Campus Grads) ---
  // =========================================================================
  {
    id: 59,
    role: "Frontend Developer",
    level: "Fresher",
    category: "JavaScript Basics",
    question: "What is the difference between let, const, and var in JavaScript? Explain how scope (block vs function) and variable hoisting work with simple examples.",
    keyTopics: ["Variables", "Block Scope", "Hoisting"],
  },
  {
    id: 60,
    role: "Frontend Developer",
    level: "Fresher",
    category: "CSS & Styling",
    question: "Can you explain the CSS Box Model (content, padding, border, margin)? What is the practical difference between box-sizing: content-box and border-box?",
    keyTopics: ["CSS Box Model", "box-sizing", "Layout Fundamentals"],
  },
  {
    id: 61,
    role: "Frontend Developer",
    level: "Fresher",
    category: "JavaScript Fundamentals",
    question: "What is the difference between == (loose equality) and === (strict equality) in JavaScript? Can you give an example of automatic type coercion?",
    keyTopics: ["Type Coercion", "Strict Equality", "Data Types"],
  },
  {
    id: 62,
    role: "Frontend Developer",
    level: "Fresher",
    category: "DOM & Browser Events",
    question: "What is an event listener in JavaScript? Can you explain what event bubbling and event capturing mean, and how event.stopPropagation() works?",
    keyTopics: ["Event Listeners", "Event Bubbling", "DOM Manipulation"],
  },
  {
    id: 63,
    role: "Frontend Developer",
    level: "Fresher",
    category: "HTML & Accessibility",
    question: "What are semantic HTML5 tags (such as <header>, <nav>, <main>, <article>, and <footer>), and why should we use them instead of generic <div> tags?",
    keyTopics: ["Semantic HTML", "Accessibility (a11y)", "SEO Basics"],
  },
  {
    id: 64,
    role: "Frontend Developer",
    level: "Fresher",
    category: "React Fundamentals",
    question: "In React, what is the fundamental difference between state and props? How do components pass data down and trigger re-renders?",
    keyTopics: ["React State", "Props", "Component Re-renders"],
  },
  {
    id: 65,
    role: "Frontend Developer",
    level: "Fresher",
    category: "React Hooks",
    question: "What does the useState hook do in React? How do you initialize state, update it based on user actions, and avoid direct state mutations?",
    keyTopics: ["useState", "State Immutability", "Event Handlers"],
  },
  {
    id: 66,
    role: "Frontend Developer",
    level: "Fresher",
    category: "React Lists & Keys",
    question: "Why do we need a unique 'key' prop when rendering a dynamic list of items using .map() in React? What happens if you omit keys or use array index?",
    keyTopics: ["React Keys", "Virtual DOM Diffing", "List Rendering"],
  },

  // =========================================================================
  // --- FRONTEND DEVELOPER: JUNIOR (1-2 Years Experience) ---
  // =========================================================================
  {
    id: 67,
    role: "Frontend Developer",
    level: "Junior",
    category: "Async JavaScript",
    question: "Explain the difference between Synchronous and Asynchronous JavaScript. How do Promises and async/await help prevent callback hell?",
    keyTopics: ["Event Loop", "Promises", "async/await"],
  },
  {
    id: 68,
    role: "Frontend Developer",
    level: "Junior",
    category: "React Lifecycle & Effects",
    question: "What is the useEffect hook used for in React? What is the practical difference between passing an empty dependency array [], a populated array [data], and omitting the array?",
    keyTopics: ["useEffect", "Dependency Array", "Cleanup Functions"],
  },
  {
    id: 69,
    role: "Frontend Developer",
    level: "Junior",
    category: "CSS Layouts",
    question: "What is the difference between CSS Flexbox (display: flex) and CSS Grid (display: grid)? In what real UI scenarios would you choose one over the other?",
    keyTopics: ["Flexbox vs Grid", "One-Dimensional vs Two-Dimensional", "Responsive Design"],
  },
  {
    id: 70,
    role: "Frontend Developer",
    level: "Junior",
    category: "JavaScript Deep Dive",
    question: "What is a closure in JavaScript? Can you give a simple real-world example of where you used or encountered a closure (such as data privacy or function factory)?",
    keyTopics: ["Lexical Scope", "Closures", "Data Encapsulation"],
  },
  {
    id: 71,
    role: "Frontend Developer",
    level: "Junior",
    category: "API Integration",
    question: "How do you fetch data from a REST API inside a React component, and how do you cleanly handle loading, error, and empty response states for the user?",
    keyTopics: ["fetch / axios", "Loading States", "Error Boundaries / Handling"],
  },
  {
    id: 72,
    role: "Frontend Developer",
    level: "Junior",
    category: "Web Storage",
    question: "What is the difference between localStorage, sessionStorage, and Cookies? Where would you store dark mode preferences versus an authentication token?",
    keyTopics: ["localStorage", "sessionStorage", "Cookies & Storage Limits"],
  },
  {
    id: 73,
    role: "Frontend Developer",
    level: "Junior",
    category: "Array Methods",
    question: "How do modern array methods like .map(), .filter(), and .reduce() differ from each other? Can you explain when to use each with a quick scenario?",
    keyTopics: ["Functional Programming", "Array Transformations", "Immutability"],
  },
  {
    id: 74,
    role: "Frontend Developer",
    level: "Junior",
    category: "Form Handling",
    question: "What is the difference between a controlled input component and an uncontrolled component using useRef in React forms? Why are controlled inputs standard?",
    keyTopics: ["Controlled Components", "useRef", "Form Validation"],
  },

  // =========================================================================
  // --- FULL STACK DEVELOPER: FRESHER (0 Years / Campus Grads) ---
  // =========================================================================
  {
    id: 75,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "Architecture Basics",
    question: "What is the fundamental difference between the frontend (client-side) and backend (server-side) of a web application? How do they communicate with each other?",
    keyTopics: ["Client vs Server", "HTTP Requests", "Web Architecture"],
  },
  {
    id: 76,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "APIs & HTTP",
    question: "What is an API, and what is the difference between HTTP GET and POST requests? When should you use GET versus POST when designing endpoints?",
    keyTopics: ["REST APIs", "HTTP GET vs POST", "Idempotency Basics"],
  },
  {
    id: 77,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "Databases",
    question: "What is the difference between a relational database (like PostgreSQL or MySQL) and a NoSQL database (like MongoDB)? When might you consider each?",
    keyTopics: ["SQL vs NoSQL", "Tables vs Documents", "Schema Design"],
  },
  {
    id: 78,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "Database Relations",
    question: "What is a Primary Key and a Foreign Key in a database table? How do they help establish relationships between tables like Users and Orders?",
    keyTopics: ["Primary Key", "Foreign Key", "One-to-Many Relationships"],
  },
  {
    id: 79,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "HTTP Status Codes",
    question: "What are common HTTP status codes? Explain what 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, and 500 Internal Server Error indicate.",
    keyTopics: ["HTTP Status Codes", "2xx / 4xx / 5xx Classes", "API Error Handling"],
  },
  {
    id: 80,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "REST & CRUD",
    question: "What does CRUD stand for (Create, Read, Update, Delete), and how do standard REST API HTTP methods (POST, GET, PUT/PATCH, DELETE) map to CRUD operations?",
    keyTopics: ["CRUD Operations", "RESTful Standards", "HTTP Verbs"],
  },
  {
    id: 81,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "Data Interchange",
    question: "What is JSON, and how do you convert a JavaScript object into a JSON string and parse it back using JSON.stringify() and JSON.parse()?",
    keyTopics: ["JSON Formatting", "Serialization", "Data Serialization"],
  },
  {
    id: 82,
    role: "Full Stack Developer",
    level: "Fresher",
    category: "Version Control",
    question: "What is Git, and what is the difference between 'git fetch', 'git pull', and 'git push'? How do branches help team collaboration?",
    keyTopics: ["Git Workflow", "Commit & Push", "Branching Basics"],
  },

  // =========================================================================
  // --- FULL STACK DEVELOPER: JUNIOR (1-2 Years Experience) ---
  // =========================================================================
  {
    id: 83,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Node.js Runtime",
    question: "What is Node.js, and how does its single-threaded event loop handle thousands of concurrent requests without blocking execution?",
    keyTopics: ["Node.js Event Loop", "Non-blocking I/O", "Concurrency Basics"],
  },
  {
    id: 84,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Browser Security & CORS",
    question: "What is CORS (Cross-Origin Resource Sharing), why do browsers block requests from different origins, and how do you configure CORS headers on a backend server?",
    keyTopics: ["CORS Policy", "Same-Origin Policy", "Access-Control-Allow-Origin"],
  },
  {
    id: 85,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Backend Middleware",
    question: "What is middleware in Express or backend web frameworks? Give a practical example of how you would use middleware for request logging or authentication.",
    keyTopics: ["Express Middleware", "Request Pipeline", "req, res, next()"],
  },
  {
    id: 86,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Authentication vs Authorization",
    question: "What is the difference between Authentication (who you are) and Authorization (what you can do)? How does a JSON Web Token (JWT) work during user login?",
    keyTopics: ["AuthN vs AuthZ", "JWT Payload & Signature", "Bearer Tokens"],
  },
  {
    id: 87,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Configuration & Secrets",
    question: "What are environment variables (.env files), and why is it critical that database credentials, JWT secrets, and API keys are never committed to version control?",
    keyTopics: [".env Files", "Secret Management", "Configuration Hygiene"],
  },
  {
    id: 88,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Error Handling & UX",
    question: "How would you handle a scenario where a user submits a form on the frontend, but the backend database is temporarily down or returns a 500 error? What should the user see?",
    keyTopics: ["Graceful Degradation", "User Feedback / Toast", "Retry Logic"],
  },
  {
    id: 89,
    role: "Full Stack Developer",
    level: "Junior",
    category: "SQL Joins",
    question: "Explain the difference between SQL JOIN types: specifically, what is the difference between an INNER JOIN and a LEFT JOIN? When would you use each?",
    keyTopics: ["SQL INNER JOIN", "SQL LEFT JOIN", "Relational Queries"],
  },
  {
    id: 90,
    role: "Full Stack Developer",
    level: "Junior",
    category: "Database Efficiency",
    question: "What is a database connection pool, and why is reusing pooled connections significantly better than opening and closing a new connection on every HTTP request?",
    keyTopics: ["Connection Pooling", "Database Latency", "Resource Management"],
  },

  // =========================================================================
  // --- SOFTWARE ENGINEER: FRESHER (0 Years / Campus Grads) ---
  // =========================================================================
  {
    id: 91,
    role: "Software Engineer",
    level: "Fresher",
    category: "Data Structures",
    question: "What is the difference between an Array and a Linked List? What are the trade-offs when inserting, deleting, or searching for an element?",
    keyTopics: ["Array vs Linked List", "Memory Layout", "O(1) vs O(n) Access"],
  },
  {
    id: 92,
    role: "Software Engineer",
    level: "Fresher",
    category: "Algorithms & Complexity",
    question: "What is Big-O notation, and what is the difference in time complexity between a linear search O(n) and binary search O(log n)?",
    keyTopics: ["Big-O Notation", "Linear Search", "Binary Search"],
  },
  {
    id: 93,
    role: "Software Engineer",
    level: "Fresher",
    category: "Data Structures",
    question: "Explain Stack (LIFO) and Queue (FIFO) data structures. Can you give one practical real-world software example where each structure is used?",
    keyTopics: ["Stack vs Queue", "LIFO vs FIFO", "Undo Stack / Task Queue"],
  },
  {
    id: 94,
    role: "Software Engineer",
    level: "Fresher",
    category: "Object-Oriented Programming",
    question: "What are the four pillars of Object-Oriented Programming (Encapsulation, Abstraction, Inheritance, and Polymorphism)? Explain one pillar with a real-life analogy.",
    keyTopics: ["OOP Principles", "Encapsulation", "Polymorphism"],
  },

  // =========================================================================
  // --- SOFTWARE ENGINEER: JUNIOR (1-2 Years Experience) ---
  // =========================================================================
  {
    id: 95,
    role: "Software Engineer",
    level: "Junior",
    category: "Operating Systems",
    question: "What is the difference between a process and a thread in an operating system? How do memory sharing and context switching differ between them?",
    keyTopics: ["Process vs Thread", "Shared Memory", "Concurrency"],
  },
  {
    id: 96,
    role: "Software Engineer",
    level: "Junior",
    category: "Data Structures",
    question: "How does a Hash Table (or Dictionary/HashMap) work internally, and what is a hash collision? How can collisions be resolved using chaining or open addressing?",
    keyTopics: ["Hash Tables", "Hash Functions", "Collision Resolution"],
  },
  {
    id: 97,
    role: "Software Engineer",
    level: "Junior",
    category: "Software Quality",
    question: "What is unit testing, and why is writing automated tests important when building software features? What makes a good unit test?",
    keyTopics: ["Unit Testing", "Test Assertions", "Regression Prevention"],
  },
  {
    id: 98,
    role: "Software Engineer",
    level: "Junior",
    category: "Debugging & Problem Solving",
    question: "When an unexpected bug or crash occurs in code you didn't write, what is your step-by-step approach to diagnosing and fixing the issue?",
    keyTopics: ["Root Cause Analysis", "Stack Traces", "Systematic Debugging"],
  },
];

/**
 * Rapidly retrieves calibrated questions matching the role and level from the curated repository.
 */
export function getCuratedQuestionsForRole(
  jobRole: string,
  experienceLevel: string,
  count: number = 5
): string[] {
  const roleLower = (jobRole || "").toLowerCase().trim();
  const levelLower = (experienceLevel || "").toLowerCase().trim();

  // Score questions based on role match and level match
  const scored = VAST_QUESTIONS.map((q) => {
    let score = 0;
    const qRole = q.role.toLowerCase();
    const qLevel = q.level.toLowerCase();

    if (qRole === roleLower) score += 10;
    else if (qRole.includes(roleLower) || roleLower.includes(qRole)) score += 5;
    else if (roleLower.includes("engineer") && qRole.includes("engineer")) score += 3;
    else if (roleLower.includes("developer") && (qRole.includes("developer") || qRole.includes("engineer"))) score += 3;

    // Exact level match
    if (qLevel === levelLower) {
      score += 10;
    } else if (
      (levelLower.includes("fresher") || levelLower.includes("junior")) &&
      (qLevel === "fresher" || qLevel === "junior")
    ) {
      score += 6;
    } else if (
      (levelLower.includes("senior") || levelLower.includes("lead")) &&
      (qLevel === "senior" || qLevel === "lead")
    ) {
      score += 5;
    } else if (
      (levelLower.includes("fresher") || levelLower.includes("junior")) &&
      (qLevel === "senior" || qLevel === "lead")
    ) {
      score -= 15; // Strongly penalize complex senior/lead questions for freshers/juniors!
    }

    // Add slight random jitter (0 to 1) so different drills get variety
    score += Math.random() * 0.9;

    return { question: q.question, score };
  });

  // Sort by relevance score descending
  scored.sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 2).map((s) => s.question);

  if (matched.length >= count) {
    return matched.slice(0, count);
  }

  // If not enough direct matches, append general questions
  const allQuestions = VAST_QUESTIONS.map((q) => q.question);
  for (const q of allQuestions) {
    if (!matched.includes(q)) {
      matched.push(q);
      if (matched.length >= count) break;
    }
  }

  return matched.slice(0, count);
}
