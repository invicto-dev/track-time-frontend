import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Clock, 
  Users, 
  FileText, 
  Settings, 
  Home,
  Calendar,
  BarChart3,
  UserCheck,
  LogOut
} from 'lucide-react';
import { useEffect } from 'react';
import { useSidebar } from '../contexts/SideBarContext';

const employeeNavItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Calendar, label: 'Histórico', href: '/history' },
  { icon: FileText, label: 'Justificativas', href: '/justifications' },
];

const adminNavItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Funcionários', href: '/admin/employees' },
  { icon: BarChart3, label: 'Relatórios', href: '/admin/reports' },
  { icon: UserCheck, label: 'Aprovações', href: '/admin/approvals' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const location = useLocation();
  const navItems = user?.role === 'ADMIN' ? adminNavItems : employeeNavItems;

  // Fecha a sidebar quando a rota muda (para mobile)
  useEffect(() => {
    close();
  }, [location.pathname]);

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50
        w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">TimeTracker</h1>
              <p className="text-xs sm:text-sm text-gray-500">Control de Ponto</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 sm:py-6">
          <ul className="space-y-1 sm:space-y-2 px-3 sm:px-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 sm:py-3 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}