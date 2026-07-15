const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authenticateToken = require('../utils/auth.middleware');

// Protect these routes with JWT
router.post('/deploy', authenticateToken, aiController.deployAgents);
router.get('/status/:projectId', authenticateToken, aiController.getProjectStatus);

module.exports = router;
