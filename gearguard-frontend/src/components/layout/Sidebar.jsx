import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Wrench,
  Package,
  Users,
  Calendar,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const getMenuItems = () => {
    const commonItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    switch (user?.role) {
      case 'employee':
        return [
          ...commonItems,
          { icon: FileText, label: 'My Requests', path: '/my-requests' },
          { icon: Wrench, label: 'Create Request', path: '/create-request' },
        ];
      case 'technician':
        return [
          ...commonItems,
          { icon: Wrench, label: 'Kanban Board', path: '/kanban' },
          { icon: FileText, label: 'My Tasks', path: '/my-tasks' },
          { icon: Calendar, label: 'Calendar', path: '/calendar' },
        ];
      case 'manager':
        return [
          ...commonItems,
          { icon: Package, label: 'Assets', path: '/assets' },
          { icon: Users, label: 'Teams', path: '/teams' },
          { icon: Wrench, label: 'Maintenance', path: '/maintenance' },
          { icon: Calendar, label: 'Calendar', path: '/calendar' },
          { icon: BarChart3, label: 'Analytics', path: '/analytics' },
          { icon: Users, label: 'Users', path: '/users' },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">GearGuard</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                    title={collapsed ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-600">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
