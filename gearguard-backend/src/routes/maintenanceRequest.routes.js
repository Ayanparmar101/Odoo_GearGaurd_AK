import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  addComment,
  getRequestStats
} from '../controllers/maintenanceRequest.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/maintenance-requests/stats - Get request statistics
router.get('/stats', getRequestStats);

// GET /api/maintenance-requests - Get all requests (filtered by role)
router.get('/', getAllRequests);

// GET /api/maintenance-requests/:id - Get single request
router.get('/:id', getRequestById);

// POST /api/maintenance-requests - Create new request
router.post('/', createRequest);

// PUT /api/maintenance-requests/:id - Update request
router.put('/:id', updateRequest);

// DELETE /api/maintenance-requests/:id - Delete request
router.delete('/:id', deleteRequest);

// POST /api/maintenance-requests/:id/comments - Add comment
router.post('/:id/comments', addComment);

export default router;
