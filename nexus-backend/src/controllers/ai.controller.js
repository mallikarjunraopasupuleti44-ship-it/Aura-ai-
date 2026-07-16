const { GoogleGenAI } = require('@google/genai');
const prisma = require('../utils/db');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const deployAgents = async (req, res) => {
  try {
    const { ideaPrompt } = req.body;
    const userId = req.user.userId;

    if (!ideaPrompt) {
      return res.status(400).json({ error: 'ideaPrompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in the backend' });
    }

    // 1. Create a Project in the database
    const project = await prisma.project.create({
      data: {
        userId,
        ideaPrompt,
        status: 'deploying'
      }
    });

    res.status(202).json({ 
      message: 'AI Workforce deployed successfully',
      projectId: project.id
    });

    // 2. Background Task: Run the agents asynchronously
    runAgents(project.id, ideaPrompt).catch(console.error);

  } catch (error) {
    console.error('Deploy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const runAgents = async (projectId, ideaPrompt) => {
  try {
    const model = 'gemini-2.0-flash';

    // Agent 1: Planner
    const plannerPrompt = `You are a Business Strategist. The user wants to build: "${ideaPrompt}". Provide a concise business plan including concept, target market, and a quick roadmap.`;
    const plannerResponse = await ai.models.generateContent({ model, contents: plannerPrompt });
    await saveTask(projectId, 'Planner Agent', 'Business Strategist', 'Business Plan', plannerResponse.text);

    // Agent 2: Marketing
    const marketingPrompt = `You are a Growth Marketer. The user is building: "${ideaPrompt}". Create a short 3-day social media content schedule with captions.`;
    const marketingResponse = await ai.models.generateContent({ model, contents: marketingPrompt });
    await saveTask(projectId, 'Marketing Agent', 'Growth Marketer', 'Social Campaign', marketingResponse.text);

    // Agent 3: Finance
    const financePrompt = `You are a Financial Analyst. The user is building: "${ideaPrompt}". Provide a brief startup cost analysis and a break-even estimate.`;
    const financeResponse = await ai.models.generateContent({ model, contents: financePrompt });
    await saveTask(projectId, 'Finance Agent', 'Financial Analyst', 'Cost Analysis', financeResponse.text);

    // Agent 4: Operations
    const opsPrompt = `You are an Operations Manager. The user is building: "${ideaPrompt}". Provide a short weekly checklist for running this business.`;
    const opsResponse = await ai.models.generateContent({ model, contents: opsPrompt });
    await saveTask(projectId, 'Operations Agent', 'Operations Manager', 'Weekly Schedule', opsResponse.text);

    // Agent 5: Website
    const agents = [
      { name: 'Planner Agent', role: 'Business Strategist', deliverable: 'Business Plan', prompt: `You are a Business Strategist. The user wants to build: "${ideaPrompt}". Provide a concise business plan including concept, target market, and a quick roadmap.` },
      { name: 'Marketing Agent', role: 'Growth Marketer', deliverable: 'Social Campaign', prompt: `You are a Growth Marketer. The user is building: "${ideaPrompt}". Create a short 3-day social media content schedule with captions.` },
      { name: 'Finance Agent', role: 'Financial Analyst', deliverable: 'Cost Analysis', prompt: `You are a Financial Analyst. The user is building: "${ideaPrompt}". Provide a brief startup cost analysis and a break-even estimate.` },
      { name: 'Operations Agent', role: 'Operations Manager', deliverable: 'Weekly Schedule', prompt: `You are an Operations Manager. The user is building: "${ideaPrompt}". Provide a short weekly checklist for running this business.` },
      { name: 'Website Agent', role: 'Web Developer', deliverable: 'Landing Page', prompt: `You are a Web Developer. The user is building: "${ideaPrompt}". Write a 3-section landing page outline (Hero, Features, CTA).` }
    ];

    for (const agent of agents) {
      const { name, role, deliverable, prompt } = agent;
      let task = await prisma.agentTask.create({
        data: { projectId, agentName: name, agentRole: role, deliverable, content: "Generating...", status: 'in-progress' }
      });

      try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'completed', content: response.text }
        });
        console.log(`Agent ${name} completed successfully.`);
      } catch (agentError) {
        console.error(`Agent ${name} failed. Generating fallback mock data.`, agentError);
        
        let mockContent = "";
        if (name === 'Planner Agent') {
          mockContent = "## Business Plan\n\n### Concept\nA modern, scalable business focused on delivering high-quality products to the local market.\n\n### Target Market\n- Demographics: 18-35 years old\n- Interests: Premium quality, convenience, sustainability\n\n### Roadmap\n1. **Month 1:** Brand identity and website launch.\n2. **Month 2:** Local marketing campaign and beta testing.\n3. **Month 3:** Official grand opening and scaling operations.\n\n> This is a fallback generated plan because the Google Gemini API quota was exceeded.";
        } else if (name === 'Marketing Agent') {
          mockContent = "## Social Media Campaign\n\n### Instagram Post 1\n**Caption:** We are finally here! Get ready to experience the best quality in town. Drop a 🌟 in the comments if you're excited!\n**Hashtags:** #LaunchDay #PremiumQuality #ComingSoon\n\n### Twitter Thread\n1/ We noticed a huge gap in the market for high-quality, affordable options.\n2/ So we decided to build it ourselves. Launching next week!\n\n> This is a fallback generated campaign because the Google Gemini API quota was exceeded.";
        } else if (name === 'Finance Agent') {
          mockContent = "## Financial Analysis\n\n### Startup Costs\n- **Equipment & Tech:** $15,000\n- **Marketing Budget:** $5,000\n- **Legal & Operations:** $2,500\n- **Total Initial Capital:** $22,500\n\n### Break-Even Analysis\nAssuming an average margin of 45%, break-even will be achieved at 1,200 units sold (approx. Month 4).\n\n### Year 1 Projection\n- **Q1:** -$5,000 (Launch phase)\n- **Q2:** +$8,000 (Growth)\n- **Q3:** +$15,000 (Scaling)\n- **Q4:** +$25,000 (Profitability)\n\n> This is a fallback generated analysis because the Google Gemini API quota was exceeded.";
        } else if (name === 'Operations Agent') {
          mockContent = "## Weekly Operations Schedule\n\n### Monday - Wednesday (Production & Sourcing)\n- 08:00 AM: Supplier inventory check\n- 10:00 AM: Quality assurance testing\n- 02:00 PM: Fulfilling early orders\n\n### Thursday - Friday (Marketing & Dispatch)\n- 09:00 AM: Social media scheduling\n- 01:00 PM: Finalizing shipping labels and dispatching packages\n- 04:00 PM: Weekly performance review\n\n### Standard Operating Procedure (SOP)\n1. All suppliers must be verified via our 3-point checklist.\n2. Customer inquiries must be answered within 4 hours.\n\n> This is a fallback generated schedule because the Google Gemini API quota was exceeded.";
        } else if (name === 'Website Agent') {
          mockContent = "## Landing Page Blueprint\n\n### Hero Section\n- **Headline:** Elevate Your Lifestyle Today.\n- **Sub-headline:** The premium solution you've been waiting for is finally here.\n- **CTA Button:** Get Early Access\n\n### Features Section\n1. **Lightning Fast:** Delivered to your door in 24 hours.\n2. **Eco-Friendly:** 100% sustainable materials.\n3. **24/7 Support:** We are always here to help.\n\n### Footer\n- Links: About Us, Contact, Privacy Policy, Terms of Service.\n- Social Links: Instagram, Twitter, LinkedIn.\n\n> This is a fallback generated blueprint because the Google Gemini API quota was exceeded.";
        }

        await prisma.agentTask.update({
          where: { id: task.id },
          data: {
            status: 'completed',
            content: mockContent,
          }
        });
        console.log(`Agent ${name} fallback applied successfully.`);
      }
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' }
    });

  } catch (error) {
    console.error('Error running agents:', error);
    
    await saveTask(projectId, 'System Error', 'AI Manager', 'Error Log', `**Failed to generate content.**\n\nError details: ${error.message || 'Unknown error'}\n\nPlease check your GEMINI_API_KEY in the Render Environment Variables.`);
    
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' }
    });
  }
};

const saveTask = async (projectId, agentName, agentRole, deliverable, content) => {
  await prisma.agentTask.create({
    data: {
      projectId,
      agentName,
      agentRole,
      deliverable,
      content,
      status: 'completed'
    }
  });
};

const getProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { agentTasks: true }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  deployAgents,
  getProjectStatus
};
