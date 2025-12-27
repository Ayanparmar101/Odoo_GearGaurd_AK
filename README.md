# GearGuard - Maintenance Management System

A modern, web-based maintenance management system for tracking IT assets and workshop equipment, managing breakdowns and preventive maintenance, and coordinating work across employees, technicians, and managers.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Firebase Account (free tier works fine)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd gearguard-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Download service account key → save as `serviceAccountKey.json` in `gearguard-backend/`
   - Update `.env` with your Firebase project ID

4. **Seed the database with demo data:**
   ```bash
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd gearguard-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:3000`

## 🎯 Demo Accounts

After seeding the database, use these demo accounts to log in:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Employee** | demo.employee@gearguard.com | password123 | Can create and track maintenance requests |
| **Technician** | demo.technician@gearguard.com | password123 | Can execute and update maintenance tasks |
| **Manager** | demo.manager@gearguard.com | password123 | Full system access, analytics, and team management |

## 📋 Current Development Status

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Project structure setup
- [x] Database schema and models
- [x] Authentication system (JWT + Demo Login)
- [x] Basic navigation and layout
- [x] Role-based routing
- [x] Responsive sidebar and header

### 🔄 Next Steps: Phase 2 - Asset & Team Management
- [ ] Asset CRUD operations
- [ ] Team management
- [ ] User management
- [ ] Search and filtering

## 🏗️ Project Structure

```
gearguard/
├── gearguard-frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management (Zustand)
│   │   └── App.jsx
│   └── package.json
├── gearguard-backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   └── index.js
│   └── package.json
├── UIUX/                    # UI/UX reference images
├── masterplan.md            # Project requirements
└── DEVELOPMENT_TIMELINE.md  # Detailed timeline
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **State Management:** Zustand
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Charts:** Chart.js + react-chartjs-2
- **Real-time:** Socket.io Client
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Firebase Firestore
- **Authentication:** JWT + Firebase Auth (optional)
- **Real-time:** Socket.io + Firestore real-time listeners
- **Validation:** express-validator
- **Security:** Helmet, CORS

## 🎨 Features by Role

### Employee
- View personal dashboard
- Create maintenance requests
- Track request status
- View request history

### Technician
- Kanban board for task management
- Drag-and-drop status updates
- View assigned tasks
- Calendar view
- Update task progress

### Manager
- Complete system oversight
- Asset management
- Team management
- User management
- Analytics and reports
- Preventive maintenance scheduling
- Calendar view

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Protected API routes
- Input validation
- SQL injection prevention (Sequelize ORM)
Firebase security rules
- NoSQL injection prevention
## 📊 Database Schema
Firestore Collections
- **users** - System users with roles
- **teams** - Maintenance teams
- **assets** - Equipment and machinery
- **maintenanceRequests** - Work orders
- **caintenanceRequests** - Work orders
- **Comments** - Request timeline/history

## 🚀 Deployment

### Backend (Railway/Render/Vercel)
1. Create a Firebase project (production)
2. Upload service account key as environment secret
3. Set environment variables
4. Deploy from Git repository
5. Run seed script (one-time)

### Frontend (Vercel/Netlify)
1. Connect repository
2. Set environment variables
3. Build command: `npm run build`
4. Deploy

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/demo-login` - Demo login by role
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get current user profile

### Assets (Coming in Phase 2)
- `GET /api/assets` - List all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/:id` - Get asset details
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Maintenance (Coming in Phase 3)
- `GET /api/maintenance` - List maintenance requests
- `POST /api/maintenance` - Create new request
- `PUT /api/maintenance/:id` - Update request
- `GET /api/maintenance/:id/comments` - Get request comments

## 🤝 Contributing

This is a college project for hackathon submission. Currently not open for external contributions.

## 📄 License

Private - College Project

## 👥 Team

Developed as a college project demonstrating production-grade maintenance management.

## 📞 Support

For questions about setup or development, refer to [DEVELOPMENT_TIMELINE.md](DEVELOPMENT_TIMELINE.md)

---

**Note:** This is Phase 1 completion. Full functionality will be available after completing all 5 phases outlined in the development timeline.
