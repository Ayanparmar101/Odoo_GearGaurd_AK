import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/stats - Get user statistics (manager only)
router.get('/stats', authorize(['manager']), getUserStats);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', getUserById);

// PUT /api/users/:id - Update user (manager only)
router.put('/:id', authorize(['manager']), updateUser);

// DELETE /api/users/:id - Delete user (manager only)
router.delete('/:id', authorize(['manager']), deleteUser);

export default router;
