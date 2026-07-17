import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import prisma from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════
// Agent Definitions
// ═══════════════════════════════════════════════════════════

export const AGENT_DEFINITIONS = [
  {
    key: "planner",
    displayName: "Planner Agent",
    roleTitle: "Business Strategist",
    description: "Turns your idea into a complete business plan: concept, brand, market and roadmap.",
    deliverableType: "Business Plan",
    iconName: "BrainCircuit",
  },
  {
    key: "marketing",
    displayName: "Marketing Agent",
    roleTitle: "Growth Marketer",
    description: "Creates ready-to-publish social content with captions, hashtags and a posting schedule.",
    deliverableType: "Social Campaign",
    iconName: "Users",
  },
  {
    key: "finance",
    displayName: "Finance Agent",
    roleTitle: "Financial Analyst",
    description: "Builds startup cost analysis, break-even point and 12-month projections with charts.",
    deliverableType: "Cost Analysis",
    iconName: "LineChart",
  },
  {
    key: "operations",
    displayName: "Operations Agent",
    roleTitle: "Operations Manager",
    description: "Produces weekly schedules, supplier checklists and standard operating procedures.",
    deliverableType: "Operations Manual",
    iconName: "CheckCircle2",
  },
  {
    key: "website",
    displayName: "Website Agent",
    roleTitle: "Web Developer",
    description: "Generates a live landing page for your business using the brand identity.",
    deliverableType: "Landing Page",
    iconName: "Globe",
  },
];

// ═══════════════════════════════════════════════════════════
// System Prompts (one per agent role)
// ═══════════════════════════════════════════════════════════

function getPlannerPrompt(businessIdea: string) {
  return {
    system: `You are an expert business strategist. Given a business idea, produce a comprehensive, structured business plan. Respond ONLY with valid JSON (no markdown, no code fences).

Output format (JSON):
{
  "businessConcept": "2-3 sentence summary",
  "brandIdentity": {
    "suggestedName": "string",
    "tagline": "string",
    "personality": "string (3-4 brand personality traits)"
  },
  "targetMarket": "2-3 sentences describing ideal customer",
  "competitiveEdge": "2-3 unique differentiators",
  "revenueStreams": ["stream1", "stream2", "stream3"],
  "launchRoadmap": [
    { "phase": "Phase 1: Foundation", "weeks": "Week 1-3", "actions": ["action1", "action2", "action3"] },
    { "phase": "Phase 2: Build", "weeks": "Week 4-6", "actions": ["action1", "action2"] },
    { "phase": "Phase 3: Launch", "weeks": "Week 7-9", "actions": ["action1", "action2"] },
    { "phase": "Phase 4: Growth", "weeks": "Week 10-12", "actions": ["action1", "action2"] }
  ],
  "successMetrics": ["metric1", "metric2", "metric3", "metric4"]
}`,
    user: `Business idea: "${businessIdea}". Generate a complete business plan.`,
  };
}

function getMarketingPrompt(businessIdea: string) {
  return {
    system: `You are an expert growth marketer specializing in social media. Given a business idea, produce a social media campaign. Respond ONLY with valid JSON (no markdown, no code fences).

Output format (JSON):
{
  "brandVoice": "2 sentences describing the brand voice/tone",
  "campaignStrategy": "2-3 sentences on the overall approach",
  "posts": [
    {
      "platform": "Instagram",
      "headline": "short catchy headline",
      "body": "full post body copy (2-4 sentences)",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "scheduledDay": "Monday",
      "scheduledTime": "10:00 AM"
    }
  ]
}

Generate 5-6 posts across Instagram, Twitter/X, and LinkedIn.`,
    user: `Business idea: "${businessIdea}". Generate a social media campaign.`,
  };
}

