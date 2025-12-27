import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

// Get all teams
export const getAllTeams = async (req, res) => {
  try {
    const snapshot = await db.collection(collections.TEAMS).get();
    const teams = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const teamData = { id: doc.id, ...doc.data() };
        
        // Get member count
        const membersSnapshot = await db.collection(collections.USERS)
          .where('teamId', '==', doc.id)
          .get();
        
        teamData.memberCount = membersSnapshot.size;
        
        // Get assigned assets count
        const assetsSnapshot = await db.collection(collections.ASSETS)
          .where('teamId', '==', doc.id)
          .get();
        
        teamData.assetCount = assetsSnapshot.size;
        
        return teamData;
      })
    );
    
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams', error: error.message });
  }
};

// Get team by ID
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection(collections.TEAMS).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    const team = { id: doc.id, ...doc.data() };
    
    // Get team members
    const membersSnapshot = await db.collection(collections.USERS)
      .where('teamId', '==', id)
      .get();
    
    team.members = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: undefined // Don't send passwords
    }));
    
    // Get assigned assets
    const assetsSnapshot = await db.collection(collections.ASSETS)
      .where('teamId', '==', id)
      .get();
    
    team.assets = assetsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get recent maintenance requests
    const requestsSnapshot = await db.collection(collections.MAINTENANCE_REQUESTS)
      .where('assignedTeamId', '==', id)
      .get();
    
    const requests = requestsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    team.activeRequests = requests.filter(r => ['pending', 'in_progress'].includes(r.status)).length;
    team.completedRequests = requests.filter(r => r.status === 'completed').length;
    
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Failed to fetch team', error: error.message });
  }
};

// Create new team
export const createTeam = async (req, res) => {
  try {
    const { name, specialization, description } = req.body;
    
    if (!name || !specialization) {
      return res.status(400).json({ 
        message: 'Team name and specialization are required' 
      });
    }
    
    const teamData = {
      name,
      specialization,
      description: description || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection(collections.TEAMS).add(teamData);
    
    res.status(201).json({
      id: docRef.id,
      ...teamData,
      message: 'Team created successfully'
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Failed to create team', error: error.message });
  }
};

// Update team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const docRef = db.collection(collections.TEAMS).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Team not found' });
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
      message: 'Team updated successfully'
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Failed to update team', error: error.message });
  }
};

// Delete team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = db.collection(collections.TEAMS).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if team has members
    const membersSnapshot = await db.collection(collections.USERS)
      .where('teamId', '==', id)
      .get();
    
    if (!membersSnapshot.empty) {
      return res.status(400).json({ 
        message: 'Cannot delete team with assigned members. Please reassign members first.' 
      });
    }
    
    // Check if team has assigned assets
    const assetsSnapshot = await db.collection(collections.ASSETS)
      .where('teamId', '==', id)
      .get();
    
    if (!assetsSnapshot.empty) {
      return res.status(400).json({ 
        message: 'Cannot delete team with assigned assets. Please reassign assets first.' 
      });
    }
    
    await docRef.delete();
    
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Failed to delete team', error: error.message });
  }
};

// Add member to team
export const addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if team exists
    const teamDoc = await db.collection(collections.TEAMS).doc(id).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user exists
    const userDoc = await db.collection(collections.USERS).doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user's team
    await db.collection(collections.USERS).doc(userId).update({
      teamId: id,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Member added to team successfully' });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Failed to add team member', error: error.message });
  }
};

// Remove member from team
export const removeTeamMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    
    const userDoc = await db.collection(collections.USERS).doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user's team to null
    await db.collection(collections.USERS).doc(userId).update({
      teamId: null,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Member removed from team successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ message: 'Failed to remove team member', error: error.message });
  }
};
