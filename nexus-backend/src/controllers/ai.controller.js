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
    res.status(500).json({ error: 'Internal server error' });
  }
};

const runAgents = async (projectId, ideaPrompt) => {
  try {
    const model = 'gemini-1.5-flash';

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
    const webPrompt = `You are a Web Developer. The user is building: "${ideaPrompt}". Write a 3-section landing page outline (Hero, Features, CTA).`;
    const webResponse = await ai.models.generateContent({ model, contents: webPrompt });
    await saveTask(projectId, 'Website Agent', 'Web Developer', 'Landing Page', webResponse.text);

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' }
    });

  } catch (error) {
    console.error('Error running agents:', error);
    
    // Save an error task so the user sees it in the UI
    await saveTask(projectId, 'System Error', 'AI Manager', 'Error Log', `**Failed to generate content.**\n\nError details: ${error.message || 'Unknown error'}\n\nPlease check your GEMINI_API_KEY in the Render Environment Variables.`);
    
    // Mark project as completed so polling stops
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
