import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function checkRequests() {
  try {
    console.log('🔍 Checking maintenance requests in database...\n');
    
    const requestsCollection = db.collection(COLLECTIONS.MAINTENANCE_REQUESTS);
    const snapshot = await requestsCollection.get();
    
    if (snapshot.empty) {
      console.log('❌ No maintenance requests found in database!');
      console.log('\n💡 Create a request through the frontend to test.');
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} maintenance request(s) in database:\n`);
    
    const requests = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        requestNumber: data.requestNumber,
        assetName: data.assetName,
        type: data.type,
        priority: data.priority,
        status: data.status,
        requestedBy: data.requestedBy,
        requesterName: data.requesterName,
        createdAt: data.createdAt
      });
    });
    
    // Display requests
    requests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.requestNumber || 'No Number'}`);
      console.log(`   Asset: ${req.assetName || 'Unknown'}`);
      console.log(`   Type: ${req.type}`);
      console.log(`   Priority: ${req.priority}`);
      console.log(`   Status: ${req.status}`);
      console.log(`   Requested By: ${req.requestedBy || 'Unknown'}`);
      console.log(`   Requester: ${req.requesterName || 'Unknown'}`);
      console.log(`   Created: ${req.createdAt}`);
      console.log(`   ID: ${req.id}\n`);
    });
    
    // Summary by status
    const statuses = {};
    requests.forEach(req => {
      statuses[req.status] = (statuses[req.status] || 0) + 1;
    });
    
    console.log('📊 Summary by Status:');
    Object.entries(statuses).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} request(s)`);
    });
    
    // Summary by priority
    const priorities = {};
    requests.forEach(req => {
      priorities[req.priority] = (priorities[req.priority] || 0) + 1;
    });
    
    console.log('\n📊 Summary by Priority:');
    Object.entries(priorities).forEach(([priority, count]) => {
      console.log(`   - ${priority}: ${count} request(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error checking requests:', error);
    throw error;
  }
}

// Run the check function
checkRequests()
  .then(() => {
    console.log('\n✨ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to check requests:', error);
    process.exit(1);
  });
