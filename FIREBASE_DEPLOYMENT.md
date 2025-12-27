# 🚀 Firebase Deployment Guide

## Issue: Login Not Working

Your website is deployed at: https://gearguard-dev.web.app
But the **backend is still running on localhost**, which the deployed site cannot access.

## ✅ Solution: Deploy Backend to Railway

### Step 1: Install Railway CLI (if not already installed)

```powershell
# Using npm
npm install -g @railway/cli

# Or using PowerShell
iwr https://railway.app/install.ps1 | iex
```

### Step 2: Login to Railway

```powershell
railway login
```

### Step 3: Deploy Backend

```powershell
cd gearguard-backend
railway init  # If not already linked to a project
railway up    # Deploy
```

### Step 4: Get Your Railway URL

After deployment, Railway will give you a URL like:
`https://your-app-name.up.railway.app`

### Step 5: Update Frontend Environment

1. Open `gearguard-frontend/.env.production`
2. Update the URL:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```

### Step 6: Rebuild and Redeploy Frontend

```powershell
cd gearguard-frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## 🔄 Alternative: Test Locally

If you want to test before deploying:

### 1. Start Backend (in one terminal)
```powershell
cd gearguard-backend
node src/index.js
```

### 2. Start Frontend (in another terminal)
```powershell
cd gearguard-frontend
npm run dev
```

### 3. Open Browser
Visit: http://localhost:3000

---

## 📋 Current Status

✅ Frontend deployed to Firebase Hosting: https://gearguard-dev.web.app
✅ Backend running locally on port 5000
❌ Backend NOT deployed (needs Railway deployment)

## 🎯 Next Steps

1. Deploy backend to Railway
2. Update frontend .env.production with Railway URL
3. Redeploy frontend
4. Test login at https://gearguard-dev.web.app

---

## 🔑 Demo Login Credentials

Once backend is deployed, use these demo accounts:

- **Admin**: admin@gearguard.com / admin123
- **Manager**: manager@gearguard.com / manager123
- **Technician**: tech@gearguard.com / tech123

---

## 🆘 Quick Deploy Script

Run this after getting Railway URL:

```powershell
# Set your Railway URL
$RAILWAY_URL = "https://your-app.up.railway.app"

# Update frontend config
(Get-Content gearguard-frontend/.env.production) -replace 'http://localhost:5000', $RAILWAY_URL | Set-Content gearguard-frontend/.env.production

# Rebuild and deploy
cd gearguard-frontend
npm run build
cd ..
firebase deploy --only hosting

Write-Host "✅ Deployment complete!"
Write-Host "🌐 Visit: https://gearguard-dev.web.app"
```
