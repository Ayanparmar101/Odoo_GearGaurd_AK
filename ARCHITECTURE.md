# 🏗️ GearGuard - Technical Architecture

## System Overview

GearGuard is a three-tier web application following modern full-stack architecture patterns:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  React App + TailwindCSS + Zustand + Socket.io Client       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                   APPLICATION LAYER (Server)                 │
│  Express.js + Socket.io + JWT Middleware + Controllers       │
└────────────────────────┬────────────────────────────────────┘
                         │ Sequelize ORM
┌────────────────────────┴────────────────────────────────────┐
│                    DATA LAYER (Database)                     │
│           PostgreSQL (Relational Database)                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework:** React 18 (with JSX)
- **Build Tool:** Vite (fast HMR, optimized builds)
- **Styling:** TailwindCSS (utility-first CSS)
- **State Management:** Zustand (lightweight, hook-based)
- **Routing:** React Router v6 (client-side routing)
- **HTTP Client:** Axios (with interceptors)
- **Real-time:** Socket.io Client
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   └── layout/         # Layout components (Sidebar, Header)
├── pages/              # Page components (route-level)
│   ├── employee/       # Employee-specific pages
│   ├── technician/     # Technician-specific pages
│   └── manager/        # Manager-specific pages
├── services/           # API service layer
│   ├── api.js         # Axios instance with interceptors
│   └── auth.service.js # Authentication services
├── store/              # Zustand stores
│   └── authStore.js   # Authentication state
├── App.jsx            # Root component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles + Tailwind
```

### Key Design Patterns

#### 1. Protected Routes
```jsx
<ProtectedRoute allowedRoles={['manager']}>
  <ManagerDashboard />
</ProtectedRoute>
```
- Checks authentication status
- Validates user role
- Redirects unauthorized users

#### 2. State Management (Zustand)
```javascript
const { user, login, logout } = useAuthStore();
```
- Persistent storage (localStorage)
- Simple hook-based API
- No boilerplate like Redux

#### 3. API Service Layer
```javascript
// Automatic token injection
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
- Centralized error handling
- Automatic token management
- Response interceptors

---

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js (REST API)
- **Database:** PostgreSQL
- **ORM:** Sequelize (models, migrations, associations)
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.io
- **Security:** Helmet, CORS
- **Validation:** express-validator
- **Logging:** Morgan

### Folder Structure
```
src/
├── config/             # Configuration files
│   └── database.js    # Sequelize connection
├── controllers/        # Request handlers (business logic)
│   └── auth.controller.js
├── models/            # Sequelize models
│   ├── User.js
│   ├── Team.js
│   ├── Asset.js
│   ├── MaintenanceRequest.js
│   ├── Comment.js
│   └── index.js       # Model associations
├── routes/            # Express routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── asset.routes.js
│   ├── team.routes.js
│   ├── maintenance.routes.js
│   └── dashboard.routes.js
├── middleware/        # Custom middleware
│   ├── auth.js        # JWT verification
│   └── errorHandler.js # Global error handling
├── database/          # Database scripts
│   └── seed.js        # Demo data seeding
└── index.js           # Server entry point
```

### Key Design Patterns

#### 1. MVC Architecture
```
Request → Route → Middleware → Controller → Model → Database
                                    ↓
Response ← Format ← Business Logic ← Query Result
```

#### 2. Middleware Chain
```javascript
router.get('/assets', 
  authenticate,                    // JWT verification
  authorize('manager', 'technician'), // Role check
  assetController.list            // Handler
);
```

#### 3. Model Associations
```javascript
// Sequelize associations
User.belongsTo(Team);
Team.hasMany(User);
Asset.hasMany(MaintenanceRequest);
MaintenanceRequest.belongsTo(Asset);
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────┐          ┌──────┐          ┌────────┐
│  User   │ ─┬──────>│ Team │<──┬──────│ Asset  │
└─────────┘  │       └──────┘   │      └────────┘
     │       │                   │           │
     │       │                   │           │
     │   belongsTo           hasMany         │
     │                                        │
     ├────────────────────────────────────────┤
     │                                        │
     v                                        v
┌──────────────────────┐              ┌──────────────┐
│ MaintenanceRequest   │──────────────│   Comment    │
│ (work orders)        │   hasMany    │ (timeline)   │
└──────────────────────┘              └──────────────┘
```

### Table Definitions