function getFinancePrompt(businessIdea: string) {
  return {
    system: `You are an expert financial analyst for startups. Given a business idea, produce a financial analysis. Respond ONLY with valid JSON (no markdown, no code fences).

Output format (JSON):
{
  "projectedInvestment": "$XX,XXX",
  "monthlyBurn": "$X,XXX",
  "breakEvenMonth": "Month X",
  "monthlyProjections": [
    { "month": "Month 1", "revenue": 0, "expenses": 5000 },
    { "month": "Month 2", "revenue": 1000, "expenses": 5200 }
  ],
  "startupCosts": [
    { "category": "Equipment", "amount": 5000 },
    { "category": "Marketing", "amount": 3000 },
    { "category": "Rent (3 months)", "amount": 9000 },
    { "category": "Inventory", "amount": 4000 },
    { "category": "Legal & Permits", "amount": 2000 },
    { "category": "Technology", "amount": 1500 },
    { "category": "Miscellaneous", "amount": 1000 }
  ]
}

Generate all 12 months of projections with realistic ramp-up.`,
    user: `Business idea: "${businessIdea}". Generate a complete financial analysis.`,
  };
}

function getOperationsPrompt(businessIdea: string) {
  return {
    system: `You are an expert operations manager. Given a business idea, produce an operations manual. Respond ONLY with valid JSON (no markdown, no code fences).

Output format (JSON):
{
  "supplierChecklist": [
    { "item": "supplier/item name", "priority": "High|Medium|Low", "estimatedCost": "$X,XXX", "notes": "brief note" }
  ],
  "dailySOP": [
    { "step": 1, "time": "6:00 AM", "task": "task description", "responsible": "role" },
    { "step": 2, "time": "7:00 AM", "task": "task description", "responsible": "role" }
  ],
  "qualityChecklist": [
    { "item": "quality check item", "frequency": "Daily|Weekly|Monthly", "standard": "acceptable standard description" }
  ]
}

Generate at least 8 supplier items, 8 SOP steps, and 6 quality checks.`,
    user: `Business idea: "${businessIdea}". Generate an operations manual.`,
  };
}

function getWebsitePrompt(businessIdea: string) {
  return {
    system: `You are an expert web developer and copywriter. Given a business idea, produce landing page content and structure. Respond ONLY with valid JSON (no markdown, no code fences).

Output format (JSON):
{
  "hero": {
    "headline": "compelling headline",
    "subheadline": "supporting subheadline (1-2 sentences)",
    "ctaText": "Call to action button text",
    "ctaSecondary": "secondary CTA text"
  },
  "features": [
    { "title": "feature title", "description": "1-2 sentences", "icon": "emoji" }
  ],
  "testimonials": [
    { "name": "Customer Name", "role": "Role/Title", "quote": "testimonial quote" }
  ],
  "pricing": [
    { "plan": "plan name", "price": "$XX/mo", "features": ["feature1", "feature2", "feature3"], "highlighted": false }
  ],
  "faq": [
    { "question": "question text", "answer": "answer text" }
  ],
  "footer": {
    "tagline": "closing tagline",
    "links": ["About", "Contact", "Privacy", "Terms"]
  }
}

Generate 4 features, 3 testimonials, 3 pricing tiers, and 4 FAQs.`,
    user: `Business idea: "${businessIdea}". Generate a complete landing page.`,
  };
}

// ═══════════════════════════════════════════════════════════
// Pipeline Runner
// ═══════════════════════════════════════════════════════════

function getModel() {
  // Prefer Gemini if key is available, then OpenAI
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const google = createGoogleGenerativeAI({ apiKey: geminiKey });
    return google("gemini-2.0-flash");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  // If no key exists, return null — pipeline will use mock data
  return null;
}

function getPromptForAgent(agentKey: string, businessIdea: string) {
  switch (agentKey) {
    case "planner": return getPlannerPrompt(businessIdea);
    case "marketing": return getMarketingPrompt(businessIdea);
    case "finance": return getFinancePrompt(businessIdea);
    case "operations": return getOperationsPrompt(businessIdea);
    case "website": return getWebsitePrompt(businessIdea);
    default: return getPlannerPrompt(businessIdea);
  }
}

