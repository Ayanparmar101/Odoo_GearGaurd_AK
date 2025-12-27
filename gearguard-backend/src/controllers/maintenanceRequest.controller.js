import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

// Get all maintenance requests with filters
export const getAllRequests = async (req, res) => {
  try {
    const { status, priority, assignedTo, assetId, requestedBy, type } = req.query;
    const role = req.user.role;
    const userId = req.user.userId || req.user.id;
    
    console.log('Fetching requests for user:', { userId, role });
    
    let query = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    let requestsData = [];
    
    // Role-based filtering
    if (role === 'employee') {
      query = query.where('requestedBy', '==', userId);
      const snapshot = await query.get();
      requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else if (role === 'technician') {
      // Get user's team ID
      const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
      const userTeamId = userDoc.exists ? userDoc.data().teamId : null;
      
      // Fetch requests assigned directly to technician
      const directAssignedQuery = query.where('assignedTo', '==', userId);
      const directSnapshot = await directAssignedQuery.get();
      const directRequests = directSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // If technician has a team, also fetch requests assigned to their team
      if (userTeamId) {
        const teamAssignedQuery = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
          .where('assignedTeamId', '==', userTeamId);
        const teamSnapshot = await teamAssignedQuery.get();
        const teamRequests = teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Combine and deduplicate
        const allRequests = [...directRequests, ...teamRequests];
        const uniqueIds = new Set();
        requestsData = allRequests.filter(req => {
          if (uniqueIds.has(req.id)) return false;
          uniqueIds.add(req.id);
          return true;
        });
      } else {
        requestsData = directRequests;
      }
    } else {
      // For managers, fetch all requests
      const snapshot = await query.get();
      requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    console.log('Fetched requests from Firebase:', requestsData.length);
    
    // Apply filters in memory
    if (status) {
      requestsData = requestsData.filter(req => req.status === status);
    }
    if (priority) {
      requestsData = requestsData.filter(req => req.priority === priority);
    }
    if (assignedTo && role === 'manager') {
      requestsData = requestsData.filter(req => req.assignedTo === assignedTo);
    }
    if (assetId) {
      requestsData = requestsData.filter(req => req.assetId === assetId);
    }
    if (requestedBy && role === 'manager') {
      requestsData = requestsData.filter(req => req.requestedBy === requestedBy);
    }
    if (type) {
      requestsData = requestsData.filter(req => req.type === type);
    }
    
    // Sort by createdAt descending in memory
    requestsData.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
    
    const requests = await Promise.all(requestsData.map(async (data) => {
      const request = { ...data };
      
      // Fetch asset info
      if (data.assetId) {
        const assetDoc = await db.collection(COLLECTIONS.ASSETS).doc(data.assetId).get();
        if (assetDoc.exists) {
          request.asset = { id: assetDoc.id, ...assetDoc.data() };
        }
      }
      
      // Fetch requester info
      if (data.requestedBy) {
        const userDoc = await db.collection(COLLECTIONS.USERS).doc(data.requestedBy).get();
        if (userDoc.exists) {
          request.requester = { id: userDoc.id, name: userDoc.data().name, email: userDoc.data().email };
        }
      }
      
      // Fetch assigned technician info
      if (data.assignedTo) {
        const techDoc = await db.collection(COLLECTIONS.USERS).doc(data.assignedTo).get();
        if (techDoc.exists) {
          request.technician = { id: techDoc.id, name: techDoc.data().name, email: techDoc.data().email };
        }
      }
      
      // Fetch assigned team info
      if (data.assignedTeamId) {
        const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(data.assignedTeamId).get();
        if (teamDoc.exists) {
          const teamData = teamDoc.data();
          request.teamName = teamData.name;
          request.teamSpecialization = teamData.specialization;
        }
      }
      
      return request;
    }));
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ message: 'Failed to fetch maintenance requests' });
  }
};

// Get single maintenance request
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    const data = doc.data();
    const request = { id: doc.id, ...data };
    
    // Fetch asset info
    if (data.assetId) {
      const assetDoc = await db.collection(COLLECTIONS.ASSETS).doc(data.assetId).get();
      if (assetDoc.exists) {
        request.asset = { id: assetDoc.id, ...assetDoc.data() };
      }
    }
    
    // Fetch requester info
    if (data.requestedBy) {
      const userDoc = await db.collection(COLLECTIONS.USERS).doc(data.requestedBy).get();
      if (userDoc.exists) {
        request.requester = { id: userDoc.id, name: userDoc.data().name, email: userDoc.data().email, role: userDoc.data().role };
      }
    }
    
    // Fetch assigned technician info
    if (data.assignedTo) {
      const techDoc = await db.collection(COLLECTIONS.USERS).doc(data.assignedTo).get();
      if (techDoc.exists) {
        request.technician = { id: techDoc.id, name: techDoc.data().name, email: techDoc.data().email };
      }
    }
    
    // Fetch assigned team info
    if (data.assignedTeamId) {
      const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(data.assignedTeamId).get();
      if (teamDoc.exists) {
        const teamData = teamDoc.data();
        request.teamName = teamData.name;
        request.teamSpecialization = teamData.specialization;
      }
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
    res.status(500).json({ message: 'Failed to fetch maintenance request' });
  }
};

