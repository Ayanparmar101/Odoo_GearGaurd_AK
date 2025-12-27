import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder routes - will be implemented in Phase 2
router.get('/', authenticate, async (req, res) => {
  res.json({ message: 'User routes' });
});

export default router;
