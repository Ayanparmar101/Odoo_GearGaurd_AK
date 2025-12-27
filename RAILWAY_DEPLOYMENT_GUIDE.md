# 🚂 Railway Backend Deployment - Step by Step

## Prerequisites
- A Railway account (sign up at https://railway.app)
- Your backend code ready in `gearguard-backend` folder
- Firebase service account key (`serviceAccountKey.json`)

---

## Method 1: Deploy via Railway Dashboard (Easiest - No CLI needed)

### Step 1: Push Code to GitHub (if not already done)
```powershell
cd "c:\Users\Ayan Parmar\Desktop\THE_ODOO_project"
git add .
git commit -m "Prepare backend for Railway deployment"
git push origin main
```

### Step 2: Create New Project on Railway
1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `THE_ODOO_project` repository
5. Railway will detect your project

### Step 3: Configure Root Directory
Since your backend is in a subfolder:
1. Click on the deployed service
2. Go to **Settings** tab
3. Scroll to **"Service Settings"**
4. Under **"Root Directory"**, enter: `gearguard-backend`
5. Click **"Save"**

### Step 4: Set Environment Variables
1. Go to **Variables** tab
2. Click **"Add Variable"** and add these:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://gearguard-dev.web.app
```

### Step 5: Add Firebase Service Account
**Option A: Using Environment Variable (Recommended)**
1. Open your `gearguard-backend/serviceAccountKey.json`
2. Copy the entire JSON content
3. In Railway Variables, add:
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the entire JSON

**Option B: Using Railway Volume (Alternative)**
1. Upload the file in Railway dashboard
2. Or use Railway CLI to upload it

### Step 6: Deploy
1. Railway will automatically deploy
2. Wait for build to complete (2-3 minutes)
3. Check logs for "🚀 Server running on port 5000"

### Step 7: Get Your Railway URL
1. Go to **Settings** tab
2. Under **Networking**, click **"Generate Domain"**
3. You'll get a URL like: `https://gearguard-backend-production.up.railway.app`
4. **Copy this URL** - you'll need it!

---

## Method 2: Deploy via Railway CLI (Advanced)

### Step 1: Install Railway CLI
```powershell
# Using npm (recommended)
npm install -g @railway/cli

# Or using PowerShell installer
iwr https://railway.app/install.ps1 | iex
```

### Step 2: Login to Railway
```powershell
railway login
```
This will open your browser - authorize the CLI.

### Step 3: Navigate to Backend Folder
```powershell
cd "c:\Users\Ayan Parmar\Desktop\THE_ODOO_project\gearguard-backend"
```

### Step 4: Initialize Railway Project
```powershell
# Link to existing project (if you created one)
railway link

# OR create new project
railway init
```

### Step 5: Set Environment Variables
```powershell
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="your-super-secret-jwt-key"
railway variables set JWT_EXPIRES_IN=7d
railway variables set CORS_ORIGIN=https://gearguard-dev.web.app
```

### Step 6: Deploy
```powershell
railway up
```

This will:
- Upload your code
- Install dependencies
- Build the project
- Start the server

### Step 7: Get Deployment URL
```powershell
railway domain
```

Or visit the Railway dashboard to get your URL.

---

## After Deployment: Update Frontend

### Step 1: Update Frontend Environment
```powershell
cd "c:\Users\Ayan Parmar\Desktop\THE_ODOO_project\gearguard-frontend"
```

Edit `.env.production` file:
```env
# Replace with your Railway URL
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

### Step 2: Rebuild Frontend
```powershell
npm run build
```

### Step 3: Redeploy to Firebase
```powershell
cd "c:\Users\Ayan Parmar\Desktop\THE_ODOO_project"
firebase deploy --only hosting
```

### Step 4: Test Your Website
Visit: https://gearguard-dev.web.app

Try logging in with:
- **Email**: admin@gearguard.com
- **Password**: admin123

---

## 🔍 Troubleshooting

### Backend Won't Start?
Check Railway logs:
```powershell
railway logs
```

Common issues:
1. **Missing environment variables** - Check Variables tab
2. **serviceAccountKey.json missing** - Upload it or set as env variable
3. **Wrong Node version** - Railway auto-detects, but you can specify in package.json

### CORS Errors?
Make sure `CORS_ORIGIN` includes your Firebase Hosting URL:
```
CORS_ORIGIN=https://gearguard-dev.web.app
```

### Can't Connect to Backend?
1. Check Railway URL is correct
2. Verify backend is running (check Railway logs)
3. Make sure frontend `.env.production` has correct URL
4. Rebuild and redeploy frontend

---

## 🎯 Quick Commands Reference

```powershell
# Railway CLI Commands
railway login                 # Login to Railway
railway link                  # Link to existing project
railway init                  # Create new project
railway up                    # Deploy
railway logs                  # View logs
railway logs --tail          # Follow logs in real-time
railway domain               # Get deployment URL
railway variables            # List environment variables
railway variables set KEY=value  # Set variable
railway status               # Check deployment status

# Redeploy after changes
cd gearguard-backend
railway up
```

---

## 📝 Important Notes

1. **Free Tier**: Railway offers $5 free credit/month
2. **Always Deploy Backend BEFORE** updating frontend
3. **Keep serviceAccountKey.json SECRET** - never commit to Git
4. **Test locally first** with `npm run dev`
5. **Monitor logs** in Railway dashboard for errors

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] Backend code in `gearguard-backend` folder
- [ ] Environment variables set in Railway
- [ ] Firebase service account key uploaded
- [ ] Backend deployed and running
- [ ] Railway URL obtained
- [ ] Frontend `.env.production` updated with Railway URL
- [ ] Frontend rebuilt and redeployed to Firebase
- [ ] Login tested on https://gearguard-dev.web.app

---

## 🆘 Need Help?

If you encounter issues:
1. Check Railway logs: `railway logs --tail`
2. Verify all environment variables are set
3. Test backend URL directly: `https://your-app.up.railway.app`
4. Check Firebase console for frontend errors
5. Ensure CORS is properly configured

---

**Next**: After successful deployment, you can seed the database with demo data using the Railway CLI:
```powershell
railway run npm run db:seed
```
