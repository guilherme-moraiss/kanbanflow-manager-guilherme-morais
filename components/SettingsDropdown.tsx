import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Moon, Sun, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </h3>
          </div>

          <div className="p-2">
            <div className="px-3 py-2 mb-2">
              <div className="flex items-center gap-3 mb-2">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-800 text-sm">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.username}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 my-2"></div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-slate-600" />}
                <span className="text-sm text-slate-700">Dark Mode</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Notification Sounds</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors ${soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </button>

            <div className="border-t border-slate-100 my-2"></div>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left">
              <Shield className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">Privacy & Security</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors text-left">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">Help & Support</span>
            </button>

            <div className="border-t border-slate-100 my-2"></div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors text-left text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;

