import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Save, Database } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    emailNotifications: true,
    pushNotifications: false,
    maintenanceAlerts: true,
    overdueAlerts: true,
    assignmentAlerts: true,
    
    // Display settings
    theme: 'light',
    compactMode: false,
    showCompletedRequests: true,
    defaultView: 'kanban',
    
    // System settings
    autoRefresh: true,
    refreshInterval: 30,
    defaultPriority: 'medium',
    defaultRequestType: 'corrective'
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <p className="text-gray-600 mb-6">Your basic account information</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact your administrator to change your name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact your administrator to change your email
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role?.toUpperCase() || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                  <p className="text-gray-600 mb-6">Choose what notifications you want to receive</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive browser push notifications</p>
                    </div>
                    <button
                      onClick={() => handleToggle('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Alerts</p>
                      <p className="text-sm text-gray-500">Alerts for new maintenance requests</p>
                    </div>
                    <button
                      onClick={() => handleToggle('maintenanceAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.maintenanceAlerts ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.maintenanceAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Overdue Alerts</p>
                      <p className="text-sm text-gray-500">Notifications for overdue tasks</p>
                    </div>
                    <button
                      onClick={() => handleToggle('overdueAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.overdueAlerts ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.overdueAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Assignment Alerts</p>
                      <p className="text-sm text-gray-500">Alerts when assigned to tasks</p>
                    </div>
                    <button
                      onClick={() => handleToggle('assignmentAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.assignmentAlerts ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.assignmentAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                  <p className="text-gray-600 mb-6">Customize how GearGuard looks for you</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark (Coming soon)</option>
                      <option value="auto">Auto (Coming soon)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Compact Mode</p>
                      <p className="text-sm text-gray-500">Reduce spacing for denser layout</p>
                    </div>
                    <button
                      onClick={() => handleToggle('compactMode')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.compactMode ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Show Completed Requests</p>
                      <p className="text-sm text-gray-500">Display completed items in lists</p>
                    </div>
                    <button
                      onClick={() => handleToggle('showCompletedRequests')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.showCompletedRequests ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.showCompletedRequests ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">System Settings</h2>
                  <p className="text-gray-600 mb-6">Configure system behavior and defaults</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Auto Refresh</p>
                      <p className="text-sm text-gray-500">Automatically refresh data</p>
                    </div>
                    <button
                      onClick={() => handleToggle('autoRefresh')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.autoRefresh && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Refresh Interval (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.refreshInterval}
                        onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                        min="10"
                        max="300"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Priority
                    </label>
                    <select
                      value={settings.defaultPriority}
                      onChange={(e) => handleChange('defaultPriority', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Request Type
                    </label>
                    <select
                      value={settings.defaultRequestType}
                      onChange={(e) => handleChange('defaultRequestType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="corrective">Corrective</option>
                      <option value="preventive">Preventive</option>
                      <option value="inspection">Inspection</option>
                      <option value="upgrade">Upgrade</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
