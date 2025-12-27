# ✅ Testing Checklist - GearGuard

## Pre-Testing Setup

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Firebase Firestore seeded with demo data
- [ ] Browser DevTools open (F12) for debugging
- [ ] Postman/Thunder Client ready for API testing

---

## 1. Authentication Tests

### Demo Login
- [ ] Click "Quick Demo Login"
- [ ] Select "Manager" role
- [ ] Should redirect to dashboard
- [ ] Check localStorage for auth token
- [ ] Verify user info appears in header/navbar

### Regular Login
- [ ] Navigate to login page
- [ ] Enter: `manager@gearguard.com` / `password123`
- [ ] Click "Login"
- [ ] Should redirect to dashboard
- [ ] Token stored in localStorage

### Registration (if enabled)
- [ ] Navigate to registration page
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] Verify new user created in Firestore
- [ ] Should redirect to login or dashboard

### Logout
- [ ] Click logout button
- [ ] Should redirect to login page
- [ ] Token removed from localStorage
- [ ] Protected routes inaccessible

### Token Expiration
- [ ] Login successfully
- [ ] Wait for token expiration (or manually expire in code)
- [ ] Try to access protected route
- [ ] Should redirect to login with error message

### Invalid Credentials
- [ ] Try login with wrong password
- [ ] Should show error message
- [ ] Should not redirect
- [ ] Token not created

---

## 2. Role-Based Access Control

### Manager Role Tests
Login as: `manager@gearguard.com` / `password123`

- [ ] Can view dashboard with all metrics
- [ ] Can view all assets
- [ ] Can create new asset
- [ ] Can edit any asset
- [ ] Can delete any asset
- [ ] Can view all maintenance requests
- [ ] Can create maintenance request
- [ ] Can assign requests to any user/team
- [ ] Can change any request status
- [ ] Can delete any request
- [ ] Can view all teams
- [ ] Can manage team members
- [ ] Can view all users

### Technician Role Tests
Login as: `tech@gearguard.com` / `password123`

- [ ] Can view dashboard (limited metrics)
- [ ] Can view assets (read-only)
- [ ] Cannot create/edit/delete assets
- [ ] Can view assigned maintenance requests
- [ ] Cannot view all requests (only assigned)
- [ ] Can create maintenance request
- [ ] Can update status of assigned requests
- [ ] Cannot assign requests
- [ ] Cannot delete requests
- [ ] Can view own team
- [ ] Cannot manage teams

### Team Lead Role Tests
Login as: `lead@gearguard.com` / `password123`

- [ ] Can view dashboard (team metrics)
- [ ] Can view assets (read-only)
- [ ] Can view team's maintenance requests
- [ ] Can assign requests to team members
- [ ] Can update request status
- [ ] Can view team members
- [ ] Cannot manage other teams

---

## 3. Dashboard Tests

### Metrics Display
- [ ] Total assets count correct
- [ ] Active requests count correct
- [ ] Pending requests count correct
- [ ] Completed this month count correct
- [ ] Average completion time calculated
- [ ] Response time calculated

### Recent Activity
- [ ] Shows last 5-10 activities
- [ ] Displays correct timestamps
- [ ] Shows correct user names
- [ ] Activities sorted by date (newest first)

### Charts/Graphs (if implemented)
- [ ] Request status chart displays
- [ ] Priority distribution shows
- [ ] Team performance metrics visible
- [ ] Data updates when filters change

### Filters
- [ ] Filter by date range
- [ ] Filter by team
- [ ] Filter by status
- [ ] Filters apply correctly
- [ ] Reset filters works

---

## 4. Assets Tests

### View Assets
- [ ] All assets listed
- [ ] Asset cards show correct info
- [ ] Pagination works (if implemented)
- [ ] Search assets by name
- [ ] Filter by category
- [ ] Filter by status
- [ ] Sort by name/date/status

### Create Asset (Manager Only)
- [ ] Click "Add Asset" button
- [ ] Fill in all fields:
  - Name: "Test Boiler"
  - Category: "HVAC"
  - Location: "Building A - Basement"
  - Status: "operational"
  - Purchase Date: "2024-01-15"
  - Warranty: "2 years"
  - Team: Select from dropdown
