import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, ClipboardList, User, LogOut } from 'lucide-react';
import DashboardMinimal from './DashboardMinimal';
import GoalsMinimal from '../Goals/GoalsMinimal';
import Logs from '../Logs/Logs';

type Tab = 'dashboard' | 'goals' | 'logs';

export default function DashboardMain() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const tabs = [
    { id: 'dashboard' as Tab, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'goals' as Tab, icon: Target, label: 'Goals' },
    { id: 'logs' as Tab, icon: ClipboardList, label: 'Logs' },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardMinimal />;
      case 'goals':
        return <GoalsMinimal />;
      case 'logs':
        return <Logs />;
      default:
        return <DashboardMinimal />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                FitTrack
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-xl flex items-center space-x-2 transition-all font-medium ${
                      currentTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden bg-white/80 backdrop-blur-md border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
        <div className="grid grid-cols-3 gap-2 p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                  currentTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
