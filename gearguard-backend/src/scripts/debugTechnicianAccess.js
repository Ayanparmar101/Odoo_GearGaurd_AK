import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function debugTechnicianAccess() {
  try {
    console.log('🔍 DEBUGGING TECHNICIAN ACCESS\n');
    
    // Get Demo Technician user ID
    const usersSnapshot = await db.collection(COLLECTIONS.USERS)
      .where('email', '==', 'demo.technician@gearguard.com')
      .get();
    
    if (usersSnapshot.empty) {
      console.log('❌ Demo Technician not found!');
      return;
    }
    
    const demoTechDoc = usersSnapshot.docs[0];
    const demoTechId = demoTechDoc.id;
    const demoTechData = demoTechDoc.data();
    
    console.log('👤 Demo Technician:');
    console.log(`   ID: ${demoTechId}`);
    console.log(`   Name: ${demoTechData.name}`);
    console.log(`   Email: ${demoTechData.email}`);
    console.log(`   Role: ${demoTechData.role}\n`);
    
    // Get all requests assigned to this technician
    const requestsSnapshot = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS)
      .where('assignedTo', '==', demoTechId)
      .get();
    
    console.log(`📋 Requests assigned to Demo Technician: ${requestsSnapshot.size}\n`);
    
    if (requestsSnapshot.empty) {
      console.log('❌ No requests found assigned to this technician!');
      console.log('\n🔧 Checking all requests to see assignments...\n');
      
      const allRequests = await db.collection(COLLECTIONS.MAINTENANCE_REQUESTS).get();
      const assignmentCounts = {};
      
      allRequests.forEach(doc => {
        const assignedTo = doc.data().assignedTo;
        if (assignedTo) {
          assignmentCounts[assignedTo] = (assignmentCounts[assignedTo] || 0) + 1;
        }
      });
      
      console.log('Assignment distribution:');
      Object.entries(assignmentCounts).forEach(([techId, count]) => {
        console.log(`   ${techId}: ${count} request(s)`);
      });
      
      return;
    }
    
    // Show details of assigned requests
    const requests = [];
    requestsSnapshot.forEach(doc => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        requestNumber: data.requestNumber,
        assetName: data.assetName,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        assignedToName: data.assignedToName
      });
    });
    
    console.log('Assigned Requests:');
    requests.forEach(req => {
      console.log(`   ${req.requestNumber} - ${req.assetName}`);
      console.log(`      Status: ${req.status}`);
      console.log(`      Priority: ${req.priority}`);
      console.log(`      Assigned To ID: ${req.assignedTo}`);
      console.log(`      Assigned To Name: ${req.assignedToName}\n`);
    });
    
    console.log('✅ TEST QUERY:');
    console.log(`   GET /api/maintenance-requests`);
    console.log(`   Headers: Authorization: Bearer <token for ${demoTechData.email}>`);
    console.log(`   Expected: ${requestsSnapshot.size} requests\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

debugTechnicianAccess()
  .then(() => {
    console.log('✨ Debug completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
