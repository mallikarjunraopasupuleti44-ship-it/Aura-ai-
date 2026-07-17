const { generateText } = require("ai");
const { createGoogleGenerativeAI } = require("@ai-sdk/google");
const { openai } = require("@ai-sdk/openai");

const AGENT_DEFINITIONS = [
  { key: "planner", displayName: "Planner Agent", deliverableType: "Business Plan" },
  { key: "marketing", displayName: "Marketing Agent", deliverableType: "Social Campaign" },
  { key: "finance", displayName: "Finance Agent", deliverableType: "Cost Analysis" },
  { key: "operations", displayName: "Operations Agent", deliverableType: "Operations Manual" },
  { key: "website", displayName: "Website Agent", deliverableType: "Landing Page" },
];

function getSystemPrompt(agentKey) {
  const prompts = {
    planner: `You are an expert business strategist. Given a business idea, produce a comprehensive, structured business plan. Respond ONLY with valid JSON (no markdown, no code fences).
Output format: { "businessConcept": "2-3 sentence summary", "brandIdentity": { "suggestedName": "string", "tagline": "string", "personality": "string" }, "targetMarket": "2-3 sentences", "competitiveEdge": "2-3 unique differentiators", "revenueStreams": ["stream1", "stream2", "stream3"], "launchRoadmap": [{ "phase": "Phase 1: Foundation", "weeks": "Week 1-3", "actions": ["action1", "action2"] }, { "phase": "Phase 2: Build", "weeks": "Week 4-6", "actions": ["action1", "action2"] }, { "phase": "Phase 3: Launch", "weeks": "Week 7-9", "actions": ["action1", "action2"] }, { "phase": "Phase 4: Growth", "weeks": "Week 10-12", "actions": ["action1", "action2"] }], "successMetrics": ["metric1", "metric2", "metric3"] }`,

    marketing: `You are an expert growth marketer specializing in social media. Given a business idea, produce a social media campaign. Respond ONLY with valid JSON (no markdown, no code fences).
Output format: { "brandVoice": "2 sentences describing brand voice", "campaignStrategy": "2-3 sentences on approach", "posts": [{ "platform": "Instagram|Twitter/X|LinkedIn", "headline": "short headline", "body": "post body (2-4 sentences)", "hashtags": ["#tag1", "#tag2"], "scheduledDay": "Monday", "scheduledTime": "10:00 AM" }] }. Generate 5 posts across Instagram, Twitter/X, and LinkedIn.`,

    finance: `You are an expert financial analyst for startups. Given a business idea, produce a financial analysis. Respond ONLY with valid JSON (no markdown, no code fences).
Output format: { "projectedInvestment": "$XX,XXX", "monthlyBurn": "$X,XXX", "breakEvenMonth": "Month X", "monthlyProjections": [{ "month": "Month 1", "revenue": 0, "expenses": 5000 }], "startupCosts": [{ "category": "Equipment", "amount": 5000 }] }. Generate all 12 months of projections.`,

    operations: `You are an expert operations manager. Given a business idea, produce an operations manual. Respond ONLY with valid JSON (no markdown, no code fences).
Output format: { "supplierChecklist": [{ "item": "name", "priority": "High|Medium|Low", "estimatedCost": "$X,XXX", "notes": "note" }], "dailySOP": [{ "step": 1, "time": "6:00 AM", "task": "description", "responsible": "role" }], "qualityChecklist": [{ "item": "check item", "frequency": "Daily|Weekly|Monthly", "standard": "standard description" }] }. Generate 8+ supplier items, 8+ SOP steps, 6+ quality checks.`,

    website: `You are an expert web developer and copywriter. Given a business idea, produce landing page content. Respond ONLY with valid JSON (no markdown, no code fences).
Output format: { "hero": { "headline": "headline", "subheadline": "1-2 sentences", "ctaText": "CTA text", "ctaSecondary": "secondary CTA" }, "features": [{ "title": "title", "description": "1-2 sentences", "icon": "emoji" }], "testimonials": [{ "name": "Name", "role": "Role", "quote": "quote" }], "pricing": [{ "plan": "name", "price": "$XX/mo", "features": ["f1", "f2"], "highlighted": false }], "faq": [{ "question": "q", "answer": "a" }], "footer": { "tagline": "tagline", "links": ["About", "Contact"] } }. Generate 4 features, 3 testimonials, 3 pricing tiers, 4 FAQs.`,
  };
  return prompts[agentKey] || prompts.planner;
}

