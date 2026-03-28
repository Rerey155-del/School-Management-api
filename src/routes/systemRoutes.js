const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const verifyToken = require('../middleware/authMiddleware');

// Get dynamic sidebar menu
router.get('/menu', systemController.getMenu);

// Get recent activity for dashboard (audit logs)
router.get('/audit-logs', systemController.getRecentActivity);

module.exports = router;
