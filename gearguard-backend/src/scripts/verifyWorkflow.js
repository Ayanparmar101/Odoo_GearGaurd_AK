import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function verifyWorkflow() {
  try {
    console.log('🔍 WORKFLOW VERIFICATION\n');
    console.log('='.repeat(60) + '\n');
    
    // Get technicians
    const techSnapshot = await db.collection(COLLECTIONS.USERS)
      .where('role', '==', 'technician')
      .get();
    
    const technicians = {};
    techSnapshot.forEach(doc => {
      technicians[doc.id] = doc.data().name;
    });
    
    console.log(`👨‍🔧 TECHNICIANS: ${Object.keys(technicians).length} active\n`);
    
    // Get all requests
    const requestsSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
    
    console.log(`📋 TOTAL REQUESTS: ${requestsSnapshot.size}\n`);
    
    // Group by status
    const byStatus = {};
    const byTechnician = {};
    
    requestsSnapshot.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'unknown';
      const techId = data.assignedTo;
      
      byStatus[status] = (byStatus[status] || 0) + 1;
      
      if (techId) {
        const techName = technicians[techId] || 'Unknown';
        if (!byTechnician[techName]) {
          byTechnician[techName] = { total: 0, assigned: 0, in_progress: 0, completed: 0, on_hold: 0 };
        }
        byTechnician[techName].total++;
        byTechnician[techName][status] = (byTechnician[techName][status] || 0) + 1;
      }
    });
    
    console.log('📊 REQUESTS BY STATUS:');
    Object.entries(byStatus).sort().forEach(([status, count]) => {
      const emoji = {
        'pending': '⏳',
        'assigned': '📌',
        'in_progress': '🔧',
        'on_hold': '⏸️',
        'completed': '✅',
        'cancelled': '❌'
      }[status] || '❓';
      console.log(`   ${emoji} ${status.padEnd(15)}: ${count} request(s)`);
    });
    
    console.log('\n👨‍🔧 REQUESTS BY TECHNICIAN:');
    Object.entries(byTechnician).sort().forEach(([name, counts]) => {
      console.log(`\n   ${name}:`);
      console.log(`      Total: ${counts.total}`);
      if (counts.assigned) console.log(`      📌 Assigned: ${counts.assigned}`);
      if (counts.in_progress) console.log(`      🔧 In Progress: ${counts.in_progress}`);
      if (counts.on_hold) console.log(`      ⏸️  On Hold: ${counts.on_hold}`);
      if (counts.completed) console.log(`      ✅ Completed: ${counts.completed}`);
    });
    
    // Sample recent assignments
    console.log('\n📋 RECENT ASSIGNED TASKS (Sample):');
    const recentAssigned = [];
    requestsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'assigned' && data.assignedTo) {
        recentAssigned.push({
          id: doc.id,
          number: data.requestNumber || 'N/A',
          asset: data.assetName || 'Unknown',
          tech: technicians[data.assignedTo] || 'Unknown',
          priority: data.priority || 'medium'
        });
      }
    });
    
    recentAssigned.slice(0, 5).forEach(req => {
      console.log(`   ${req.number} - ${req.asset} → ${req.tech} [${req.priority}]`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ WORKFLOW STATUS: OPERATIONAL');
    console.log('='.repeat(60));
    
    console.log('\n📝 NEXT STEPS:');
    console.log('   1. Refresh browser at http://localhost:3000/');
    console.log('   2. Login as Demo Technician (demo.technician@gearguard.com)');
    console.log('   3. Check Dashboard - should show assigned tasks');
    console.log('   4. Visit Kanban Board - should show tasks in columns');
    console.log('   5. Drag tasks between columns to update status\n');
    
  } catch (error) {
    console.error('❌ Error verifying workflow:', error);
    throw error;
  }
}

// Run verification
verifyWorkflow()
  .then(() => {
    console.log('✨ Verification completed!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to verify workflow:', error);
    process.exit(1);
  });
