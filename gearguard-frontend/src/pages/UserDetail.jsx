import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Shield, Users, Calendar, Edit, UserX, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      toast.success('User deactivated successfully');
      navigate('/users');
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'technician': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'manager': return <Shield className="w-5 h-5" />;
      case 'technician': return <Users className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mt-1">User Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/users/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          {user.isActive !== false && (
            <button
              onClick={handleDeactivate}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <UserX className="w-4 h-4" />
              Deactivate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.team && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="font-medium text-gray-900">{user.team.name}</p>
                    {user.team.specialty && (
                      <p className="text-sm text-gray-500">{user.team.specialty}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Role Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Role & Permissions</h2>
            <div className="space-y-3">
              {user.role === 'manager' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Manager Permissions</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Full access to all assets and teams</li>
                    <li>• Create and manage maintenance requests</li>
                    <li>• Assign work to technicians</li>
                    <li>• View analytics and reports</li>
                    <li>• Manage users and system settings</li>
                  </ul>
                </div>
              )}
              {user.role === 'technician' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Technician Permissions</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• View assigned maintenance requests</li>
                    <li>• Update request status and progress</li>
                    <li>• Add comments and completion notes</li>
                    <li>• Access Kanban board</li>
                    <li>• View team schedule</li>
                  </ul>
                </div>
              )}
              {user.role === 'employee' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Employee Permissions</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Create maintenance requests</li>
                    <li>• View own requests</li>
                    <li>• Add comments to requests</li>
                    <li>• Track request status</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                {user.isActive !== false ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    <UserX className="w-4 h-4" />
                    Inactive
                  </span>
                )}
              </div>
              {user.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/users/${id}/edit`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
              >
                Edit Profile
              </button>
              {user.teamId && (
                <button
                  onClick={() => navigate(`/teams/${user.teamId}`)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
                >
                  View Team
                </button>
              )}
              <button
                onClick={() => navigate('/users')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
              >
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
