# 🔑 GearGuard - Quick Reference

## Firebase Firestore Collections

### 📁 users
```javascript
{
  name: string,
  email: string,
  password: string (bcrypt hashed),
  role: "manager" | "technician" | "team_lead",
  department: string,
  phone: string,
  teamId: string (reference),
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 📁 teams
```javascript
{
  name: string,
  specialization: string,
  description: string,
  leadId: string (reference to user),
  isActive: boolean,
  createdAt: timestamp
}
```

### 📁 assets
```javascript
{
  name: string,
  category: "HVAC" | "Electrical" | "Plumbing" | "IT Equipment" | "Safety" | "Other",
  location: string,
  status: "operational" | "under_maintenance" | "out_of_service",
  purchaseDate: string,
  warranty: string,
  teamId: string (reference),
  lastMaintenanceDate: string,
  nextScheduledMaintenance: string,
  specifications: object,
  createdAt: timestamp
}
```

### 📁 maintenanceRequests
```javascript
{
  requestNumber: string,
  assetId: string (reference),
  assetName: string (denormalized),
  title: string,
  description: string,
  priority: "low" | "medium" | "high" | "urgent",
  status: "pending" | "in_progress" | "on_hold" | "completed" | "cancelled",
  requestedById: string (reference),
  requestedByName: string (denormalized),
  assignedToId: string (reference),
  assignedToName: string (denormalized),
  assignedTeamId: string (reference),
  dueDate: string,
  completedAt: string | null,
  estimatedHours: number,
  actualHours: number,
  cost: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 📁 comments
```javascript
{
  requestId: string (reference),
  content: string,
  authorId: string (reference),
  authorName: string (denormalized),
  authorRole: string,
  type: "comment" | "status_change" | "assignment",
  metadata: object,
  createdAt: timestamp
}
```

---

## 🔐 Demo Login Credentials

### Manager (Full Access)
```
Email: manager@gearguard.com
Password: password123
Role: manager
Permissions: Full access to all features
```

### Technician
```
Email: tech@gearguard.com
Password: password123
Role: technician
Permissions: View assets, handle maintenance requests
```

### Team Lead
```
Email: lead@gearguard.com
Password: password123
Role: team_lead
Permissions: Manage team requests, assign tasks
```

### Additional Users
```
Email: tech2@gearguard.com | Password: password123 | Role: technician
Email: tech3@gearguard.com | Password: password123 | Role: technician
Email: john.smith@gearguard.com | Password: password123 | Role: technician
Email: mike.jones@gearguard.com | Password: password123 | Role: technician
Email: lisa.brown@gearguard.com | Password: password123 | Role: team_lead
```

---

## 📍 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login with email/password
POST   /api/auth/demo-login     - Quick demo login by role
GET    /api/auth/profile        - Get current user profile
POST   /api/auth/logout         - Logout (optional)
```

### Assets
```
GET    /api/assets              - Get all assets
GET    /api/assets/:id          - Get asset by ID
POST   /api/assets              - Create new asset (Manager only)
PUT    /api/assets/:id          - Update asset (Manager only)
DELETE /api/assets/:id          - Delete asset (Manager only)
GET    /api/assets/team/:teamId - Get assets by team
```

### Maintenance Requests
```
GET    /api/maintenance               - Get all requests
GET    /api/maintenance/:id           - Get request by ID
POST   /api/maintenance               - Create new request
PUT    /api/maintenance/:id           - Update request
DELETE /api/maintenance/:id           - Delete request (Manager only)
GET    /api/maintenance/asset/:id     - Get requests for asset
GET    /api/maintenance/user/:id      - Get user's requests
POST   /api/maintenance/:id/assign    - Assign request to user/team
POST   /api/maintenance/:id/status    - Update request status
POST   /api/maintenance/:id/comments  - Add comment to request
```

### Teams
```
GET    /api/teams              - Get all teams
GET    /api/teams/:id          - Get team by ID
POST   /api/teams              - Create new team (Manager only)
PUT    /api/teams/:id          - Update team (Manager only)
DELETE /api/teams/:id          - Delete team (Manager only)
GET    /api/teams/:id/members  - Get team members
```

### Users
```
GET    /api/users              - Get all users (Manager only)
GET    /api/users/:id          - Get user by ID
PUT    /api/users/:id          - Update user (Manager only)
DELETE /api/users/:id          - Delete user (Manager only)
GET    /api/users/team/:teamId - Get users by team
```

### Dashboard
```
GET    /api/dashboard/stats    - Get dashboard statistics
GET    /api/dashboard/recent   - Get recent activity
GET    /api/dashboard/alerts   - Get urgent alerts
```

---

## 🔌 Socket.io Events

### Client → Server
```javascript
socket.emit('join_room', { requestId })
socket.emit('leave_room', { requestId })
socket.emit('new_comment', { requestId, comment })
socket.emit('status_update', { requestId, status })
```

### Server → Client
```javascript
socket.on('comment_added', (data) => { ... })
socket.on('status_changed', (data) => { ... })
socket.on('request_assigned', (data) => { ... })
socket.on('notification', (data) => { ... })
```

---

## 🎨 Role Permissions Matrix

| Feature | Manager | Team Lead | Technician |
|---------|---------|-----------|------------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Assets | ✅ | ✅ | ✅ |
| Create Asset | ✅ | ❌ | ❌ |
| Edit Asset | ✅ | ❌ | ❌ |
| Delete Asset | ✅ | ❌ | ❌ |
| View Requests | ✅ | ✅ (team) | ✅ (assigned) |
| Create Request | ✅ | ✅ | ✅ |
| Assign Request | ✅ | ✅ (team) | ❌ |
| Update Status | ✅ | ✅ | ✅ (assigned) |
| Delete Request | ✅ | ❌ | ❌ |
| Manage Teams | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Reports | ✅ | ✅ (team) | ✅ (own) |

---

## 🚀 Quick Commands

### Setup
```bash
# Backend
cd gearguard-backend
npm install
npm run db:seed
npm run dev

# Frontend (new terminal)
cd gearguard-frontend
npm install
npm run dev
```

### Development
```bash
# Backend with auto-reload
npm run dev

# Frontend with hot reload
npm run dev

# Run both (if concurrently is set up)
npm run dev:all
```

### Database
```bash
# Seed database
npm run db:seed

# Clear and reseed (manual: delete collections in Firebase Console first)
npm run db:seed
```

### Build for Production
```bash
# Frontend build
cd gearguard-frontend
npm run build
# Output: dist/ folder

# Backend (no build needed, runs on Node.js)
cd gearguard-backend
npm start
```

---

## 📊 Firebase Free Tier Limits

- **Storage:** 1 GB
- **Document Reads:** 50,000/day
- **Document Writes:** 20,000/day
- **Document Deletes:** 20,000/day
- **Network Egress:** 10 GB/month

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📝 Testing Checklist

### Authentication
- [ ] Demo login (all roles)
- [ ] Regular login
- [ ] Registration
- [ ] Token expiration
- [ ] Protected routes

### Assets
- [ ] List all assets
- [ ] Filter by category
- [ ] Create asset (manager)
- [ ] Edit asset (manager)
- [ ] Delete asset (manager)

### Maintenance
- [ ] Create request
- [ ] View request details
- [ ] Assign to user/team
- [ ] Update status
- [ ] Add comments
- [ ] Real-time updates

### Real-time
- [ ] Open same request in 2 browsers
- [ ] Add comment → appears instantly
- [ ] Update status → reflects immediately
- [ ] Socket connection status

---

## 🐛 Common Issues

### "Firebase not initialized"
→ Check `serviceAccountKey.json` exists and is valid

### "Permission denied"
→ Update Firestore rules to allow reads/writes

### "Network Error"
→ Backend not running or CORS issue

### "Invalid token"
→ JWT expired, login again

### Real-time not working
→ Check Socket.io connection in browser console

---

## 📚 Useful Links

- **Firebase Console:** https://console.firebase.google.com
- **Firestore Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **Project Repository:** (your GitHub URL)
- **API Documentation:** (link to Postman/Swagger if available)

---

## 🎯 Quick Demo Script

1. **Login as Manager** → manager@gearguard.com
2. **View Dashboard** → See metrics
3. **Create Asset** → Add new equipment
4. **Create Request** → Report maintenance issue
5. **Assign to Technician** → Select user
6. **Login as Technician** (new browser) → tech@gearguard.com
7. **Open Same Request** → See real-time update
8. **Add Comment** → Watch it appear instantly
9. **Update Status** → Change to "In Progress"
10. **Check Manager View** → See status updated

---

This reference should be printed and kept handy during development! 🚀
