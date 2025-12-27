# 🚀 GearGuard - Complete Setup Guide (Firebase Edition)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google account (for Firebase)
- Code editor (VS Code recommended)

---

## Part 1: Firebase Setup

### Step 1: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `gearguard-app` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. In left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose location (us-central1 recommended)
5. Click **"Enable"**

### Step 3: Download Service Account Key

1. Click gear icon ⚙️ → **"Project settings"**
2. Navigate to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in popup
5. Save the downloaded JSON file

### Step 4: Configure Security Rules (Development)

1. Go to **Firestore Database** → **Rules** tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

⚠️ **Important:** Change rules before production deployment!

---

## Part 2: Backend Setup

### Step 1: Clone/Navigate to Project

```bash
cd c:\Users\Ayan Parmar\Desktop\THE_ODOO_project
cd gearguard-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Express.js (server)
- Firebase Admin SDK (database)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- socket.io (real-time)
- And other dependencies

### Step 3: Configure Service Account

1. Copy your downloaded service account key:
```bash
# Move the downloaded file here and rename it
# From: gearguard-app-xxxxx.json
# To: serviceAccountKey.json
```

2. Place `serviceAccountKey.json` in `gearguard-backend/` folder

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` file:
```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id  # ← Get from Firebase Console
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

3. **Find your Project ID:**
   - Firebase Console → Project Settings
   - Copy the "Project ID" value
   - Paste in `.env` as `FIREBASE_PROJECT_ID`

### Step 5: Seed the Database

```bash
npm run db:seed
```

You should see:
```
✅ Firebase initialized successfully
✅ Teams created: 4 teams
✅ Users created: 8 users
✅ Assets created: 8 assets
✅ Maintenance requests created: 5 requests
🎉 Firebase database seeding completed successfully!
```

This creates:
- **4 teams** (IT Support, Facilities, Electrical, General)
- **8 users** with different roles
- **8 assets** across categories
- **5 maintenance requests** with various statuses

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
✅ Firebase initialized successfully
Socket.io server initialized
```

Backend is now running at `http://localhost:5000`

---

## Part 3: Frontend Setup

### Step 1: Navigate to Frontend

Open a **new terminal** window:
```bash
cd c:\Users\Ayan Parmar\Desktop\THE_ODOO_project
cd gearguard-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- Zustand (state management)
- React Router (navigation)
- Socket.io client (real-time)
- Axios (API calls)

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

Frontend is now running at `http://localhost:3000`

---

## Part 4: Verify Setup

### 1. Open Application

Visit `http://localhost:3000` in your browser

### 2. Test Demo Login

Click **"Quick Demo Login"** and choose a role:

| Role | Email | Capabilities |
|------|-------|--------------|
| **Manager** | manager@gearguard.com | Full access - manage everything |
| **Technician** | tech@gearguard.com | Handle maintenance requests |
| **Team Lead** | lead@gearguard.com | Manage team and requests |

All demo accounts use password: `password123`

### 3. Explore Features

✅ **Dashboard** - View metrics and recent activity
✅ **Assets** - Browse equipment inventory
✅ **Maintenance** - Create and manage requests
✅ **Teams** - View team information
✅ **Real-time** - Test live updates (open in 2 browsers)

### 4. Check Firebase Console

Visit Firebase Console → Firestore Database to see your data!

---

## Demo Accounts Reference

### Manager (Full Access)
- **Email:** manager@gearguard.com
- **Password:** password123
- **Can:** Create/edit/delete everything

### Technician
- **Email:** tech@gearguard.com
- **Password:** password123
- **Can:** Handle maintenance requests, update status

### Team Lead
- **Email:** lead@gearguard.com
- **Password:** password123
- **Can:** Manage team requests, assign tasks

---

## Troubleshooting

### Backend Issues

#### ❌ "Firebase initialization failed"
**Solution:**
1. Check `serviceAccountKey.json` exists in backend folder
2. Verify `FIREBASE_PROJECT_ID` in `.env` is correct
3. Ensure service account key is valid JSON

#### ❌ "Permission denied" on Firestore
**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Make sure rules allow writes (development mode)
3. Click "Publish" after changing rules

#### ❌ "Module not found: firebase-admin"
**Solution:**
```bash
cd gearguard-backend
npm install
```

### Frontend Issues

#### ❌ "Network Error" when logging in
**Solution:**
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check `VITE_API_URL` in frontend `.env` is `http://localhost:5000`
3. Verify CORS is enabled in backend

#### ❌ "Cannot find module 'axios'"
**Solution:**
```bash
cd gearguard-frontend
npm install
```

#### ❌ Real-time updates not working
**Solution:**
1. Check `VITE_SOCKET_URL` in `.env`
2. Verify backend Socket.io is initialized
3. Check browser console for Socket.io connection errors

---

## Development Workflow

### Making Changes

1. **Backend changes** (API, database):
```bash
cd gearguard-backend
# Edit files
npm run dev  # Auto-restarts on changes
```

2. **Frontend changes** (UI, components):
```bash
cd gearguard-frontend
# Edit files
# Vite auto-refreshes browser
```

### Reset Database

To clear and reseed database:
```bash
cd gearguard-backend

# Option 1: Delete collections in Firebase Console, then:
npm run db:seed

# Option 2: Use Firebase Console
# Go to Firestore → Select collection → Delete collection
# Then run: npm run db:seed
```

### Check Logs

**Backend:**
```bash
cd gearguard-backend
npm run dev  # Logs appear in terminal
```

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab

---

## Project Structure

```
THE_ODOO_project/
├── gearguard-backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js         # Firebase initialization
│   │   ├── controllers/            # API logic
│   │   ├── middleware/             # Auth, error handling
│   │   ├── models/
│   │   │   └── firestore.js        # Firestore helpers
│   │   ├── routes/                 # API endpoints
│   │   └── database/
│   │       └── seed.js             # Seed data
│   ├── serviceAccountKey.json      # Firebase credentials (gitignored)
│   ├── .env                        # Environment config
│   └── package.json
│
├── gearguard-frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── stores/                 # Zustand state
│   │   ├── services/               # API calls
│   │   └── App.jsx
│   ├── .env                        # Frontend config
│   └── package.json
│
├── FIREBASE_SETUP.md               # Detailed Firebase guide
├── FIREBASE_MIGRATION.md           # Migration details
└── README.md                       # Project overview
```

---

## Next Steps

### For Development
1. ✅ Customize the UI/UX to match your designs
2. ✅ Add more features (reports, analytics, etc.)
3. ✅ Implement file upload for assets
4. ✅ Add email notifications

### For Production
1. ✅ Update Firestore security rules (see FIREBASE_SETUP.md)
2. ✅ Change JWT_SECRET to strong random string
3. ✅ Deploy backend (Render, Railway, or Vercel)
4. ✅ Deploy frontend (Vercel, Netlify)
5. ✅ Update CORS_ORIGIN to production URL
6. ✅ Monitor Firebase usage dashboard

---

## Resources

- **Firebase Documentation:** https://firebase.google.com/docs
- **React Documentation:** https://react.dev
- **Express.js Guide:** https://expressjs.com
- **TailwindCSS Docs:** https://tailwindcss.com
- **Socket.io Guide:** https://socket.io

---

## Support

Need help? Check these files:
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase setup details
- [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) - Migration from PostgreSQL
- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

---

## 🎉 You're All Set!

Your GearGuard application is now running with:
- ✅ Firebase Firestore database
- ✅ JWT authentication
- ✅ Real-time updates
- ✅ Role-based access control
- ✅ Modern React frontend
- ✅ RESTful API backend

Happy coding! 🚀
