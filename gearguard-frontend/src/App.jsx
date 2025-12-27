import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import EmployeeDashboard from './pages/employee/Dashboard';
import TechnicianDashboard from './pages/technician/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AssetList from './pages/AssetList';
import AssetDetail from './pages/AssetDetail';
import AssetForm from './pages/AssetForm';
import TeamList from './pages/TeamList';
import TeamDetail from './pages/TeamDetail';
import TeamForm from './pages/TeamForm';
import CreateRequest from './pages/CreateRequest';
import MyRequests from './pages/MyRequests';
import MyTasks from './pages/MyTasks';
import Maintenance from './pages/Maintenance';
import KanbanBoard from './pages/KanbanBoard';
import RequestDetail from './pages/RequestDetail';
import Calendar from './pages/Calendar';
import TeamSchedule from './pages/TeamSchedule';
import Analytics from './pages/Analytics';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserDetail from './pages/UserDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  const getDashboard = () => {
    switch (user?.role) {
      case 'employee':
        return <EmployeeDashboard />;
      case 'technician':
        return <TechnicianDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={getDashboard()} />
          
          {/* Asset Management Routes */}
          <Route path="assets" element={<AssetList />} />
          <Route path="assets/new" element={<AssetForm />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="assets/:id/edit" element={<AssetForm />} />
          
          {/* Team Management Routes */}
          <Route path="teams" element={<TeamList />} />
          <Route path="teams/new" element={<TeamForm />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="teams/:id/edit" element={<TeamForm />} />
          
          {/* Maintenance Request Routes */}
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="maintenance-requests/:id" element={<RequestDetail />} />
          
          {/* Calendar & Scheduling Routes */}
          <Route path="calendar" element={<Calendar />} />
          <Route path="teams/:teamId/schedule" element={<TeamSchedule />} />
          
          {/* Analytics Route */}
          <Route path="analytics" element={<Analytics />} />
          
          {/* User Management Routes */}
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/:id/edit" element={<UserForm />} />
          
          {/* Settings Route */}
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
