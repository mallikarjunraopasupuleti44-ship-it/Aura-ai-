const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { AGENT_DEFINITIONS, executeAgent } = require('../services/agent-pipeline');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/projects/:id/run-agent
router.post('/:id/run-agent', async (req, res) => {
  try {
    const { id } = req.params;
    const { agentKey } = req.body;

    if (!agentKey) {
      return res.status(400).json({ error: "agentKey is required" });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Find the task
    const task = await prisma.agentTask.findFirst({
      where: { projectId: id, agentKey },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Skip if already completed
    if (task.status === "needs_review" || task.status === "approved") {
      return res.json({ message: "Already completed", task });
    }

    const agentDef = AGENT_DEFINITIONS.find((a) => a.key === agentKey);
    if (!agentDef) {
      return res.status(400).json({ error: "Invalid agentKey" });
    }

    // Mark as working
    await prisma.agentTask.update({
      where: { id: task.id },
      data: { status: "working", startedAt: new Date() },
    });

    await prisma.projectEvent.create({
      data: { projectId: id, agentKey, message: `${agentDef.displayName} started working on ${agentDef.deliverableType}` },
    });

    // Execute LLM call
    const deliverableContent = await executeAgent(agentKey, project.title);

    // Store deliverable
    const updatedTask = await prisma.agentTask.update({
      where: { id: task.id },
      data: {
        status: "needs_review",
        deliverableType: agentDef.deliverableType,
        deliverableContent,
        completedAt: new Date(),
      },
    });

    await prisma.projectEvent.create({
      data: { projectId: id, agentKey, message: `${agentDef.displayName} finished — ${agentDef.deliverableType} ready for review ✅` },
    });

    // Check if all tasks are done
    const allTasks = await prisma.agentTask.findMany({ where: { projectId: id } });
    const allDone = allTasks.every((t) => t.status === "needs_review" || t.status === "approved");

    if (allDone) {
      await prisma.project.update({ where: { id }, data: { status: "completed" } });
      await prisma.projectEvent.create({
        data: { projectId: id, agentKey: null, message: "All agents completed their deliverables 🎉" },
      });
    }

    return res.json({ task: updatedTask, message: "Agent completed" });
  } catch (error) {
    console.error(`POST /api/projects/${req.params.id}/run-agent error:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