// Mock deliverable data for when no API key is available
function getMockDeliverable(agentKey: string, businessIdea: string): string {
  const mocks: Record<string, object> = {
    planner: {
      businessConcept: `A modern take on "${businessIdea}" that combines premium quality with community-driven growth.`,
      brandIdentity: { suggestedName: "AuraVenture", tagline: "Build Something Beautiful", personality: "Bold, Innovative, Community-driven" },
      targetMarket: "Young professionals aged 25-40 in urban areas who value quality, convenience, and authentic experiences.",
      competitiveEdge: "AI-powered personalization, sustainable practices, and a subscription model that builds loyalty.",
      revenueStreams: ["Direct sales", "Subscription memberships", "Corporate partnerships", "Online marketplace"],
      launchRoadmap: [
        { phase: "Phase 1: Foundation", weeks: "Week 1-3", actions: ["Market research & validation", "Brand identity design", "Legal setup & permits"] },
        { phase: "Phase 2: Build", weeks: "Week 4-6", actions: ["Product development", "Website launch", "Social media setup"] },
        { phase: "Phase 3: Launch", weeks: "Week 7-9", actions: ["Soft launch with beta users", "PR & influencer outreach", "Grand opening event"] },
        { phase: "Phase 4: Growth", weeks: "Week 10-12", actions: ["Scale marketing campaigns", "Expand product line", "Partnership development"] },
      ],
      successMetrics: ["100 customers in first month", "85% customer satisfaction", "$10K MRR by month 3", "4.5+ star average review"],
    },
    marketing: {
      brandVoice: "Friendly, aspirational, and authentic. We speak like a knowledgeable friend who genuinely wants to help you succeed.",
      campaignStrategy: "Launch with a 'Behind the Scenes' content series showing the build process, followed by user-generated content campaigns to build community.",
      posts: [
        { platform: "Instagram", headline: "We're building something special ✨", body: "Every great business starts with a bold idea. Ours? Redefining what quality means in this space. Follow along as we build from the ground up.", hashtags: ["#startup", "#buildingInPublic", "#entrepreneur", "#newbusiness", "#dream"], scheduledDay: "Monday", scheduledTime: "10:00 AM" },
        { platform: "Twitter/X", headline: "Day 1 of building our dream 🚀", body: "Just filed the paperwork. The journey of a thousand miles begins with a single step. Here's to new beginnings!", hashtags: ["#startuplife", "#day1", "#founder"], scheduledDay: "Tuesday", scheduledTime: "9:00 AM" },
        { platform: "LinkedIn", headline: "Why I Left My Job to Start This Business", body: "After years of seeing the gap in the market, I decided to take the leap. Here's what drove my decision and what I've learned in the first week.", hashtags: ["#entrepreneurship", "#careerchange", "#leadership"], scheduledDay: "Wednesday", scheduledTime: "8:00 AM" },
        { platform: "Instagram", headline: "Sneak peek at what's coming 👀", body: "We can't wait to share this with you. Our team has been working around the clock to bring you something truly special. Drop a 🔥 if you're excited!", hashtags: ["#comingsoon", "#sneakpeek", "#excited", "#staytuned"], scheduledDay: "Thursday", scheduledTime: "12:00 PM" },
        { platform: "Twitter/X", headline: "The 3 things every new founder should know", body: "1. Your first plan will change. 2. Talk to customers before building. 3. Done is better than perfect. What would you add?", hashtags: ["#foundertips", "#startupadvice"], scheduledDay: "Friday", scheduledTime: "11:00 AM" },
      ],
    },
    finance: {
      projectedInvestment: "$25,500",
      monthlyBurn: "$4,800",
      breakEvenMonth: "Month 6",
      monthlyProjections: [
        { month: "Month 1", revenue: 0, expenses: 8000 },
        { month: "Month 2", revenue: 1200, expenses: 5200 },
        { month: "Month 3", revenue: 3500, expenses: 5000 },
        { month: "Month 4", revenue: 5800, expenses: 4800 },
        { month: "Month 5", revenue: 7200, expenses: 4800 },
        { month: "Month 6", revenue: 9500, expenses: 5000 },
        { month: "Month 7", revenue: 11000, expenses: 5200 },
        { month: "Month 8", revenue: 13500, expenses: 5500 },
        { month: "Month 9", revenue: 15000, expenses: 5800 },
        { month: "Month 10", revenue: 17500, expenses: 6000 },
        { month: "Month 11", revenue: 19000, expenses: 6200 },
        { month: "Month 12", revenue: 22000, expenses: 6500 },
      ],
      startupCosts: [
        { category: "Equipment", amount: 5000 },
        { category: "Marketing & Branding", amount: 4000 },
        { category: "Rent (3 months deposit)", amount: 6000 },
        { category: "Initial Inventory", amount: 4500 },
        { category: "Legal & Permits", amount: 2500 },
        { category: "Technology & Software", amount: 2000 },
        { category: "Miscellaneous", amount: 1500 },
      ],
    },
    operations: {
      supplierChecklist: [
        { item: "Primary raw materials supplier", priority: "High", estimatedCost: "$2,000/mo", notes: "Get quotes from 3+ vendors" },
        { item: "Packaging supplier", priority: "High", estimatedCost: "$500/mo", notes: "Eco-friendly options preferred" },
        { item: "Equipment maintenance service", priority: "Medium", estimatedCost: "$200/mo", notes: "Quarterly maintenance contract" },
        { item: "Cleaning supplies vendor", priority: "Medium", estimatedCost: "$150/mo", notes: "Commercial grade required" },
        { item: "Uniform supplier", priority: "Low", estimatedCost: "$300 one-time", notes: "Branded with logo" },
        { item: "POS system provider", priority: "High", estimatedCost: "$80/mo", notes: "Cloud-based with analytics" },
        { item: "Insurance broker", priority: "High", estimatedCost: "$250/mo", notes: "Business liability + property" },
        { item: "Accounting software", priority: "Medium", estimatedCost: "$30/mo", notes: "QuickBooks or similar" },
      ],
      dailySOP: [
        { step: 1, time: "6:00 AM", task: "Open facility, check equipment, review daily targets", responsible: "Manager" },
        { step: 2, time: "6:30 AM", task: "Inspect inventory levels, note items to reorder", responsible: "Inventory Lead" },
        { step: 3, time: "7:00 AM", task: "Team huddle: review goals, assign roles, address concerns", responsible: "Manager" },
        { step: 4, time: "7:30 AM", task: "Prepare workspace, ensure all tools and materials are ready", responsible: "All Staff" },
        { step: 5, time: "8:00 AM", task: "Begin service/production operations", responsible: "All Staff" },
        { step: 6, time: "12:00 PM", task: "Midday quality check and customer feedback review", responsible: "Manager" },
        { step: 7, time: "5:00 PM", task: "End-of-day cleanup, equipment shutdown, cash reconciliation", responsible: "Closing Team" },
        { step: 8, time: "5:30 PM", task: "Log daily metrics, update inventory, prepare next-day checklist", responsible: "Manager" },
      ],
      qualityChecklist: [
        { item: "Product/service quality standards met", frequency: "Daily", standard: "All outputs meet documented quality benchmarks" },
        { item: "Customer satisfaction score review", frequency: "Weekly", standard: "Maintain 4.5+ average across all channels" },
        { item: "Equipment calibration and maintenance", frequency: "Monthly", standard: "All equipment within manufacturer specs" },
        { item: "Staff performance evaluation", frequency: "Monthly", standard: "All team members meet KPI targets" },
        { item: "Health and safety compliance audit", frequency: "Weekly", standard: "100% compliance with local regulations" },
        { item: "Financial reconciliation", frequency: "Daily", standard: "Cash and digital payments balanced within $5" },
      ],
    },
    website: {
      hero: { headline: "The Future of Your Business Starts Here", subheadline: "We combine innovation with quality to deliver an experience you won't find anywhere else. Join thousands of happy customers.", ctaText: "Get Started Free", ctaSecondary: "Watch Demo" },
      features: [
        { title: "Premium Quality", description: "Every detail is crafted with care. We never compromise on quality, from sourcing to delivery.", icon: "✨" },
        { title: "Lightning Fast", description: "Get what you need, when you need it. Our streamlined process ensures rapid turnaround without cutting corners.", icon: "⚡" },
        { title: "Community First", description: "Join a thriving community of like-minded individuals. Share, learn, and grow together.", icon: "🤝" },
        { title: "Smart Pricing", description: "Transparent, fair pricing with no hidden fees. Choose a plan that fits your needs and budget.", icon: "💰" },
      ],
      testimonials: [
        { name: "Sarah Chen", role: "Small Business Owner", quote: "This completely transformed how I run my business. I saved 10+ hours per week!" },
        { name: "Marcus Johnson", role: "Freelance Designer", quote: "The quality is unmatched. I've tried competitors and nothing comes close." },
        { name: "Priya Patel", role: "Marketing Director", quote: "Easy to use, great support, and the results speak for themselves. Highly recommend!" },
      ],
      pricing: [
        { plan: "Starter", price: "$29/mo", features: ["Core features", "Email support", "1 user", "Basic analytics"], highlighted: false },
        { plan: "Professional", price: "$79/mo", features: ["Everything in Starter", "Priority support", "5 users", "Advanced analytics", "Custom branding"], highlighted: true },
        { plan: "Enterprise", price: "$199/mo", features: ["Everything in Professional", "24/7 phone support", "Unlimited users", "API access", "Dedicated account manager"], highlighted: false },
      ],
      faq: [
        { question: "How do I get started?", answer: "Simply click 'Get Started Free' and create your account. No credit card required for the trial." },
        { question: "Can I change plans later?", answer: "Absolutely! You can upgrade or downgrade your plan at any time from your dashboard." },
        { question: "What's your refund policy?", answer: "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full." },
        { question: "Do you offer custom solutions?", answer: "Yes! Contact our sales team for enterprise solutions tailored to your specific needs." },
      ],
      footer: { tagline: "Building the future, one business at a time.", links: ["About", "Blog", "Contact", "Privacy Policy", "Terms of Service"] },
    },
  };
  return JSON.stringify(mocks[agentKey] || mocks.planner);
}

