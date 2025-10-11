import { useState } from 'react';
import { Home, Dumbbell, Apple, Target, TrendingUp, Award, LogOut } from 'lucide-react';
import Overview from './Overview';
import Workouts from '../Workouts/Workouts';
import Meals from '../Meals/Meals';
import Goals from '../Goals/Goals';
import Progress from '../Progress/Progress';
import QuickLogButton from '../QuickLog/QuickLogButton';
import Avatar from '../shared/Avatar';
import { useAuth } from '../../contexts/AuthContext';

type View = 'overview' | 'workouts' | 'meals' | 'goals' | 'progress';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const { profile } = useAuth();

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'workouts':
        return <Workouts />;
      case 'meals':
        return <Meals />;
      case 'goals':
        return <Goals />;
      case 'progress':
        return <Progress />;
      default:
        return <Overview />;
    }
  };

  const navItems = [
    { id: 'overview' as View, icon: Home, label: 'Overview' },
    { id: 'workouts' as View, icon: Dumbbell, label: 'Workouts' },
    { id: 'meals' as View, icon: Apple, label: 'Meals' },
    { id: 'goals' as View, icon: Target, label: 'Goals' },
    { id: 'progress' as View, icon: TrendingUp, label: 'Progress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">FitTrack</span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      currentView === item.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <Avatar src={profile?.avatar_url} name={profile?.name} size="md" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {renderContent()}
      </main>

      <QuickLogButton />
    </div>
  );
}