function getMockData(agentKey) {
  const mocks = {
    planner: {
      businessConcept: "A modern business combining premium quality with community-driven growth and AI-powered personalization.",
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
      campaignStrategy: "Launch with a 'Behind the Scenes' content series showing the build process, followed by user-generated content campaigns.",
      posts: [
        { platform: "Instagram", headline: "We're building something special ✨", body: "Every great business starts with a bold idea. Follow along as we build from the ground up.", hashtags: ["#startup", "#buildingInPublic", "#entrepreneur", "#newbusiness"], scheduledDay: "Monday", scheduledTime: "10:00 AM" },
        { platform: "Twitter/X", headline: "Day 1 of building our dream 🚀", body: "Just filed the paperwork. The journey of a thousand miles begins with a single step!", hashtags: ["#startuplife", "#day1", "#founder"], scheduledDay: "Tuesday", scheduledTime: "9:00 AM" },
        { platform: "LinkedIn", headline: "Why I Started This Business", body: "After years of seeing the gap in the market, I decided to take the leap. Here's what drove my decision.", hashtags: ["#entrepreneurship", "#careerchange", "#leadership"], scheduledDay: "Wednesday", scheduledTime: "8:00 AM" },
        { platform: "Instagram", headline: "Sneak peek at what's coming 👀", body: "Our team has been working around the clock to bring you something truly special. Drop a 🔥 if you're excited!", hashtags: ["#comingsoon", "#sneakpeek", "#staytuned"], scheduledDay: "Thursday", scheduledTime: "12:00 PM" },
        { platform: "Twitter/X", headline: "3 things every founder should know", body: "1. Your first plan will change. 2. Talk to customers before building. 3. Done is better than perfect.", hashtags: ["#foundertips", "#startupadvice"], scheduledDay: "Friday", scheduledTime: "11:00 AM" },
      ],
    },
    finance: {
      projectedInvestment: "$25,500",
      monthlyBurn: "$4,800",
      breakEvenMonth: "Month 6",
      monthlyProjections: [
        { month: "Month 1", revenue: 0, expenses: 8000 }, { month: "Month 2", revenue: 1200, expenses: 5200 },
        { month: "Month 3", revenue: 3500, expenses: 5000 }, { month: "Month 4", revenue: 5800, expenses: 4800 },
        { month: "Month 5", revenue: 7200, expenses: 4800 }, { month: "Month 6", revenue: 9500, expenses: 5000 },
        { month: "Month 7", revenue: 11000, expenses: 5200 }, { month: "Month 8", revenue: 13500, expenses: 5500 },
        { month: "Month 9", revenue: 15000, expenses: 5800 }, { month: "Month 10", revenue: 17500, expenses: 6000 },
        { month: "Month 11", revenue: 19000, expenses: 6200 }, { month: "Month 12", revenue: 22000, expenses: 6500 },
      ],
      startupCosts: [
        { category: "Equipment", amount: 5000 }, { category: "Marketing & Branding", amount: 4000 },
        { category: "Rent (3 months)", amount: 6000 }, { category: "Initial Inventory", amount: 4500 },
        { category: "Legal & Permits", amount: 2500 }, { category: "Technology", amount: 2000 },
        { category: "Miscellaneous", amount: 1500 },
      ],
    },
    operations: {
      supplierChecklist: [
        { item: "Primary raw materials supplier", priority: "High", estimatedCost: "$2,000/mo", notes: "Get 3+ vendor quotes" },
        { item: "Packaging supplier", priority: "High", estimatedCost: "$500/mo", notes: "Eco-friendly preferred" },
        { item: "Equipment maintenance", priority: "Medium", estimatedCost: "$200/mo", notes: "Quarterly contract" },
        { item: "Cleaning supplies", priority: "Medium", estimatedCost: "$150/mo", notes: "Commercial grade" },
        { item: "Uniform supplier", priority: "Low", estimatedCost: "$300 one-time", notes: "Branded with logo" },
        { item: "POS system", priority: "High", estimatedCost: "$80/mo", notes: "Cloud-based with analytics" },
        { item: "Insurance broker", priority: "High", estimatedCost: "$250/mo", notes: "Liability + property" },
        { item: "Accounting software", priority: "Medium", estimatedCost: "$30/mo", notes: "QuickBooks or similar" },
      ],
      dailySOP: [
        { step: 1, time: "6:00 AM", task: "Open facility, check equipment", responsible: "Manager" },
        { step: 2, time: "6:30 AM", task: "Inspect inventory levels", responsible: "Inventory Lead" },
        { step: 3, time: "7:00 AM", task: "Team huddle: review goals", responsible: "Manager" },
        { step: 4, time: "7:30 AM", task: "Prepare workspace", responsible: "All Staff" },
        { step: 5, time: "8:00 AM", task: "Begin operations", responsible: "All Staff" },
        { step: 6, time: "12:00 PM", task: "Midday quality check", responsible: "Manager" },
        { step: 7, time: "5:00 PM", task: "End-of-day cleanup", responsible: "Closing Team" },
        { step: 8, time: "5:30 PM", task: "Log daily metrics", responsible: "Manager" },
      ],
      qualityChecklist: [
        { item: "Product quality standards met", frequency: "Daily", standard: "All outputs meet benchmarks" },
        { item: "Customer satisfaction review", frequency: "Weekly", standard: "4.5+ average" },
        { item: "Equipment calibration", frequency: "Monthly", standard: "Within manufacturer specs" },
        { item: "Staff performance evaluation", frequency: "Monthly", standard: "All meet KPI targets" },
        { item: "Health and safety audit", frequency: "Weekly", standard: "100% compliance" },
        { item: "Financial reconciliation", frequency: "Daily", standard: "Balanced within $5" },
      ],
    },
    website: {
      hero: { headline: "The Future of Your Business Starts Here", subheadline: "We combine innovation with quality to deliver an experience you won't find anywhere else.", ctaText: "Get Started Free", ctaSecondary: "Watch Demo" },
      features: [
        { title: "Premium Quality", description: "Every detail is crafted with care. We never compromise.", icon: "✨" },
        { title: "Lightning Fast", description: "Streamlined process ensures rapid turnaround.", icon: "⚡" },
        { title: "Community First", description: "Join a thriving community of like-minded individuals.", icon: "🤝" },
        { title: "Smart Pricing", description: "Transparent pricing with no hidden fees.", icon: "💰" },
      ],
      testimonials: [
        { name: "Sarah Chen", role: "Small Business Owner", quote: "This completely transformed how I run my business!" },
        { name: "Marcus Johnson", role: "Freelance Designer", quote: "The quality is unmatched. Nothing comes close." },
        { name: "Priya Patel", role: "Marketing Director", quote: "Easy to use, great support. Highly recommend!" },
      ],
      pricing: [
        { plan: "Starter", price: "$29/mo", features: ["Core features", "Email support", "1 user", "Basic analytics"], highlighted: false },
        { plan: "Professional", price: "$79/mo", features: ["Everything in Starter", "Priority support", "5 users", "Advanced analytics"], highlighted: true },
        { plan: "Enterprise", price: "$199/mo", features: ["Everything in Pro", "24/7 support", "Unlimited users", "API access"], highlighted: false },
      ],
      faq: [
        { question: "How do I get started?", answer: "Click 'Get Started Free' and create your account. No credit card required." },
        { question: "Can I change plans?", answer: "Yes! Upgrade or downgrade at any time from your dashboard." },
        { question: "Refund policy?", answer: "30-day money-back guarantee. Full refund if not satisfied." },
        { question: "Custom solutions?", answer: "Contact our sales team for enterprise solutions." },
      ],
      footer: { tagline: "Building the future, one business at a time.", links: ["About", "Blog", "Contact", "Privacy", "Terms"] },
    },
  };
  return JSON.stringify(mocks[agentKey] || mocks.planner);
}

