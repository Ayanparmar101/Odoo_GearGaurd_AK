import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Wrench, Mail, Lock, User } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email: formData.email });
      const data = await authService.login(formData.email, formData.password);
      console.log('Login successful:', data);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Login Card */}
        <div className="card p-8">
          {!showDemoOptions ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Sign In
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDemoOptions(true)}
                  className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Try Demo Mode
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Demo Login
                </h2>
                <button
                  onClick={() => setShowDemoOptions(false)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  ← Back to Login
                </button>
              </div>

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
          </>
          )}
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
