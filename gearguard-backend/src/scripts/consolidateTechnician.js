import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function consolidateDemoTechnician() {
  try {
    console.log('🔧 Consolidating Demo Technician accounts...\n');
    
    // Get both Demo Technician accounts
    const snapshot = await db.collection(COLLECTIONS.USERS)
      .where('email', '==', 'demo.technician@gearguard.com')
      .get();
    
    if (snapshot.size !== 2) {
      console.log(`Found ${snapshot.size} accounts, expected 2. Exiting.`);
      return;
    }
    
    const accounts = [];
    snapshot.forEach(doc => {
      accounts.push({ id: doc.id, data: doc.data() });
    });
    
    // Keep the first one, delete the second
    const keepAccount = accounts[0];
    const deleteAccount = accounts[1];
    
    console.log(`✅ Keeping account: ${keepAccount.id}`);
    console.log(`❌ Deleting account: ${deleteAccount.id}\n`);
    
    // Get all requests assigned to the account we're deleting
    const requestsToReassign = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
      .where('assignedTo', '==', deleteAccount.id)
      .get();
    
    console.log(`📋 Reassigning ${requestsToReassign.size} request(s) to ${keepAccount.id}...\n`);
    
    // Reassign them
    const batch = db.batch();
    
    requestsToReassign.forEach(doc => {
      batch.update(doc.ref, {
        assignedTo: keepAccount.id,
        assignedToName: keepAccount.data.name,
        assignedToEmail: keepAccount.data.email,
        updatedAt: new Date().toISOString()
      });
      console.log(`  ✅ ${doc.data().requestNumber} reassigned`);
    });
    
    // Delete the duplicate account
    batch.delete(db.collection(COLLECTIONS.USERS).doc(deleteAccount.id));
    
    await batch.commit();
    
    console.log(`\n✅ Consolidation complete!`);
    console.log(`\n👤 Demo Technician:`);
    console.log(`   ID: ${keepAccount.id}`);
    console.log(`   Email: ${keepAccount.data.email}`);
    
    // Verify final count
    const finalRequests = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
      .where('assignedTo', '==', keepAccount.id)
      .get();
    
    console.log(`   Total Requests: ${finalRequests.size}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

consolidateDemoTechnician()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