const { getBusinessContext } = require('./rag.service');

async function executeAgent(agentKey, businessIdea, userId) {
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  let deliverableContent;
  
  // Fetch RAG context
  const context = await getBusinessContext(userId, businessIdea);
  const enrichedPrompt = `Business idea: "${businessIdea}".\n\nUse the following context to inform your output:\n${context}\n\nGenerate the deliverable now.`;

  if (geminiKey) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey });
      const result = await generateText({
        model: google("gemini-2.0-flash"),
        system: getSystemPrompt(agentKey),
        prompt: enrichedPrompt,
        maxTokens: 2000,
      });
      deliverableContent = result.text;
    } catch (err) {
      console.error(`LLM error for ${agentKey}:`, err);
      deliverableContent = getMockData(agentKey);
    }
  } else if (process.env.OPENAI_API_KEY) {
    try {
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: getSystemPrompt(agentKey),
        prompt: enrichedPrompt,
        maxTokens: 2000,
      });
      deliverableContent = result.text;
    } catch (err) {
      console.error(`LLM error for ${agentKey}:`, err);
      deliverableContent = getMockData(agentKey);
    }
  } else {
    // No API key — use mock data
    deliverableContent = getMockData(agentKey);
  }

  return deliverableContent;
}

module.exports = {
  AGENT_DEFINITIONS,
  executeAgent,
};
