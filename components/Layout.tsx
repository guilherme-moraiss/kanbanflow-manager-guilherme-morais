import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LogOut, Users, Layout as LayoutIcon, Settings, Menu, Bell, ClipboardList } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Direct logout for better UX/Reliability
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
             <LayoutIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">KanbanFlow</h1>
            <span className="text-xs text-slate-400 block -mt-1">Project Manager</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          
          <button
              type="button"
              onClick={() => onNavigate('tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === 'tasks' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutIcon className={`w-5 h-5 ${activeTab === 'tasks' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium">Task Board</span>
            </button>

          <button
              type="button"
              onClick={() => onNavigate('project')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === 'project' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ClipboardList className={`w-5 h-5 ${activeTab === 'project' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium">Project Management</span>
            </button>

          {user?.role === UserRole.MANAGER && (
            <>
            <div className="mt-6 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Admin
            </div>
            <button
              type="button"
              onClick={() => onNavigate('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === 'users' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'users' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium">User Management</span>
            </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
                {user?.avatarUrl ? (
                    <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full border border-white/10"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner border border-white/10">
                        {user?.name.charAt(0)}
                    </div>
                )}
                <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate capitalize flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${user?.role === UserRole.MANAGER ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                    {user?.role.toLowerCase()}
                </p>
                </div>
            </div>
            <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm border border-transparent hover:border-red-900/50"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'users' ? 'Team Management' : activeTab === 'project' ? 'Project Management' : 'Task Board'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
                {activeTab === 'users' 
                  ? 'Manage your development team and roles' 
                  : activeTab === 'project'
                  ? 'Track sprints and project progress'
                  : 'Track and organize tasks efficiently'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="h-8 w-px bg-slate-200 mx-1"></div>
             <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;