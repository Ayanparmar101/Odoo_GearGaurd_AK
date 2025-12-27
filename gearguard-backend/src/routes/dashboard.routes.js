import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get comprehensive analytics
router.get('/analytics', dashboardController.getAnalytics);

// Get key performance indicators
router.get('/kpis', dashboardController.getKPIs);

// Get trends by category
router.get('/trends', dashboardController.getTrendsByCategory);

export default router;