// Create maintenance request
export const createRequest = async (req, res) => {
  try {
    const { assetId, type, priority, description, urgency } = req.body;
    const userId = req.user.userId || req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;
    
    console.log('Creating request for user:', { userId, userName, userEmail });
    
    // Validate required fields
    if (!assetId || !type || !description) {
      return res.status(400).json({ message: 'Asset, type, and description are required' });
    }
    
    // Verify asset exists
    const assetDoc = await db.collection(COLLECTIONS.ASSETS).doc(assetId).get();
    if (!assetDoc.exists) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    const asset = assetDoc.data();
    
    // Generate request number
    const requestsSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
    const requestNumber = `REQ-${String(requestsSnapshot.size + 1).padStart(5, '0')}`;
    
    const newRequest = {
      requestNumber,
      assetId,
      assetName: asset.name,
      type,
      priority: priority || 'medium',
      urgency: urgency || 'normal',
      description,
      status: 'pending',
      requestedBy: userId,
      createdBy: userId,
      requesterName: userName,
      requesterEmail: userEmail,
      assignedTo: null,
      comments: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Saving request to Firebase:', newRequest);
    const docRef = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).add(newRequest);
    console.log('Request saved with ID:', docRef.id);
    
    res.status(201).json({ id: docRef.id, ...newRequest });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ message: 'Failed to create maintenance request' });
  }
};

// Update maintenance request
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { role } = req.user;
    
    // Check if request exists
    const requestDoc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).get();
    if (!requestDoc.exists) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    // If assigning to technician, verify technician exists
    if (updates.assignedTo) {
      const techDoc = await db.collection(COLLECTIONS.USERS).doc(updates.assignedTo).get();
      if (!techDoc.exists) {
        return res.status(404).json({ message: 'Technician not found' });
      }
      const techData = techDoc.data();
      if (techData.role !== 'technician') {
        return res.status(400).json({ message: 'User is not a technician' });
      }
    }
    
    // If assigning to team, verify team exists
    if (updates.assignedTeamId) {
      const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(updates.assignedTeamId).get();
      if (!teamDoc.exists) {
        return res.status(404).json({ message: 'Team not found' });
      }
    }
    
    // Status transition validation
    if (updates.status) {
      const validTransitions = {
        'pending': ['assigned', 'cancelled'],
        'assigned': ['in_progress', 'cancelled'],
        'in_progress': ['on_hold', 'completed', 'cancelled'],
        'on_hold': ['in_progress', 'cancelled'],
        'completed': [],
        'cancelled': [],
        // Support old formats with hyphens for backward compatibility
        'in-progress': ['on_hold', 'completed', 'cancelled'],
        'on-hold': ['in_progress', 'cancelled']
      };
      
      const currentStatus = requestDoc.data().status;
      
      // Normalize status to use underscores
      const normalizedStatus = updates.status.replace(/-/g, '_');
      updates.status = normalizedStatus;
      
      if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(normalizedStatus)) {
        return res.status(400).json({ 
          message: `Cannot transition from ${currentStatus} to ${normalizedStatus}` 
        });
      }
      
      // When completing, require completion notes
      if (normalizedStatus === 'completed' && !updates.completionNotes) {
        updates.completionNotes = 'Completed via status update';
      }
      
      // Set completion date when completed
      if (normalizedStatus === 'completed') {
        updates.completedAt = new Date().toISOString();
      }
    }
    
    await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({ message: 'Failed to update maintenance request' });
  }
};

// Delete maintenance request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if request exists
    const requestDoc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).get();
    if (!requestDoc.exists) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    const request = requestDoc.data();
    
    // Only allow deletion of pending requests
    if (request.status !== 'pending' && request.status !== 'cancelled') {
      return res.status(400).json({ 
        message: 'Can only delete pending or cancelled requests' 
      });
    }
    
    await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).delete();
    
    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance request:', error);
    res.status(500).json({ message: 'Failed to delete maintenance request' });
  }
};

// Add comment to request
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId || req.user.id;
    const name = req.user.name;
    
    console.log('Adding comment for user:', { userId, name });
    
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const requestDoc = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).get();
    if (!requestDoc.exists) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    const comment = {
      id: Date.now().toString(),
      userId,
      userName: name,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    
    const currentComments = requestDoc.data().comments || [];
    
    await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).doc(id).update({
      comments: [...currentComments, comment],
      updatedAt: new Date().toISOString()
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Get request statistics
export const getRequestStats = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.userId || req.user.id;
    
    console.log('Fetching stats for user:', { userId, role });
    
    let query = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    
    // Apply role-based filtering
    if (role === 'employee') {
      query = query.where('requestedBy', '==', userId);
    } else if (role === 'technician') {
      query = query.where('assignedTo', '==', userId);
    }
    
    const snapshot = await query.get();
    
    const stats = {
      total: snapshot.size,
      byStatus: {},
      byPriority: {},
      byType: {},
      avgCompletionTime: 0
    };
    
    let completedRequests = [];
    
    snapshot.docs.forEach(doc => {
      const request = doc.data();
      
      // Count by status
      stats.byStatus[request.status] = (stats.byStatus[request.status] || 0) + 1;
      
      // Count by priority
      stats.byPriority[request.priority] = (stats.byPriority[request.priority] || 0) + 1;
      
      // Count by type
      stats.byType[request.type] = (stats.byType[request.type] || 0) + 1;
      
      // Track completed requests for avg time calculation
      if (request.status === 'completed' && request.completedAt && request.createdAt) {
        completedRequests.push({
          createdAt: new Date(request.createdAt),
          completedAt: new Date(request.completedAt)
        });
      }
    });
    
    // Calculate average completion time in hours
    if (completedRequests.length > 0) {
      const totalTime = completedRequests.reduce((sum, req) => {
        return sum + (req.completedAt - req.createdAt);
      }, 0);
      stats.avgCompletionTime = Math.round((totalTime / completedRequests.length) / (1000 * 60 * 60));
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching request stats:', error);
    res.status(500).json({ message: 'Failed to fetch request statistics' });
  }
};
