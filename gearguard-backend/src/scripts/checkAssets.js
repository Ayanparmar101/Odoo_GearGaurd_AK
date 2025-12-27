import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

async function checkAssets() {
  try {
    console.log('🔍 Checking existing assets in database...\n');
    
    const assetsCollection = db.collection(collections.ASSETS);
    const snapshot = await assetsCollection.get();
    
    if (snapshot.empty) {
      console.log('❌ No assets found in database!');
      console.log('\n💡 Run the seedAssets.js script to add sample assets.');
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} asset(s) in database:\n`);
    
    const assets = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      assets.push({
        id: doc.id,
        name: data.name,
        assetTag: data.assetTag,
        category: data.category,
        status: data.status,
        location: data.location
      });
    });
    
    // Display assets
    assets.forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.name}`);
      console.log(`   Tag: ${asset.assetTag}`);
      console.log(`   Category: ${asset.category}`);
      console.log(`   Status: ${asset.status}`);
      console.log(`   Location: ${asset.location}`);
      console.log(`   ID: ${asset.id}\n`);
    });
    
    // Summary by category
    const categories = {};
    assets.forEach(asset => {
      categories[asset.category] = (categories[asset.category] || 0) + 1;
    });
    
    console.log('📊 Summary by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} asset(s)`);
    });
    
    // Summary by status
    const statuses = {};
    assets.forEach(asset => {
      statuses[asset.status] = (statuses[asset.status] || 0) + 1;
    });
    
    console.log('\n📊 Summary by Status:');
    Object.entries(statuses).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} asset(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error checking assets:', error);
    throw error;
  }
}

// Run the check function
checkAssets()
  .then(() => {
    console.log('\n✨ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to check assets:', error);
    process.exit(1);
  });
