import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function assignRequestsToTechnicians() {
  try {
    console.log('🔧 Assigning requests to technicians...\n');
    
    // Get all technicians
    const techSnapshot = await db.collection(COLLECTIONS.USERS)
      .where('role', '==', 'technician')
      .get();
    
    if (techSnapshot.empty) {
      console.log('❌ No technicians found in database!');
      return;
    }
    
    const technicians = [];
    techSnapshot.forEach(doc => {
      technicians.push({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email
      });
    });
    
    console.log(`✅ Found ${technicians.length} technician(s)\n`);
    
    // Get all pending or unassigned requests
    const requestsSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
    
    if (requestsSnapshot.empty) {
      console.log('❌ No requests found in database!');
      return;
    }
    
    let assigned = 0;
    let skipped = 0;
    let techIndex = 0;
    
    const batch = db.batch();
    
    for (const doc of requestsSnapshot.docs) {
      const data = doc.data();
      
      // Skip if already assigned or completed/cancelled
      if (data.assignedTo || data.status === 'completed' || data.status === 'cancelled') {
        skipped++;
        continue;
      }
      
      // Assign to next technician (round-robin)
      const technician = technicians[techIndex % technicians.length];
      
      const updates = {
        assignedTo: technician.id,
        assignedToName: technician.name,
        assignedToEmail: technician.email,
        status: data.status === 'pending' ? 'assigned' : data.status,
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      batch.update(doc.ref, updates);
      
      console.log(`✅ Assigned ${data.requestNumber || doc.id} to ${technician.name}`);
      console.log(`   Status: ${data.status} → ${updates.status}`);
      console.log(`   Asset: ${data.assetName || 'Unknown'}\n`);
      
      assigned++;
      techIndex++;
    }
    
    if (assigned > 0) {
      await batch.commit();
      console.log(`\n🎉 Successfully assigned ${assigned} request(s) to technicians!`);
      console.log(`⏭️  Skipped ${skipped} request(s) (already assigned or completed)`);
      
      // Show assignment distribution
      console.log('\n📊 Assignment Distribution:');
      const distribution = {};
      techSnapshot.forEach(doc => {
        const name = doc.data().name;
        distribution[name] = 0;
      });
      
      const updatedSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
      updatedSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.assignedToName && distribution.hasOwnProperty(data.assignedToName)) {
          distribution[data.assignedToName]++;
        }
      });
      
      Object.entries(distribution).forEach(([name, count]) => {
        console.log(`   ${name}: ${count} request(s)`);
      });
    } else {
      console.log('\n⚠️  No requests needed assignment');
    }
    
  } catch (error) {
    console.error('❌ Error assigning requests:', error);
    throw error;
  }
}

// Run the assignment function
assignRequestsToTechnicians()
  .then(() => {
    console.log('\n✨ Assignment completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to assign requests:', error);
    process.exit(1);
  });
