# 🚀 Deployment Guide - GearGuard

## Overview

This guide covers deploying GearGuard to production using:
- **Frontend:** Vercel or Netlify (recommended)
- **Backend:** Render, Railway, or Vercel
- **Database:** Firebase Firestore (already cloud-hosted)

---

## Pre-Deployment Checklist

### Security

- [ ] Change `JWT_SECRET` to a strong random string (32+ characters)
- [ ] Update Firestore security rules (see below)
- [ ] Remove test/demo accounts or change passwords
- [ ] Enable HTTPS only
- [ ] Review CORS settings
- [ ] Remove console.log statements
- [ ] Sanitize error messages (don't expose stack traces)

### Environment

- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to production URL
- [ ] Configure production Firebase project
- [ ] Set up environment variables in hosting platform
- [ ] Test all features in production mode locally

### Code

- [ ] Run linter and fix warnings
- [ ] Run tests (if available)
- [ ] Build frontend successfully
- [ ] Remove unused dependencies
- [ ] Optimize images and assets
- [ ] Enable compression

---

## Part 1: Firestore Security Rules (Production)

### Update Security Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Replace development rules with production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isManager() {
      return isAuthenticated() && 
             request.auth.token.role == 'manager';
    }
    
    function isTechnician() {
      return isAuthenticated() && 
             request.auth.token.role in ['technician', 'team_lead'];
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isManager();
      allow update: if isManager() || isOwner(userId);
      allow delete: if isManager();
    }
    
    // Teams collection
    match /teams/{teamId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Assets collection
    match /assets/{assetId} {
      allow read: if isAuthenticated();
      allow create: if isManager();
      allow update: if isManager() || isTechnician();
      allow delete: if isManager();
    }
    
    // Maintenance requests
    match /maintenanceRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isManager();
    }
    
    // Comments
    match /comments/{commentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.authorId);
      allow delete: if isManager() || isOwner(resource.data.authorId);
    }
  }
}
```

3. Click **"Publish"**

---

## Part 2: Deploy Backend

### Option A: Render (Recommended)

#### Step 1: Prepare Code

1. Add `start` script to `package.json`:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

2. Commit your code to GitHub (if not already)

#### Step 2: Create Render Service

1. Visit [Render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** gearguard-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better performance)

#### Step 3: Add Environment Variables

In Render dashboard, add:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-strong-random-secret-32-chars-minimum
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-url.vercel.app
FIREBASE_PROJECT_ID=your-project-id
```

#### Step 4: Upload Service Account Key

**Option 1: Environment Variable (Recommended)**
```bash
# Convert JSON to base64
cat serviceAccountKey.json | base64

# Add to Render as environment variable:
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64-string>
```

Then update `src/config/firebase.js`:
```javascript
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  // Production: decode from base64
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString());
} else {
  // Development: read from file
  serviceAccount = require('../../serviceAccountKey.json');
}
```

**Option 2: Secret Files (Render only)**
1. In Render dashboard → "Secret Files"
2. Add file: `serviceAccountKey.json`
3. Paste your service account JSON content

#### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://gearguard-backend.onrender.com`

### Option B: Railway

