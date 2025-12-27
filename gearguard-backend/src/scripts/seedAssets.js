import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

const sampleAssets = [
  {
    name: 'Hydraulic Press Machine',
    assetTag: 'HP-001',
    category: 'equipment',
    status: 'operational',
    location: 'Factory Floor A',
    manufacturer: 'HydroTech Industries',
    model: 'HT-5000',
    serialNumber: 'SN-HP-2023-001',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    lastMaintenanceDate: '2024-11-20',
    nextMaintenanceDate: '2025-02-20',
    specifications: {
      capacity: '50 Tons',
      power: '15 kW',
      dimensions: '2m x 1.5m x 3m'
    },
    notes: 'Heavy-duty hydraulic press for metal forming operations',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'CNC Milling Machine',
    assetTag: 'CNC-002',
    category: 'equipment',
    status: 'operational',
    location: 'Factory Floor B',
    manufacturer: 'PrecisionTech',
    model: 'PT-3000X',
    serialNumber: 'SN-CNC-2023-002',
    purchaseDate: '2023-03-10',
    warrantyExpiry: '2026-03-10',
    lastMaintenanceDate: '2024-12-01',
    nextMaintenanceDate: '2025-03-01',
    specifications: {
      workingArea: '1000mm x 600mm x 500mm',
      spindleSpeed: '8000 RPM',
      power: '7.5 kW'
    },
    notes: 'High-precision CNC milling machine for complex parts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Industrial Air Compressor',
    assetTag: 'AC-003',
    category: 'equipment',
    status: 'operational',
    location: 'Utility Room',
    manufacturer: 'AirFlow Systems',
    model: 'AF-150',
    serialNumber: 'SN-AC-2022-003',
    purchaseDate: '2022-08-20',
    warrantyExpiry: '2025-08-20',
    lastMaintenanceDate: '2024-11-15',
    nextMaintenanceDate: '2025-02-15',
    specifications: {
      capacity: '150 CFM',
      pressure: '175 PSI',
      tankSize: '80 Gallons'
    },
    notes: 'Main air supply for pneumatic tools and equipment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Forklift - Electric',
    assetTag: 'FL-004',
    category: 'vehicle',
    status: 'operational',
    location: 'Warehouse',
    manufacturer: 'LiftMaster',
    model: 'LM-E3000',
    serialNumber: 'SN-FL-2023-004',
    purchaseDate: '2023-06-05',
    warrantyExpiry: '2026-06-05',
    lastMaintenanceDate: '2024-12-10',
    nextMaintenanceDate: '2025-03-10',
    specifications: {
      liftCapacity: '3000 lbs',
      liftHeight: '15 feet',
      batteryType: 'Lithium-ion 48V'
    },
    notes: 'Primary warehouse material handling equipment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'HVAC System - Main Building',
    assetTag: 'HVAC-005',
    category: 'facility',
    status: 'operational',
    location: 'Main Building Roof',
    manufacturer: 'ClimateControl Pro',
    model: 'CCP-5000',
    serialNumber: 'SN-HVAC-2021-005',
    purchaseDate: '2021-04-15',
    warrantyExpiry: '2026-04-15',
    lastMaintenanceDate: '2024-10-30',
    nextMaintenanceDate: '2025-01-30',
    specifications: {
      coolingCapacity: '50 Tons',
      heatingCapacity: '500,000 BTU',
      coverage: '20,000 sq ft'
    },
    notes: 'Central HVAC system for main production facility',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Emergency Generator',
    assetTag: 'GEN-006',
    category: 'equipment',
    status: 'operational',
    location: 'Generator Room',
    manufacturer: 'PowerPro Systems',
    model: 'PP-250KW',
    serialNumber: 'SN-GEN-2022-006',
    purchaseDate: '2022-11-20',
    warrantyExpiry: '2027-11-20',
    lastMaintenanceDate: '2024-12-05',
    nextMaintenanceDate: '2025-03-05',
    specifications: {
      power: '250 kW',
      fuelType: 'Diesel',
      fuelCapacity: '500 Gallons'
    },
    notes: 'Backup power for critical operations during outages',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Laser Cutting Machine',
    assetTag: 'LC-007',
    category: 'equipment',
    status: 'maintenance',
    location: 'Factory Floor C',
    manufacturer: 'LaserTech Industries',
    model: 'LT-4000',
    serialNumber: 'SN-LC-2023-007',
    purchaseDate: '2023-09-10',
    warrantyExpiry: '2026-09-10',
    lastMaintenanceDate: '2024-12-15',
    nextMaintenanceDate: '2025-01-15',
    specifications: {
      laserPower: '4000W',
      cuttingArea: '1500mm x 3000mm',
      maxThickness: '25mm steel'
    },
    notes: 'Currently under scheduled maintenance - lens replacement',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Conveyor Belt System',
    assetTag: 'CB-008',
    category: 'equipment',
    status: 'operational',
    location: 'Assembly Line 1',
    manufacturer: 'ConveyMaster',
    model: 'CM-100',
    serialNumber: 'SN-CB-2022-008',
    purchaseDate: '2022-05-15',
    warrantyExpiry: '2025-05-15',
    lastMaintenanceDate: '2024-11-25',
    nextMaintenanceDate: '2025-02-25',
    specifications: {
      length: '50 meters',
      width: '800mm',
      speed: 'Variable 0-30 m/min'
    },
    notes: 'Main production line conveyor system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seedAssets() {
  try {
    console.log('🌱 Starting to seed assets...');
    
    const assetsCollection = db.collection(collections.ASSETS);
    
    // Check if assets already exist
    const snapshot = await assetsCollection.limit(1).get();
    if (!snapshot.empty) {
      console.log('⚠️  Assets already exist in database. Skipping seed.');
      console.log('💡 To reseed, delete existing assets first.');
      return;
    }
    
    // Add each asset
    for (const asset of sampleAssets) {
      await assetsCollection.add(asset);
      console.log(`✅ Added asset: ${asset.name} (${asset.assetTag})`);
    }
    
    console.log(`\n🎉 Successfully seeded ${sampleAssets.length} assets!`);
    console.log('\nAssets by category:');
    const categories = {};
    sampleAssets.forEach(asset => {
      categories[asset.category] = (categories[asset.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} asset(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding assets:', error);
    throw error;
  }
}

// Run the seed function
seedAssets()
  .then(() => {
    console.log('\n✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed assets:', error);
    process.exit(1);
  });
