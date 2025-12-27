import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function checkDuplicates() {
  try {
    const snapshot = await db.collection(COLLECTIONS.USERS)
      .where('email', '==', 'demo.technician@gearguard.com')
      .get();
    
    console.log(`Found ${snapshot.size} Demo Technician account(s):\n`);
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Email: ${data.email}`);
      console.log(`Role: ${data.role}\n`);
      
      // Count assigned requests
      const requests = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
        .where('assignedTo', '==', doc.id)
        .get();
      console.log(`  → Has ${requests.size} request(s) assigned\n`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkDuplicates();
