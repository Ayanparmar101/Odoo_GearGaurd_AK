import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function normalizeStatuses() {
  try {
    console.log('🔄 Normalizing request statuses...\n');
    
    const requestsSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
    
    if (requestsSnapshot.empty) {
      console.log('❌ No requests found in database!');
      return;
    }
    
    let updated = 0;
    let skipped = 0;
    
    const batch = db.batch();
    
    requestsSnapshot.forEach(doc => {
      const data = doc.data();
      let needsUpdate = false;
      const updates = {};
      
      // Normalize status to use underscores
      if (data.status && data.status.includes('-')) {
        updates.status = data.status.replace(/-/g, '_');
        needsUpdate = true;
        console.log(`📝 ${doc.id}: ${data.status} → ${updates.status}`);
      }
      
      // Ensure all assigned requests have proper fields
      if (data.status === 'new') {
        updates.status = 'assigned';
        needsUpdate = true;
        console.log(`📝 ${doc.id}: new → assigned`);
      }
      
      if (data.status === 'repaired') {
        updates.status = 'completed';
        needsUpdate = true;
        console.log(`📝 ${doc.id}: repaired → completed`);
      }
      
      if (needsUpdate) {
        updates.updatedAt = new Date().toISOString();
        batch.update(doc.ref, updates);
        updated++;
      } else {
        skipped++;
      }
    });
    
    if (updated > 0) {
      await batch.commit();
      console.log(`\n✅ Updated ${updated} request(s)`);
      console.log(`⏭️  Skipped ${skipped} request(s) (no changes needed)`);
      
      // Show status distribution
      const updatedSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
      const statusCounts = {};
      
      updatedSnapshot.forEach(doc => {
        const status = doc.data().status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      console.log('\n📊 Status Distribution:');
      Object.entries(statusCounts).sort().forEach(([status, count]) => {
        console.log(`   ${status}: ${count} request(s)`);
      });
    } else {
      console.log('\n✅ All statuses are already normalized!');
    }
    
  } catch (error) {
    console.error('❌ Error normalizing statuses:', error);
    throw error;
  }
}

// Run the normalization function
normalizeStatuses()
  .then(() => {
    console.log('\n✨ Normalization completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to normalize statuses:', error);
    process.exit(1);
  });
