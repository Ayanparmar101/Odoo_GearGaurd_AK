import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import EmployeeDashboard from './pages/employee/Dashboard';
import TechnicianDashboard from './pages/technician/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
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
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={getDashboard()} />
          {/* Additional routes will be added in subsequent phases */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