- [ ] Submit form
- [ ] Asset appears in list
- [ ] Verify in Firestore Console

### Edit Asset (Manager Only)
- [ ] Click edit on an asset
- [ ] Update name to "Updated Test Boiler"
- [ ] Change status to "under_maintenance"
- [ ] Save changes
- [ ] Changes reflected in list
- [ ] Verify in Firestore

### Delete Asset (Manager Only)
- [ ] Click delete on test asset
- [ ] Confirm deletion in modal
- [ ] Asset removed from list
- [ ] Verify deleted in Firestore

### Asset Details
- [ ] Click on asset card
- [ ] View full asset details
- [ ] See maintenance history
- [ ] View assigned team
- [ ] See specifications
- [ ] QR code displayed (if implemented)

---

## 5. Maintenance Request Tests

### View Requests
- [ ] All requests listed
- [ ] Request cards show:
  - Request number
  - Asset name
  - Status badge
  - Priority indicator
  - Assigned user
  - Due date
- [ ] Filter by status (pending/in_progress/completed)
- [ ] Filter by priority (low/medium/high/urgent)
- [ ] Sort by date/priority/status

### Create Request
- [ ] Click "Create Request"
- [ ] Fill in form:
  - Select asset
  - Title: "AC unit not cooling"
  - Description: "Temperature not dropping below 75°F"
  - Priority: "High"
  - Due date: Tomorrow's date
- [ ] Submit form
- [ ] Request appears in list
- [ ] Status should be "pending"
- [ ] Request number auto-generated (e.g., REQ-00006)

### Assign Request (Manager/Team Lead)
- [ ] Open pending request
- [ ] Click "Assign"
- [ ] Select user from dropdown
- [ ] OR select team from dropdown
- [ ] Submit assignment
- [ ] Assigned user's name appears on card
- [ ] Status can change to "in_progress"
- [ ] Assigned user receives notification (check Socket.io)

### Update Status
- [ ] Open request
- [ ] Click "Update Status"
- [ ] Change from "pending" to "in_progress"
- [ ] Add optional comment
- [ ] Submit
- [ ] Status badge updates
- [ ] Activity log shows status change
- [ ] Real-time update in other browser (if open)

### Add Comment
- [ ] Open request details
- [ ] Scroll to comments section
- [ ] Type comment: "Working on this now"
- [ ] Submit
- [ ] Comment appears immediately
- [ ] Author name and timestamp shown
- [ ] Comment saved in Firestore

### Complete Request
- [ ] Open in-progress request
- [ ] Update status to "completed"
- [ ] Enter actual hours: "2.5"
- [ ] Enter cost: "150"
- [ ] Add completion notes
- [ ] Submit
- [ ] Status changes to "completed"
- [ ] Completion time recorded
- [ ] Request moves to completed section

### Delete Request (Manager Only)
- [ ] Select test request
- [ ] Click delete
- [ ] Confirm deletion
- [ ] Request removed
- [ ] Verify in Firestore

---

## 6. Teams Tests

### View Teams
- [ ] Navigate to Teams page
- [ ] All 4 teams displayed:
  - IT Support Team
  - Facilities Team
  - Electrical Team
  - General Maintenance
- [ ] Team cards show:
  - Team name
  - Specialization
  - Number of members
  - Team lead (if assigned)

### View Team Details
- [ ] Click on a team card
- [ ] See team information
- [ ] List of team members displayed
- [ ] Active requests for team shown
- [ ] Team performance metrics (if implemented)

### Create Team (Manager Only)
- [ ] Click "Add Team"
- [ ] Fill in:
  - Name: "HVAC Specialists"
  - Specialization: "Heating and Cooling"
  - Description: "Expert HVAC maintenance"
- [ ] Submit
- [ ] Team appears in list
- [ ] Verify in Firestore

### Edit Team (Manager Only)
- [ ] Click edit on test team
- [ ] Update description
- [ ] Change team lead
- [ ] Save changes
- [ ] Updates reflected

### Delete Team (Manager Only)
- [ ] Click delete on test team
- [ ] Confirm deletion
- [ ] Team removed
- [ ] Check users are not deleted (just unassigned)

---

