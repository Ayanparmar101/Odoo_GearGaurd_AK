import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Placeholder routes - will be implemented in Phase 3
router.get('/', authenticate, async (req, res) => {
  res.json({ message: 'Maintenance routes' });
});

export default router;
