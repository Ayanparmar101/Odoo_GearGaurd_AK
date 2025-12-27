import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

const seedAssets = async () => {
  try {
    console.log('🌱 Adding assets to database...');

    const assetsData = [
      {
        name: 'Dell Latitude 5520',
        serialNumber: 'DL-2023-001',
        category: 'IT',
        subCategory: 'Laptop',
        department: 'Engineering',
        status: 'active',
        location: 'Floor 2, Desk 15',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'HP LaserJet Pro',
        serialNumber: 'HP-2023-002',
        category: 'IT',
        subCategory: 'Printer',
        department: 'Administration',
        status: 'active',
        location: 'Floor 1, Copy Room',
        purchaseDate: new Date('2023-03-20'),
        warrantyExpiry: new Date('2025-03-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cisco Switch 48-Port',
        serialNumber: 'CS-2023-003',
        category: 'IT',
        subCategory: 'Network Equipment',
        department: 'IT',
        status: 'active',
        location: 'Server Room A',
        purchaseDate: new Date('2022-11-10'),
        warrantyExpiry: new Date('2025-11-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'CNC Milling Machine',
        serialNumber: 'CNC-2022-001',
        category: 'Machinery',
        subCategory: 'Manufacturing',
        department: 'Production',
        status: 'active',
        location: 'Workshop Floor 1',
        purchaseDate: new Date('2022-05-15'),
        warrantyExpiry: new Date('2025-05-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Industrial Air Compressor',
        serialNumber: 'AC-2021-001',
        category: 'Machinery',
        subCategory: 'HVAC',
        department: 'Facilities',
        status: 'active',
        location: 'Mechanical Room B',
        purchaseDate: new Date('2021-08-20'),
        warrantyExpiry: new Date('2024-08-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Forklift Toyota 5000 lbs',
        serialNumber: 'FL-2020-001',
        category: 'Vehicle',
        subCategory: 'Material Handling',
        department: 'Warehouse',
        status: 'active',
        location: 'Warehouse Bay 3',
        purchaseDate: new Date('2020-03-10'),
        warrantyExpiry: new Date('2025-03-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Emergency Generator 500kW',
        serialNumber: 'GEN-2021-001',
        category: 'Electrical',
        subCategory: 'Power Supply',
        department: 'Facilities',
        status: 'active',
        location: 'Generator Room',
        purchaseDate: new Date('2021-06-15'),
        warrantyExpiry: new Date('2026-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Conference Room Projector',
        serialNumber: 'PROJ-2023-001',
        category: 'IT',
        subCategory: 'AV Equipment',
        department: 'Administration',
        status: 'active',
        location: 'Conference Room A',
        purchaseDate: new Date('2023-02-01'),
        warrantyExpiry: new Date('2026-02-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Security Camera System',
        serialNumber: 'SEC-2022-001',
        category: 'Security',
        subCategory: 'Surveillance',
        department: 'Security',
        status: 'active',
        location: 'Main Entrance',
        purchaseDate: new Date('2022-09-10'),
        warrantyExpiry: new Date('2025-09-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hydraulic Press 50 Ton',
        serialNumber: 'HP-2020-001',
        category: 'Machinery',
        subCategory: 'Manufacturing',
        department: 'Production',
        status: 'active',
        location: 'Workshop Floor 2',
        purchaseDate: new Date('2020-07-20'),
        warrantyExpiry: new Date('2025-07-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const assetData of assetsData) {
      await db.collection(collections.ASSETS).add(assetData);
    }

    console.log(`✅ Added ${assetsData.length} assets`);
    console.log('\n🎉 Assets added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding assets:', error);
    process.exit(1);
  }
};

seedAssets();