## 7. Real-Time Features (Socket.io)

### Setup for Real-Time Tests
1. Open app in Chrome: `http://localhost:3000`
2. Login as Manager
3. Open app in Firefox: `http://localhost:3000`
4. Login as Technician

### Test Comment Real-Time Update
- [ ] Both browsers: Open same maintenance request
- [ ] Manager browser: Add comment "Test real-time"
- [ ] Technician browser: Comment appears WITHOUT refresh
- [ ] Check browser console for Socket events

### Test Status Update Real-Time
- [ ] Both browsers: View same request
- [ ] Manager browser: Change status to "in_progress"
- [ ] Technician browser: Status badge updates instantly
- [ ] Activity log updates in both browsers

### Test Assignment Notification
- [ ] Manager browser: Assign request to technician
- [ ] Technician browser: Notification appears
- [ ] Request appears in technician's assigned list

### Socket Connection
- [ ] Open browser DevTools → Console
- [ ] Look for: "Socket connected"
- [ ] Disconnect internet temporarily
- [ ] Should show: "Socket disconnected"
- [ ] Reconnect internet
- [ ] Should show: "Socket reconnected"

---

## 8. API Endpoint Tests (Postman/cURL)

### Test Authentication Endpoint
```bash
# Demo Login
curl -X POST http://localhost:5000/api/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"role": "manager"}'

# Should return: { "success": true, "token": "...", "user": {...} }
```

### Test Protected Endpoint
```bash
# Get Assets (requires token)
curl http://localhost:5000/api/assets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return array of assets
```

### Test Invalid Token
```bash
curl http://localhost:5000/api/assets \
  -H "Authorization: Bearer invalid_token"

# Should return: 401 Unauthorized
```

### Test CORS
```bash
# From different origin
curl -X OPTIONS http://localhost:5000/api/assets \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"

# Should return CORS headers
```

---

## 9. Error Handling Tests

### Network Errors
- [ ] Stop backend server
- [ ] Try to login from frontend
- [ ] Should show "Network Error" or "Cannot connect to server"
- [ ] Error message user-friendly

### Validation Errors
- [ ] Try to create asset with empty name
- [ ] Should show "Name is required"
- [ ] Try invalid email format
- [ ] Should show "Invalid email"

### 404 Errors
- [ ] Navigate to `/nonexistent-page`
- [ ] Should show 404 page or redirect
- [ ] Try to access deleted resource
- [ ] Should show appropriate error

### 500 Server Errors
- [ ] Cause server error (e.g., invalid Firebase query)
- [ ] Check error is caught
- [ ] User sees friendly message, not stack trace
- [ ] Error logged in backend console

---

## 10. UI/UX Tests

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Sidebar collapses on mobile
- [ ] Tables become scrollable
- [ ] Forms stack vertically

### Loading States
- [ ] Spinner shows when loading data
- [ ] Skeleton loaders for cards (if implemented)
- [ ] Buttons disabled during submission
- [ ] "Loading..." text appears

### Form Validation
- [ ] Required fields marked with *
- [ ] Error messages appear below fields
- [ ] Fields highlighted in red on error
- [ ] Success messages green
- [ ] Form clears after successful submit

### Accessibility
- [ ] Tab through form fields (keyboard navigation)
- [ ] Focus indicators visible
- [ ] Buttons have aria-labels
- [ ] Color contrast sufficient
- [ ] Alt text on images

---

## 11. Performance Tests

### Page Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] Assets page loads in < 2 seconds
- [ ] Maintenance requests load in < 2 seconds

### API Response Time
- [ ] Login responds in < 500ms
- [ ] Get assets responds in < 1 second
- [ ] Create request responds in < 1 second

### Real-Time Latency
- [ ] Comment appears in < 500ms
- [ ] Status update reflects in < 500ms

### Bundle Size
```bash
cd gearguard-frontend
npm run build

# Check dist/ folder size
# Should be < 500KB for main bundle
```

---

## 12. Security Tests

### XSS Protection
- [ ] Try to inject script in comment: `<script>alert('XSS')</script>`
- [ ] Script should be escaped/sanitized
- [ ] Alert should NOT execute