async function logEvent(projectId: string, agentKey: string | null, message: string) {
  await prisma.projectEvent.create({
    data: { projectId, agentKey, message },
  });
}

async function runSingleAgent(projectId: string, taskId: string, agentKey: string, businessIdea: string) {
  const agentDef = AGENT_DEFINITIONS.find((a) => a.key === agentKey)!;

  // Mark as working
  await prisma.agentTask.update({
    where: { id: taskId },
    data: { status: "working", startedAt: new Date() },
  });

  await logEvent(projectId, agentKey, `${agentDef.displayName} started working on ${agentDef.deliverableType}`);

  let deliverableContent: string;
  const model = getModel();

  if (model) {
    try {
      const prompts = getPromptForAgent(agentKey, businessIdea);
      const result = await generateText({
        model: model as any,
        system: prompts.system,
        prompt: prompts.user,
        maxTokens: 2000,
      });
      deliverableContent = result.text;
    } catch (err) {
      console.error(`LLM call failed for ${agentKey}:`, err);
      deliverableContent = getMockDeliverable(agentKey, businessIdea);
    }
  } else {
    // No API key — use mock data with a realistic delay
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
    deliverableContent = getMockDeliverable(agentKey, businessIdea);
  }

  // Store deliverable and mark as needs_review
  await prisma.agentTask.update({
    where: { id: taskId },
    data: {
      status: "needs_review",
      deliverableType: agentDef.deliverableType,
      deliverableContent,
      completedAt: new Date(),
    },
  });

  await logEvent(projectId, agentKey, `${agentDef.displayName} finished — ${agentDef.deliverableType} ready for review`);
}

export async function runAgentPipeline(projectId: string, businessIdea: string) {
  try {
    // Orchestrator: assign all tasks
    await logEvent(projectId, null, `New business goal received: "${businessIdea}"`);
    await logEvent(projectId, null, "Orchestrator assigned tasks to the AI team");

    // Set all tasks to queued
    await prisma.agentTask.updateMany({
      where: { projectId },
      data: { status: "queued" },
    });

    // Update project status to running
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "running" },
    });

    // Fetch all tasks
    const tasks = await prisma.agentTask.findMany({
      where: { projectId },
    });

    // Run all 5 agents concurrently
    await Promise.all(
      tasks.map((task) => runSingleAgent(projectId, task.id, task.agentKey, businessIdea))
    );

    // All done
    await logEvent(projectId, null, "All agents completed their deliverables");

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "completed" },
    });
  } catch (error) {
    console.error("Pipeline error:", error);
    await logEvent(projectId, null, "Pipeline encountered an error. Some deliverables may be incomplete.");
  }
}