#### Users
- **Columns:** id, name, email, password, role, phone, department, teamId, avatar, isActive
- **Roles:** employee, technician, manager
- **Relations:** belongsTo Team, hasMany MaintenanceRequests (as requester/assignee)

#### Teams
- **Columns:** id, name, specialization, description, color
- **Relations:** hasMany Users, hasMany Assets, hasMany MaintenanceRequests

#### Assets
- **Columns:** id, name, serialNumber, category, subCategory, department, status, teamId, purchaseDate, warrantyExpiry, description, imageUrl, location
- **Categories:** IT, Workshop
- **Status:** active, maintenance, scrapped
- **Relations:** belongsTo Team, hasMany MaintenanceRequests

#### MaintenanceRequests
- **Columns:** id, requestNumber, type, status, priority, description, assetId, requesterId, assignedToId, teamId, scheduledDate, dueDate, completedAt, duration, scrapReason, imageUrl, notes
- **Types:** corrective, preventive
- **Status:** new, in_progress, repaired, scrap
- **Priority:** low, medium, high, urgent
- **Relations:** belongsTo Asset, belongsTo Team, belongsTo User (requester), belongsTo User (assignee), hasMany Comments

#### Comments
- **Columns:** id, content, type, requestId, authorId
- **Types:** comment, status_change, assignment
- **Relations:** belongsTo MaintenanceRequest, belongsTo User

---

## Authentication Flow

### Demo Login Sequence
```
1. User clicks "Employee" on login page
2. Frontend: POST /api/auth/demo-login { role: 'employee' }
3. Backend: Find demo user for role
4. Backend: Generate JWT token
5. Backend: Return { token, user }
6. Frontend: Store in Zustand (persisted to localStorage)
7. Frontend: Redirect to role-specific dashboard
8. All subsequent requests include token in header
```

### JWT Token Structure
```json
{
  "userId": "uuid-here",
  "role": "employee",
  "iat": 1703696400,
  "exp": 1704301200
}
```

### Protected Route Flow
```
1. User navigates to protected page
2. React Router checks authentication
3. If not authenticated → redirect to /login
4. If authenticated but wrong role → redirect to /
5. API requests include token: Authorization: Bearer <token>
6. Backend middleware verifies token
7. Backend attaches user to req.user
8. Controller has access to current user
```

---

## Real-Time Communication

### Socket.io Architecture

#### Server-Side (Backend)
```javascript
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('join-room', (room) => {
    socket.join(room);
  });
  
  // Emit to specific room
  io.to('maintenance-requests').emit('request-updated', data);
});
```

#### Client-Side (Frontend)
```javascript
import { io } from 'socket.io-client';

const socket = io(SOCKET_URL);

socket.on('request-updated', (data) => {
  // Update UI in real-time
});
```

### Planned Real-Time Features (Phase 4)
- Kanban card updates across users
- New request notifications
- Assignment notifications
- Status change broadcasts

---

## API Design

### RESTful Endpoints

#### Authentication
```
POST   /api/auth/login          # Standard login
POST   /api/auth/demo-login     # Demo login by role
POST   /api/auth/register       # User registration
GET    /api/auth/profile        # Get current user
```

#### Assets (Phase 2)
```
GET    /api/assets              # List all assets
POST   /api/assets              # Create new asset
GET    /api/assets/:id          # Get asset details
PUT    /api/assets/:id          # Update asset
DELETE /api/assets/:id          # Delete asset
GET    /api/assets/:id/requests # Get asset's maintenance history
```

#### Teams (Phase 2)
```
GET    /api/teams               # List all teams
POST   /api/teams               # Create new team
GET    /api/teams/:id           # Get team details
PUT    /api/teams/:id           # Update team
DELETE /api/teams/:id           # Delete team
GET    /api/teams/:id/members   # Get team members
```

#### Maintenance (Phase 3)
```
GET    /api/maintenance         # List requests (with filters)
POST   /api/maintenance         # Create new request
GET    /api/maintenance/:id     # Get request details
PUT    /api/maintenance/:id     # Update request
DELETE /api/maintenance/:id     # Delete request
POST   /api/maintenance/:id/comments  # Add comment
PUT    /api/maintenance/:id/assign    # Assign technician
PUT    /api/maintenance/:id/status    # Update status
```

#### Dashboard (Phase 4)
```
GET    /api/dashboard/stats     # Overall statistics
GET    /api/dashboard/requests-by-team     # Chart data
GET    /api/dashboard/requests-by-category # Chart data
GET    /api/dashboard/recent-activity      # Activity feed
```

