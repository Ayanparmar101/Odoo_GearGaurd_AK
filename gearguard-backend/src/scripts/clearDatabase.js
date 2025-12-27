import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

const clearDatabase = async () => {
  try {
    console.log('🗑️  Starting database cleanup...');

    const collectionsToClean = [
      collections.USERS,
      collections.TEAMS,
      collections.ASSETS,
      collections.MAINTENANCE_REQUESTS,
    ];

    for (const collectionName of collectionsToClean) {
      console.log(`\nCleaning collection: ${collectionName}`);
      
      const snapshot = await db.collection(collectionName).get();
      
      if (snapshot.empty) {
        console.log(`  ✓ ${collectionName} is already empty`);
        continue;
      }

      const deletePromises = [];
      snapshot.docs.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
      });

      await Promise.all(deletePromises);
      console.log(`  ✅ Deleted ${snapshot.size} documents from ${collectionName}`);
    }

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('All collections are now empty but still exist.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