1. Visit [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Add environment variables (same as Render)
5. Deploy

### Option C: Vercel (Serverless)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

3. Deploy:
```bash
cd gearguard-backend
vercel --prod
```

---

## Part 3: Deploy Frontend

### Option A: Vercel (Recommended for Vite)

#### Step 1: Prepare Code

1. Update `VITE_API_URL` in production `.env`:
```env
VITE_API_URL=https://gearguard-backend.onrender.com
VITE_SOCKET_URL=https://gearguard-backend.onrender.com
```

2. Build locally to test:
```bash
cd gearguard-frontend
npm run build
```

#### Step 2: Deploy to Vercel

**Option 1: CLI**
```bash
npm i -g vercel
cd gearguard-frontend
vercel --prod
```

**Option 2: Git Integration**
1. Visit [Vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** gearguard-frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add environment variables:
   - `VITE_API_URL`: Your backend URL
   - `VITE_SOCKET_URL`: Your backend URL

6. Click **"Deploy"**

#### Step 3: Update CORS

Update backend `CORS_ORIGIN` to your Vercel URL:
```env
CORS_ORIGIN=https://gearguard.vercel.app
```

### Option B: Netlify

1. Visit [Netlify.com](https://netlify.com)
2. Drag and drop your `dist/` folder OR connect GitHub
3. Configure build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables
5. Deploy

---

## Part 4: Configure Custom Domain (Optional)

### For Backend (Render)

1. In Render dashboard → Settings → Custom Domain
2. Add your domain: `api.yourdomain.com`
3. Update DNS:
   - Type: CNAME
   - Name: api
   - Value: gearguard-backend.onrender.com

### For Frontend (Vercel)

1. In Vercel dashboard → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Update DNS (Vercel provides instructions)

### Update Environment Variables

After custom domain setup:
```env
# Backend
CORS_ORIGIN=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

---

## Part 5: Post-Deployment

### Verify Deployment

1. **Test Authentication:**
```bash
curl -X POST https://api.yourdomain.com/api/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"role": "manager"}'
```

2. **Test Frontend:**
   - Open your deployed URL
   - Try demo login
   - Check browser console for errors
   - Test real-time updates

3. **Check Firestore:**
   - Visit Firebase Console
   - Verify data is being read/written
   - Check security rules are active

### Monitor Performance

1. **Firebase Console:**
   - Usage tab → Monitor reads/writes
   - Set up usage alerts

2. **Render Dashboard:**
   - Monitor CPU/Memory usage
   - Check logs for errors

3. **Vercel Analytics:**
   - Enable Vercel Analytics
   - Monitor page load times

### Set Up Logging

**Backend (Render):**
```javascript
// Add production logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});
```

---

## Troubleshooting

### "CORS Error" in Production

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env`
2. Verify it matches your frontend URL exactly
3. Restart backend server

### "Firebase Permission Denied"

**Solution:**
1. Check Firestore rules in Firebase Console
2. Verify JWT token includes `role` claim
3. Test rules in Firebase Console Rules Playground

### "Socket.io not connecting"

**Solution:**
1. Ensure `VITE_SOCKET_URL` points to backend
2. Check backend supports WebSocket connections
3. Verify no firewall blocking WebSocket

### Backend Build Fails

**Solution:**
1. Check Node.js version matches locally
2. Verify all dependencies in `package.json`
3. Run `npm install` locally first
4. Check build logs for specific errors

### Environment Variables Not Working

**Solution:**
1. Restart the service after adding variables
2. For Vite vars, ensure they start with `VITE_`
3. Rebuild frontend after changing variables

---

## Performance Optimization

### Frontend

1. **Enable compression:**
```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true }
    }
  }
}
```

2. **Lazy load routes:**
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

3. **Optimize images:**
   - Use WebP format
   - Compress images
   - Use proper sizing

### Backend

1. **Enable compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Cache responses:**
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

3. **Rate limiting:**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

---

## Scaling Considerations

### When to Upgrade

- Free tier limits exceeded (50K reads/day)
- Response time > 1 second
- 100+ concurrent users
- Need for 99.9% uptime SLA

### Upgrade Options

1. **Firebase:**
   - Blaze Plan (pay-as-you-go)
   - Automatic scaling

2. **Backend:**
   - Render: Upgrade to paid plan (7$/mo)
   - Railway: Scale resources
   - Or migrate to dedicated VPS

3. **CDN:**
   - Cloudflare (free tier)
   - Improves global load times

---

## Backup Strategy

### Firestore Backups

1. **Manual Export:**
```bash
gcloud firestore export gs://your-bucket/backup
```

2. **Scheduled Backups:**
   - Enable in Firebase Console
   - Settings → Backups → Schedule

### Code Backups

- GitHub (already backed up)
- Tag releases: `git tag v1.0.0`

---

## Cost Estimation

### Monthly Costs (Small App)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Firebase Firestore | Free (50K reads/day) | ~$5-20/month |
| Render (Backend) | Free (sleeps after inactivity) | $7/month |
| Vercel (Frontend) | Free (100GB bandwidth) | $20/month |
| **Total** | **$0** | **~$27-50/month** |

---

## Support

- **Firebase Support:** https://firebase.google.com/support
- **Render Support:** https://render.com/docs
- **Vercel Support:** https://vercel.com/support

---

## Next Steps

1. ✅ Deploy to staging environment first
2. ✅ Test all features in production mode
3. ✅ Set up monitoring and alerts
4. ✅ Create backup strategy
5. ✅ Document API for external users
6. ✅ Set up CI/CD pipeline (GitHub Actions)

---

🎉 **Your app is now live!** 🚀

Remember to:
- Monitor Firebase usage
- Check error logs regularly
- Update dependencies monthly
- Keep backups current
