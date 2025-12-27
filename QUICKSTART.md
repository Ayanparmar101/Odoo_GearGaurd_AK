# 🚀 GearGuard - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database** (Start in test mode for development)
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key" and save as `serviceAccountKey.json`
6. Copy this file to `gearguard-backend/` folder

### Step 2: Configure Firebase
Update `gearguard-backend/.env` with your Firebase credentials:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### Step 3: Setup Backend
```bash
# Open terminal in project root
cd gearguard-backend

# Install dependencies
npm install

# Seed database with demo data (includes demo users, teams, assets, requests)
npm run db:seed

# Start backend server
npm run dev
```

You should see:
```
✅ Firebase initialized successfully
🚀 Server running on port 5000
🔥 Using Firebase Firestore
```

### Step 4: Setup Frontend (New Terminal)
```bash
# Open new terminal in project root
cd gearguard-frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 5: Access the Application
Open your browser and go to: **http://localhost:3000**

## 🎭 Demo Login Credentials

Click on any of these roles to login instantly:

- **Employee** (Create and track requests)
- **Technician** (Manage tasks via Kanban)
- **Manager** (Full system access)

No password required for demo login!

## 🔧 Troubleshooting

### Backend won't start
**Error:** "Cannot find module 'serviceAccountKey.json'"
- Make sure you've downloaded the Firebase service account key
- Place it in `gearguard-backend/` folder
- Verify the path in `.env` file

### Firestore permission errors
- Go to Firebase Console → Firestore Database → Rules
- For development, use these rules (⚠️ NOT for production):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Frontend shows connection errors
- Ensure backend is run (stored in Firestore)
- ✅ 8 Demo Users (employees, technicians, managers)
- ✅ 8 Assets (IT equipment + workshop machinery)
- ✅ 5 Sample Maintenance Requests
- ✅ Ready-to-demo environment with Firebase backend
# Backend (change PORT in .env)
PORT=5001

# Frontend (add to package.json dev script)
"dev": "vite --port 3001"
```

## 📦 What's Included After Seeding?

- ✅ 4 Maintenance Teams
- ✅ 8 Demo Users (employees, technicians, managers)
- ✅ 8 Assets (IT equipment + workshop machinery)
- ✅ 5 Sample Maintenance Requests
- ✅ Ready-to-demo environment

## 🎯 What to Try First

### As Employee:
1. View dashboard (currently placeholder)
2. Check sidebar navigation

### As Technician:
1. View assigned tasks dashboard
2. Navigate to Kanban board (to be implemented in Phase 3)

### As Manager:
1. View system overview
2. Check analytics dashboard
3. Access team and asset management (to be implemented in Phase 2)

## 📚 Next Steps

This is **Phase 1** completion. Refer to `DEVELOPMENT_TIMELINE.md` for:
- What's coming in Phase 2-5
- Detailed feature breakdown
- Implementation timeline

## 🆘 Need Help?

1. Check [README.md](README.md) for full documentation
2. Review [DEVELOPMENT_TIMELINE.md](DEVELOPMENT_TIMELINE.md) for development plan
3. Check console logs for errors

---

**Current Status:** Phase 1 Complete ✅
- Authentication working
- Navigation implemented
- Database models ready
- Ready for Phase 2 (Asset & Team Management)
