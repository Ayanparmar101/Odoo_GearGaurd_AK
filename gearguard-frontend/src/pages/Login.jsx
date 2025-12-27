import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Wrench } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(true);

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      const data = await authService.demoLogin(role);
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GearGuard</h1>
          <p className="text-gray-600">Maintenance Management System</p>
        </div>

        {/* Demo Login Card */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Demo Login
          </h2>

          <div className="space-y-3">
            {/* Employee Demo */}
            <button
              onClick={() => handleDemoLogin('employee')}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">👤</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Employee</p>
                  <p className="text-sm text-gray-500">Create & track requests</p>
                </div>
              </div>
              <div className="text-primary-600">→</div>
            </button>

            {/* Technician Demo */}
            <button
              onClick={() => handleDemoLogin('technician')}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Wrench className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Technician</p>
                  <p className="text-sm text-gray-500">Execute maintenance tasks</p>
                </div>
              </div>
              <div className="text-primary-600">→</div>
            </button>

            {/* Manager Demo */}
            <button
              onClick={() => handleDemoLogin('manager')}
              disabled={loading}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">👔</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Manager</p>
                  <p className="text-sm text-gray-500">Oversee operations & analytics</p>
                </div>
              </div>
              <div className="text-primary-600">→</div>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              For demo purposes. No password required.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>College Project - Hackathon Submission</p>
          <p className="mt-1">© 2025 GearGuard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
