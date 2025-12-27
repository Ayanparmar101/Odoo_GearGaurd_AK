import { db } from '../config/firebase.js';

// Collections
export const collections = {
  USERS: 'users',
  TEAMS: 'teams',
  ASSETS: 'assets',
  MAINTENANCE_REQUESTS: 'maintenanceRequests',
  COMMENTS: 'comments',
};

// Helper functions for Firestore operations
export const getCollection = (collectionName) => {
  return db.collection(collectionName);
};

export const getDocument = async (collectionName, docId) => {
  const doc = await db.collection(collectionName).doc(docId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

export const createDocument = async (collectionName, data) => {
  const docRef = await db.collection(collectionName).add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: docRef.id, ...data };
};

export const updateDocument = async (collectionName, docId, data) => {
  await db.collection(collectionName).doc(docId).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: docId, ...data };
};

export const deleteDocument = async (collectionName, docId) => {
  await db.collection(collectionName).doc(docId).delete();
};

export const queryDocuments = async (collectionName, filters = []) => {
  let query = db.collection(collectionName);
  
  filters.forEach(filter => {
    query = query.where(filter.field, filter.operator, filter.value);
  });
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export default db;
