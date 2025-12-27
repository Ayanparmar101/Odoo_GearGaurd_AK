import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../constants/collections.js';

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');
    
    const usersCollection = db.collection(COLLECTIONS.USERS);
    const snapshot = await usersCollection.get();
    
    if (snapshot.empty) {
      console.log('❌ No users found in database!');
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} user(s) in database:\n`);
    
    const users = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role
      });
    });
    
    // Display users
    const usersByRole = { employee: [], technician: [], manager: [] };
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email})`);
      console.log(`  Role: ${user.role}`);
      console.log(`  ID: ${user.id}\n`);
      
      if (usersByRole[user.role]) {
        usersByRole[user.role].push(user);
      }
    });
    
    console.log('📊 Summary by Role:');
    Object.entries(usersByRole).forEach(([role, roleUsers]) => {
      console.log(`   - ${role}: ${roleUsers.length} user(s)`);
    });
    
    return { users, usersByRole };
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
    throw error;
  }
}

// Run the check function
checkUsers()
  .then(() => {
    console.log('\n✨ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to check users:', error);
    process.exit(1);
  });
