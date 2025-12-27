import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember
} from '../controllers/team.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/teams - Get all teams
router.get('/', getAllTeams);

// GET /api/teams/:id - Get single team
router.get('/:id', getTeamById);

// POST /api/teams - Create new team
router.post('/', createTeam);

// PUT /api/teams/:id - Update team
router.put('/:id', updateTeam);

// DELETE /api/teams/:id - Delete team
router.delete('/:id', deleteTeam);

// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', addTeamMember);

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', removeTeamMember);

export default router;
