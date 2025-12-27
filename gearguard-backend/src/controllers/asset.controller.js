import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

// Get all assets with filters
export const getAllAssets = async (req, res) => {
  try {
    const { category, status, teamId, search } = req.query;
    
    let query = db.collection(collections.ASSETS);
    
    // Apply filters
    if (category) query = query.where('category', '==', category);
    if (status) query = query.where('status', '==', status);
    if (teamId) query = query.where('teamId', '==', teamId);
    
    const snapshot = await query.get();
    let assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Apply text search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      assets = assets.filter(asset => 
        asset.name?.toLowerCase().includes(searchLower) ||
        asset.assetTag?.toLowerCase().includes(searchLower) ||
        asset.location?.toLowerCase().includes(searchLower)
      );
    }
    
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Failed to fetch assets', error: error.message });
  }
};

// Get single asset by ID
export const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection(collections.ASSETS).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    const asset = { id: doc.id, ...doc.data() };
    
    // Get assigned team details
    if (asset.teamId) {
      const teamDoc = await db.collection(collections.TEAMS).doc(asset.teamId).get();
      if (teamDoc.exists) {
        asset.team = { id: teamDoc.id, ...teamDoc.data() };
      }
    }
    
    // Get maintenance history
    const requestsSnapshot = await db.collection(collections.MAINTENANCE_REQUESTS)
      .where('assetId', '==', id)
      .get();
    
    asset.maintenanceHistory = requestsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ message: 'Failed to fetch asset', error: error.message });
  }
};

// Create new asset
export const createAsset = async (req, res) => {
  try {
    const {
      name,
      assetTag,
      category,
      manufacturer,
      model,
      purchaseDate,
      warrantyExpiry,
      location,
      teamId,
      status,
      specifications
    } = req.body;
    
    // Validation
    if (!name || !category) {
      return res.status(400).json({ 
        message: 'Name and category are required' 
      });
    }
    
    const assetData = {
      name,
      assetTag: assetTag || `ASSET-${Date.now()}`,
      category,
      manufacturer: manufacturer || '',
      model: model || '',
      purchaseDate: purchaseDate || null,
      warrantyExpiry: warrantyExpiry || null,
      location: location || '',
      teamId: teamId || null,
      status: status || 'operational',
      specifications: specifications || {},
      lastMaintenanceDate: null,
      nextScheduledMaintenance: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection(collections.ASSETS).add(assetData);
    
    res.status(201).json({
      id: docRef.id,
      ...assetData,
      message: 'Asset created successfully'
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ message: 'Failed to create asset', error: error.message });
  }
};

// Update asset
export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const docRef = db.collection(collections.ASSETS).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    
    res.json({
      id,
      ...updatedDoc.data(),
      message: 'Asset updated successfully'
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Failed to update asset', error: error.message });
  }
};

// Delete asset
export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = db.collection(collections.ASSETS).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    // Check if asset has open maintenance requests
    const openRequestsSnapshot = await db.collection(collections.MAINTENANCE_REQUESTS)
      .where('assetId', '==', id)
      .where('status', 'in', ['pending', 'in_progress'])
      .get();
    
    if (!openRequestsSnapshot.empty) {
      return res.status(400).json({ 
        message: 'Cannot delete asset with open maintenance requests' 
      });
    }
    
    await docRef.delete();
    
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ message: 'Failed to delete asset', error: error.message });
  }
};

// Get asset statistics
export const getAssetStats = async (req, res) => {
  try {
    const assetsSnapshot = await db.collection(collections.ASSETS).get();
    const assets = assetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const stats = {
      total: assets.length,
      byCategory: {},
      byStatus: {
        operational: 0,
        under_maintenance: 0,
        out_of_service: 0
      }
    };
    
    assets.forEach(asset => {
      // Count by category
      if (asset.category) {
        stats.byCategory[asset.category] = (stats.byCategory[asset.category] || 0) + 1;
      }
      
      // Count by status
      if (asset.status) {
        stats.byStatus[asset.status] = (stats.byStatus[asset.status] || 0) + 1;
      }
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching asset stats:', error);
    res.status(500).json({ message: 'Failed to fetch asset statistics', error: error.message });
  }
};