### Response Format
```json
// Success
{
  "data": { ... },
  "message": "Success"
}

// Error
{
  "error": "Error message",
  "details": [ ... ]
}
```

---

## Security Measures

### 1. Authentication
- JWT with 7-day expiration
- Password hashing with bcrypt (10 rounds)
- Secure token storage (httpOnly cookies in production)

### 2. Authorization
- Role-based access control (RBAC)
- Middleware checks on every protected route
- Frontend + Backend validation

### 3. Input Validation
- express-validator for request validation
- Sequelize model validation
- Type checking in frontend

### 4. SQL Injection Prevention
- Sequelize ORM (parameterized queries)
- No raw SQL queries
- Input sanitization

### 5. Security Headers
- Helmet.js for HTTP headers
- CORS configuration
- XSS protection

### 6. Environment Variables
- Sensitive data in .env
- Never committed to git
- Different configs for dev/prod

---

## Performance Optimizations

### Frontend
- Vite for fast HMR and optimized builds
- Code splitting (React.lazy for route-based)
- Lazy loading of components
- Debounced search inputs
- Memoization with useMemo/useCallback

### Backend
- Connection pooling (Sequelize)
- Database indexing on foreign keys
- Pagination for large lists
- Compression middleware
- Caching (to be implemented in Phase 4)

### Database
- Proper indexes on frequently queried columns
- Foreign key constraints
- Efficient joins via Sequelize includes

---

## Deployment Architecture (Planned)

### Frontend Deployment (Vercel/Netlify)
```
GitHub → Build Trigger → Vite Build → CDN Distribution
```

### Backend Deployment (Railway/Render)
```
GitHub → Container Build → Deploy → PostgreSQL Connection
```

### Environment Configuration
```
Development:
- Frontend: localhost:3000
- Backend: localhost:5000
- Database: localhost:5432

Production:
- Frontend: app.gearguard.com (CDN)
- Backend: api.gearguard.com (Load Balanced)
- Database: Managed PostgreSQL
```

---

## Error Handling Strategy

### Frontend
```javascript
try {
  const response = await api.get('/assets');
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Auto-logout
  } else {
    toast.error(error.response?.data?.error || 'Something went wrong');
  }
}
```

### Backend
```javascript
// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation failed' });
  }
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## Testing Strategy (Future Implementation)

### Unit Tests
- Model methods
- Controller logic
- Utility functions

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- Role-based scenarios
- Critical paths

---

## Scalability Considerations

### Current Architecture Supports:
- Horizontal scaling (stateless backend)
- Load balancing
- Database replication
- Caching layer (Redis ready)
- Microservices migration (if needed)

### Performance Targets:
- API response time: < 200ms
- Page load time: < 2s
- Concurrent users: 100+
- Database connections: Pool of 5-20

---

## Development Workflow

### Git Strategy (Recommended)
```
main           ← Production-ready code
  └── develop  ← Integration branch
       └── feature/asset-management
       └── feature/kanban-board
```

### Code Quality
- ESLint configuration
- Prettier for formatting
- Commit message conventions
- Pull request reviews

---

## Monitoring & Logging (Future)

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)

### Logging
- Morgan for HTTP logs
- Winston for application logs
- Log aggregation (ELK stack)

---

## Technology Choices Rationale

### Why React?
- Component-based architecture
- Rich ecosystem
- Strong community support
- Excellent developer experience

### Why Vite?
- Extremely fast HMR
- Optimized production builds
- Simple configuration
- Native ES modules

### Why TailwindCSS?
- Rapid UI development
- Consistent design system
- Small bundle size (purged)
- No CSS naming conflicts

### Why PostgreSQL?
- ACID compliance
- Robust relational model
- JSON support for flexibility
- Production-proven

### Why Sequelize?
- Mature ORM with good docs
- Type safety with migrations
- Association management
- Transaction support

### Why JWT?
- Stateless authentication
- Works across services
- Industry standard
- Easy to implement

---

## Conclusion

GearGuard's architecture is designed to be:
- **Scalable:** Can grow with increased load
- **Maintainable:** Clean separation of concerns
- **Secure:** Multiple layers of protection
- **Modern:** Uses current best practices
- **Performant:** Optimized at every layer

The architecture supports the project's evolution from a college demo to a production-ready application.

---

**Document Version:** 1.0
**Last Updated:** December 27, 2025
**Architecture Phase:** 1 of 5 Complete
