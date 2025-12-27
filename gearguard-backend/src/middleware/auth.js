import jwt from 'jsonwebtoken';
import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from Firestore
    const userDoc = await db.collection(collections.USERS).doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userData = userDoc.data();
    const user = { 
      userId: userDoc.id,
      id: userDoc.id,
      ...userData 
    };

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Remove password from user object
    delete user.password;
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
