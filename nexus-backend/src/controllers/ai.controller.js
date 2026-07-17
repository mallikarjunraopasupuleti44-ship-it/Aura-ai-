const { GoogleGenAI } = require('@google/genai');
const prisma = require('../utils/db');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const { AGENT_DEFINITIONS, executeAgent } = require('../services/agent-pipeline');

const deployAgents = async (req, res) => {
  try {
    const { ideaPrompt } = req.body;
    const userId = req.user.userId;

    if (!ideaPrompt) {
      return res.status(400).json({ error: 'ideaPrompt is required' });
    }

    // 1. Create a Project in the database
    const project = await prisma.project.create({
      data: {
        userId,
        title: ideaPrompt,
        status: 'deploying'
      }
    });

    res.status(202).json({ 
      message: 'AI Workforce deployed successfully',
      projectId: project.id
    });

    // 2. Background Task: Run the agents asynchronously
    runAgents(project.id, ideaPrompt, userId).catch(console.error);

  } catch (error) {
    console.error('Deploy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const runAgents = async (projectId, ideaPrompt, userId) => {
  try {
    // 1. Mark as running
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'running' }
    });

    for (const agentDef of AGENT_DEFINITIONS) {
      const task = await prisma.agentTask.create({
        data: { 
          projectId, 
          agentKey: agentDef.key, 
          status: 'working'
        }
      });
      
      await prisma.projectEvent.create({
        data: { projectId, agentKey: agentDef.key, message: `${agentDef.displayName} started working on ${agentDef.deliverableType}` },
      });

      try {
        const content = await executeAgent(agentDef.key, ideaPrompt, userId);
        
        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'needs_review', deliverableType: agentDef.deliverableType, deliverableContent: content, completedAt: new Date() }
        });

        await prisma.projectEvent.create({
          data: { projectId, agentKey: agentDef.key, message: `${agentDef.displayName} finished — ${agentDef.deliverableType} ready for review ✅` },
        });

        console.log(`Agent ${agentDef.key} completed successfully.`);
      } catch (agentError) {
        console.error(`Agent ${agentDef.key} failed.`, agentError);
        await prisma.agentTask.update({
          where: { id: task.id },
          data: { status: 'needs_review', deliverableContent: `Error generating content: ${agentError.message}`, completedAt: new Date() }
        });
      }
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'completed' }
    });
    
    await prisma.projectEvent.create({
      data: { projectId, agentKey: null, message: "All agents completed their deliverables 🎉" },
    });

  } catch (error) {
    console.error('Error running agents:', error);
    
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
