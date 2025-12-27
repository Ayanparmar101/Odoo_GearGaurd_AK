import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';
import bcrypt from 'bcryptjs';

// Create new user
export const createUser = async (req, res) => {
  try {
    const { email, password, name, role, teamId, phone } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await db.collection(COLLECTIONS.USERS)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Verify team exists if teamId provided
    if (teamId) {
      const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(teamId).get();
      if (!teamDoc.exists) {
        return res.status(404).json({ message: 'Team not found' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      email,
      password: hashedPassword,
      name,
      role,
      teamId: teamId || null,
      phone: phone || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userRef = await db.collection(COLLECTIONS.USERS).add(newUser);
    const userDoc = await userRef.get();

    // Return user without password
    const userData = { id: userDoc.id, ...userDoc.data() };
    delete userData.password;

    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, teamId, search } = req.query;
    
    let query = db.collection(COLLECTIONS.USERS);
    
    // Apply filters
    if (role) {
      query = query.where('role', '==', role);
    }
    
    if (teamId) {
      query = query.where('teamId', '==', teamId);
    }
    
    const snapshot = await query.get();
    
    let users = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.password; // Never return passwords
      return {
        id: doc.id,
        ...data
      };
    });

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Get team names for users
    const usersWithTeams = await Promise.all(
      users.map(async (user) => {
        if (user.teamId) {
          const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(user.teamId).get();
          if (teamDoc.exists) {
            user.teamName = teamDoc.data().name;
          }
        }
        return user;
      })
    );
    
    res.json(usersWithTeams);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection(COLLECTIONS.USERS).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = { id: doc.id, ...doc.data() };
    
    // Get team info if user has teamId
    if (user.teamId) {
      const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(user.teamId).get();
      if (teamDoc.exists) {
        user.team = { id: teamDoc.id, ...teamDoc.data() };
      }
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow updating password or email through this endpoint
    delete updates.password;
    delete updates.email;
    
    // Check if user exists
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If teamId is being updated, verify team exists
    if (updates.teamId) {
      const teamDoc = await db.collection(COLLECTIONS.TEAMS).doc(updates.teamId).get();
      if (!teamDoc.exists) {
        return res.status(404).json({ message: 'Team not found' });
      }
    }
    
    await db.collection(COLLECTIONS.USERS).doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await db.collection(COLLECTIONS.USERS).doc(id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user (soft delete by marking as inactive)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting your own account
    if (req.user.userId === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Mark as inactive instead of deleting
    await db.collection(COLLECTIONS.USERS).doc(id).update({
      isActive: false,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const usersSnapshot = await db.collection(COLLECTIONS.USERS).get();
    
    const stats = {
      total: usersSnapshot.size,
      byRole: {},
      active: 0,
      inactive: 0
    };
    
    usersSnapshot.docs.forEach(doc => {
      const user = doc.data();
      
      // Count by role
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
      
      // Count active/inactive
      if (user.isActive !== false) {
        stats.active++;
      } else {
        stats.inactive++;
      }
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
};
