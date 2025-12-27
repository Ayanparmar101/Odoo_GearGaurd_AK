import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
let serviceAccount;

// Check if FIREBASE_SERVICE_ACCOUNT env variable exists (for Railway/production)
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  try {
    // Decode base64
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decoded);
    console.log('✅ Using Firebase credentials from environment variable (base64)');
  } catch (error) {
    console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT_BASE64:', error.message);
    throw new Error('Failed to parse Firebase credentials from base64 environment variable');
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('✅ Using Firebase credentials from environment variable');
  } catch (error) {
    console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT:', error.message);
    throw new Error('Failed to parse Firebase credentials from environment variable');
  }
} else {
  // Fallback to file (for local development)
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
  if (existsSync(keyPath)) {
    serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
    console.log('✅ Using Firebase credentials from file');
  } else {
    throw new Error('❌ Firebase service account credentials not found!');
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

// Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

export default admin;
