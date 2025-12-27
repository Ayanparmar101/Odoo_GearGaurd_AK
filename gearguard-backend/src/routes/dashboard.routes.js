import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Placeholder routes - will be implemented in Phase 4
router.get('/stats', authenticate, async (req, res) => {
  res.json({ message: 'Dashboard routes' });
});

export default router;
