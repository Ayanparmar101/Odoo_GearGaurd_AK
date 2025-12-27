import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getCalendarEvents,
  scheduleRequest,
  getTeamSchedule,
  getUpcomingDeadlines,
  getCalendarStats
} from '../controllers/calendar.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/calendar/events - Get calendar events
router.get('/events', getCalendarEvents);

// GET /api/calendar/stats - Get calendar statistics
router.get('/stats', getCalendarStats);

// GET /api/calendar/deadlines - Get upcoming deadlines
router.get('/deadlines', getUpcomingDeadlines);

// GET /api/calendar/team/:teamId - Get team schedule
router.get('/team/:teamId', getTeamSchedule);

// POST /api/calendar/schedule/:requestId - Schedule a maintenance request
router.post('/schedule/:requestId', scheduleRequest);

export default router;
