# 🔥 Firebase Setup Guide for GearGuard

## Why Firebase?

Firebase provides several advantages for this project:
- **No server setup** - Cloud-hosted database
- **Real-time by default** - Built-in real-time synchronization
- **Easy scaling** - Handles growth automatically
- **Free tier** - Generous free tier for development and small projects
- **Fast deployment** - No database server to manage
- **Built-in authentication** - Can use Firebase Auth (optional)

---

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name: `gearguard-dev` (or your choice)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
   - ⚠️ **Important:** Test mode allows all reads/writes. Change rules before production!
4. Choose a location (select closest to you)
5. Click "Enable"

### 3. Get Service Account Key

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Go to "Service accounts" tab
4. Click "Generate new private key"
5. Click "Generate key" in the popup
6. A JSON file will download - this is your `serviceAccountKey.json`

### 4. Configure Backend

1. **Copy the service account key:**
   ```bash
   # Move the downloaded file to your backend folder
   # Rename it to serviceAccountKey.json
   cp ~/Downloads/gearguard-*.json gearguard-backend/serviceAccountKey.json
   ```

2. **Update `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=development

   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id  # From Firebase Console
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

   # JWT
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Find your Project ID:**
   - Go to Firebase Console → Project Settings
   - Copy the "Project ID" value
   - Paste it in your `.env` file

### 5. Set Firestore Security Rules (Development)

For development, use permissive rules:

1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Replace with:
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
4. Click "Publish"

⚠️ **Warning:** These rules allow anyone to read/write. Use only for development!

### 6. Production Security Rules (When Deploying)

For production, use these stricter rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only admins can write
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'manager';
    }
    
    // Teams collection - authenticated users can read
    match /teams/{teamId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'manager';
    }
    
    // Assets collection
    match /assets/{assetId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role in ['manager', 'technician'];
    }
    
    // Maintenance requests
    match /maintenanceRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth.token.role == 'manager';
    }
    
    // Comments
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
```

---

## Firestore Structure

Your database will have these collections:

```
firestore/
├── users/
│   └── {userId}/
│       ├── name
│       ├── email
│       ├── role
│       ├── department
│       └── ...
├── teams/
│   └── {teamId}/
│       ├── name
│       ├── specialization
│       └── ...
├── assets/
│   └── {assetId}/
│       ├── name
│       ├── category
│       ├── status
│       └── ...
├── maintenanceRequests/
│   └── {requestId}/
│       ├── assetId
│       ├── status
│       ├── priority
│       └── ...
└── comments/
    └── {commentId}/
        ├── requestId
        ├── content
        └── ...
```

---

## Verify Setup

After completing setup, test the connection:

```bash
cd gearguard-backend
npm install
npm run db:seed
```

You should see:
```
✅ Firebase initialized successfully
✅ Teams created
✅ Users created
✅ Assets created
✅ Maintenance requests created
🎉 Firebase database seeding completed successfully!
```

---

## Common Issues & Solutions

### Issue: "Failed to parse private key"
**Solution:** Make sure `serviceAccountKey.json` is valid JSON and properly formatted.

### Issue: "Permission denied"
**Solution:** Check Firestore rules - make sure they allow writes in development.

### Issue: "Project ID not found"
**Solution:** Verify `FIREBASE_PROJECT_ID` in `.env` matches your Firebase project.

### Issue: "Module not found: firebase-admin"
**Solution:** Run `npm install` in the backend folder.

---

## Firebase Console Quick Links

- **Firestore Database:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Project Settings:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/general
- **Usage Dashboard:** https://console.firebase.google.com/project/YOUR_PROJECT_ID/usage

---

## Free Tier Limits

Firebase Firestore free tier includes:
- **Storage:** 1 GB
- **Reads:** 50,000/day
- **Writes:** 20,000/day
- **Deletes:** 20,000/day

This is more than enough for development and small deployments!

---

## Next Steps

After Firebase setup:
1. Install backend dependencies: `npm install`
2. Seed the database: `npm run db:seed`
3. Start backend: `npm run dev`
4. Start frontend: `cd ../gearguard-frontend && npm run dev`

✅ You're ready to go!
