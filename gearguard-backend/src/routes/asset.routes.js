import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetStats
} from '../controllers/asset.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/assets/stats - Get asset statistics
router.get('/stats', getAssetStats);

// GET /api/assets - Get all assets with optional filters
router.get('/', getAllAssets);

// GET /api/assets/:id - Get single asset
router.get('/:id', getAssetById);

// POST /api/assets - Create new asset
router.post('/', createAsset);

// PUT /api/assets/:id - Update asset
router.put('/:id', updateAsset);

// DELETE /api/assets/:id - Delete asset
router.delete('/:id', deleteAsset);

export default router;
