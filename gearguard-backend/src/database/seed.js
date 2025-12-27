import bcrypt from 'bcryptjs';
import { db } from '../config/firebase.js';
import { collections } from '../models/firestore.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Firebase database seeding...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Teams
    const teamsData = [
      {
        name: 'IT Support',
        specialization: 'Information Technology',
        description: 'Handles all IT equipment maintenance and troubleshooting',
        color: '#0ea5e9',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mechanical Team',
        specialization: 'Mechanical Workshop',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Electrical Team',
        specialization: 'Electrical Systems',
        description: 'Handles electrical equipment and power systems',
        color: '#8b5cf6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'General Maintenance',
        specialization: 'General',
        description: 'Handles general maintenance tasks',
        color: '#10b981',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const teamIds = [];
    for (const teamData of teamsData) {
      const teamRef = await db.collection(collections.TEAMS).add(teamData);
      teamIds.push(teamRef.id);
    }

    console.log('✅ Teams created');

    // Create Demo Users
    const usersData = [
      {
        name: 'Demo Employee',
        email: 'demo.employee@gearguard.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Engineering',
        phone: '+1234567890',
        avatar: null,
        isActive: true,
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Demo Technician',
        email: 'demo.technician@gearguard.com',
        password: hashedPassword,
        role: 'technician',
        department: 'Maintenance',
        teamId: teamIds[0],
        phone: '+1234567891',
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Demo Manager',
        email: 'demo.manager@gearguard.com',
        password: hashedPassword,
        role: 'manager',
        department: 'Operations',
        phone: '+1234567892',
        avatar: null,
        isActive: true,
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Additional technicians
      {
        name: 'John Smith',
        email: 'john.smith@gearguard.com',
        password: hashedPassword,
        role: 'technician',
        department: 'IT Support',
        teamId: teamIds[0],
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gearguard.com',
        password: hashedPassword,
        role: 'technician',
        department: 'Mechanical',
        teamId: teamIds[1],
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mike Davis',
        email: 'mike.davis@gearguard.com',
        password: hashedPassword,
        role: 'technician',
        department: 'Electrical',
        teamId: teamIds[2],
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Additional employees
      {
        name: 'Emily Brown',
        email: 'emily.brown@gearguard.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Engineering',
        avatar: null,
        isActive: true,
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@gearguard.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Production',
        avatar: null,
        isActive: true,
        teamId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const userIds = [];
    for (const userData of usersData) {
      const userRef = await db.collection(collections.USERS).add(userData);
      userIds.push(userRef.id);
    }
    console.log('✅ Users created');

    // Create Assets
    const assetsData = [
      // IT Assets
      {
        name: 'Dell Latitude 5520',
        serialNumber: 'DL-2023-001',
        category: 'IT',
        subCategory: 'Laptop',
        department: 'Engineering',
        status: 'active',
        teamId: teamIds[0],
        location: 'Floor 2, Desk 15',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        description: null,
        imageUrl: null,
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
        teamId: teamIds[0],
        location: 'Floor 1, Copy Room',
        purchaseDate: new Date('2023-03-20'),
        warrantyExpiry: new Date('2025-03-20'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cisco Router 2901',
        serialNumber: 'CR-2022-003',
        category: 'IT',
        subCategory: 'Network Equipment',
        department: 'IT Department',
        status: 'active',
        teamId: teamIds[0],
        location: 'Server Room',
        purchaseDate: new Date('2022-06-10'),
        warrantyExpiry: new Date('2025-06-10'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Workshop Assets
      {
        name: 'CNC Milling Machine',
        serialNumber: 'CNC-2021-001',
        category: 'Workshop',
        subCategory: 'Milling Machine',
        department: 'Production',
        status: 'active',
        teamId: teamIds[1],
        location: 'Workshop A',
        purchaseDate: new Date('2021-08-15'),
        warrantyExpiry: new Date('2024-08-15'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hydraulic Press 50T',
        serialNumber: 'HP-2022-002',
        category: 'Workshop',
        subCategory: 'Press',
        department: 'Production',
        status: 'maintenance',
        teamId: teamIds[1],
        location: 'Workshop B',
        purchaseDate: new Date('2022-02-20'),
        warrantyExpiry: new Date('2025-02-20'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Welding Machine Arc 400',
        serialNumber: 'WM-2023-003',
        category: 'Workshop',
        subCategory: 'Welding Equipment',
        department: 'Production',
        status: 'active',
        teamId: teamIds[2],
        location: 'Workshop C',
        purchaseDate: new Date('2023-04-10'),
        warrantyExpiry: new Date('2026-04-10'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Air Compressor 100L',
        serialNumber: 'AC-2021-004',
        category: 'Workshop',
        subCategory: 'Compressor',
        department: 'Production',
        status: 'active',
        teamId: teamIds[3],
        location: 'Workshop A',
        purchaseDate: new Date('2021-11-05'),
        warrantyExpiry: new Date('2024-11-05'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lathe Machine CTX 450',
        serialNumber: 'LM-2022-005',
        category: 'Workshop',
        subCategory: 'Lathe',
        department: 'Production',
        status: 'active',
        teamId: teamIds[1],
        location: 'Workshop B',
        purchaseDate: new Date('2022-09-18'),
        warrantyExpiry: new Date('2025-09-18'),
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const assetIds = [];
    for (const assetData of assetsData) {
      const assetRef = await db.collection(collections.ASSETS).add(assetData);
      assetIds.push(assetRef.id);
    }
    console.log('✅ Assets created');

    // Create Maintenance Requests
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const requestsData = [
      {
        requestNumber: 'MR202500001',
        assetId: assetIds[0],
        requesterId: userIds[0],
        teamId: teamIds[0],
        assignedToId: userIds[3],
        type: 'corrective',
        status: 'new',
        priority: 'high',
        description: 'Laptop not turning on, battery indicator blinking',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        scheduledDate: null,
        completedAt: null,
        duration: null,
        scrapReason: null,
        imageUrl: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requestNumber: 'MR202500002',
        assetId: assetIds[1],
        requesterId: userIds[6],
        teamId: teamIds[0],
        assignedToId: userIds[1],
        type: 'corrective',
        status: 'in_progress',
        priority: 'medium',
        description: 'Printer jamming frequently, paper feeding issues',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        scheduledDate: null,
        completedAt: null,
        duration: null,
        scrapReason: null,
        imageUrl: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requestNumber: 'MR202500003',
        assetId: assetIds[4],
        requesterId: userIds[7],
        teamId: teamIds[1],
        assignedToId: userIds[4],
        type: 'corrective',
        status: 'repaired',
        priority: 'urgent',
        description: 'Hydraulic press leaking oil, pressure dropping',
        completedAt: yesterday,
        duration: 240,
        dueDate: yesterday,
        scheduledDate: null,
        scrapReason: null,
        imageUrl: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requestNumber: 'MR202500004',
        assetId: assetIds[3],
        requesterId: userIds[2],
        teamId: teamIds[1],
        assignedToId: null,
        type: 'preventive',
        status: 'new',
        priority: 'low',
        description: 'Scheduled monthly maintenance - lubrication and inspection',
        scheduledDate: nextWeek,
        dueDate: nextWeek,
        completedAt: null,
        duration: null,
        scrapReason: null,
        imageUrl: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requestNumber: 'MR202500005',
        assetId: assetIds[5],
        requesterId: userIds[6],
        teamId: teamIds[2],
        assignedToId: userIds[5],
        type: 'corrective',
        status: 'in_progress',
        priority: 'high',
        description: 'Welding machine producing weak welds, arc unstable',
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        scheduledDate: null,
        completedAt: null,
        duration: null,
        scrapReason: null,
        imageUrl: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const requestData of requestsData) {
      await db.collection(collections.MAINTENANCE_REQUESTS).add(requestData);
    }
    console.log('✅ Maintenance requests created');
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Demo Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Employee: demo.employee@gearguard.com / password123');
    console.log('Technician: demo.technician@gearguard.com / password123');
    console.log('Manager: demo.manager@gearguard.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