### SQL Injection (Firestore)
- [ ] Try: email: `admin'--` in login
- [ ] Should fail safely
- [ ] No database error exposed

### JWT Token
- [ ] Token expires after 7 days
- [ ] Invalid token rejected
- [ ] Modified token rejected
- [ ] Token includes user id and role

### Password Security
- [ ] Passwords hashed in Firestore (not plain text)
- [ ] Minimum length enforced (8 chars)
- [ ] Password not returned in API responses

---

## 13. Firebase-Specific Tests

### Firestore Console Verification
- [ ] Open Firebase Console → Firestore
- [ ] Verify collections exist:
  - users
  - teams
  - assets
  - maintenanceRequests
  - comments
- [ ] Check document structure matches schema
- [ ] Timestamps are Firestore Timestamp objects

### Security Rules Testing
1. Go to Firebase Console → Firestore → Rules → Playground
2. Test rules:
   - [ ] Unauthenticated read → Denied
   - [ ] Authenticated read → Allowed
   - [ ] Manager write to assets → Allowed
   - [ ] Technician write to assets → Denied

### Data Consistency
- [ ] Create request
- [ ] Verify assetId reference is valid
- [ ] Check assignedToId matches existing user
- [ ] Denormalized fields (names) match source

---

## 14. Edge Cases

### Empty States
- [ ] No assets → Show "No assets found" message
- [ ] No requests → Show "No maintenance requests"
- [ ] No comments → Show "No comments yet"

### Long Text
- [ ] Asset name with 100+ characters
- [ ] Description with 1000+ characters
- [ ] Check text truncation
- [ ] "Read more" link works

### Special Characters
- [ ] Asset name: "AC Unit #2 (Building-A)"
- [ ] Should save and display correctly
- [ ] No encoding issues

### Concurrent Updates
- [ ] User A and User B edit same request
- [ ] Both submit
- [ ] Last write wins (or handle conflict)
- [ ] No data corruption

---

## 15. Browser Compatibility

Test in multiple browsers:

### Chrome
- [ ] All features work
- [ ] DevTools show no errors
- [ ] Real-time updates work

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Socket.io connects

### Safari
- [ ] All features work
- [ ] Date pickers work
- [ ] No webkit-specific issues

### Edge
- [ ] All features work
- [ ] No compatibility warnings

---

## Testing Summary

### Critical Tests (Must Pass)
- ✅ Authentication and authorization
- ✅ Create/Read/Update/Delete operations
- ✅ Real-time updates
- ✅ Role-based access control

### Important Tests (Should Pass)
- ✅ Error handling
- ✅ Responsive design
- ✅ Performance
- ✅ Security

### Nice to Have Tests (Optional)
- ✅ Edge cases
- ✅ Browser compatibility
- ✅ Accessibility

---

## Bug Reporting Template

When you find a bug, document:

```markdown
### Bug Title
Clear, concise description

### Steps to Reproduce
1. Navigate to...
2. Click on...
3. Enter...
4. Submit

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Screenshots
[Attach if applicable]

### Environment
- Browser: Chrome 120
- OS: Windows 11
- Screen: 1920x1080

### Console Errors
```
[Paste any console errors]
```

### Priority
- [ ] Critical (blocks major features)
- [ ] High (affects important features)
- [ ] Medium (minor inconvenience)
- [ ] Low (cosmetic issue)
```

---

## Post-Testing Checklist

After all tests pass:

- [ ] Document any known issues
- [ ] Create bug tickets for failures
- [ ] Update test cases with new features
- [ ] Run tests again after bug fixes
- [ ] Get sign-off from stakeholders
- [ ] Ready for deployment! 🚀

---

## Automated Testing (Future)

Consider implementing:

### Unit Tests
```javascript
// Example: Test user creation
test('should create user with hashed password', async () => {
  const user = await createUser({
    email: 'test@test.com',
    password: 'password123'
  });
  expect(user.password).not.toBe('password123');
  expect(user.password).toContain('$2b$');
});
```

### Integration Tests
- Test API endpoints end-to-end
- Mock Firebase in tests
- Use Jest + Supertest

### E2E Tests
- Cypress or Playwright
- Automate user flows
- Run before deployment

---

Good luck with testing! 🧪✅
