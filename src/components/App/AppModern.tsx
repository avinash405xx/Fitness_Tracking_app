import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardModern from '../Dashboard/DashboardModern';
import WorkoutDetail from '../Workout/WorkoutDetail';
import WorkoutTimer from '../Workout/WorkoutTimer';
import WorkoutsList from '../Workouts/WorkoutsList';
import Goals from '../Goals/Goals';
import Profile from '../Profile/Profile';
import DrinkingTracker from '../Tracker/DrinkingTracker';
import SleepTracker from '../Tracker/SleepTracker';
import BottomNav from '../Navigation/BottomNav';

type Screen = 'dashboard' | 'workout-detail' | 'workout-timer' | 'workouts' | 'goals' | 'profile' | 'drinking-tracker' | 'sleep-tracker' | 'daily-exercise';
type NavItem = 'home' | 'saved' | 'browse' | 'profile';

interface AppModernProps {
  onLogout: () => void;
}

export default function AppModern({ onLogout }: AppModernProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [activeNav, setActiveNav] = useState<NavItem>('home');

  const workout = {
    name: 'Squats with a jump',
    duration: 3,
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800',
  };

  const handleNavSelect = (nav: NavItem) => {
    setActiveNav(nav);
    switch (nav) {
      case 'home':
        setCurrentScreen('dashboard');
        break;
      case 'saved':
        setCurrentScreen('goals');
        break;
      case 'browse':
        setCurrentScreen('workouts');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleNavigate = (page: string) => {
    const pageMap: { [key: string]: Screen } = {
      'drinking tracker': 'drinking-tracker',
      'daily exercise': 'daily-exercise',
      'sleep tracker': 'sleep-tracker',
    };

    const screen = pageMap[page.toLowerCase()] || 'dashboard';
    if (screen === 'daily-exercise') {
      setCurrentScreen('workout-detail');
    } else {
      setCurrentScreen(screen);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardModern onNavigate={handleNavigate} />;
      case 'drinking-tracker':
        return <DrinkingTracker onBack={() => setCurrentScreen('dashboard')} />;
      case 'sleep-tracker':
        return <SleepTracker onBack={() => setCurrentScreen('dashboard')} />;
      case 'workouts':
        return <WorkoutsList onWorkoutClick={() => setCurrentScreen('workout-detail')} />;
      case 'goals':
        return <Goals />;
      case 'profile':
        return <Profile onLogout={onLogout} />;
      case 'workout-detail':
        return (
          <WorkoutDetail
            onBack={() => setCurrentScreen(activeNav === 'browse' ? 'workouts' : 'dashboard')}
            onStartWorkout={() => setCurrentScreen('workout-timer')}
          />
        );
      case 'workout-timer':
        return (
          <WorkoutTimer workout={workout} onBack={() => setCurrentScreen('workout-detail')} />
        );
      default:
        return <DashboardModern onNavigate={handleNavigate} />;
    }
  };

  const showBottomNav = !['workout-detail', 'workout-timer', 'drinking-tracker', 'sleep-tracker'].includes(currentScreen);

  return (
    <div className="relative min-h-screen bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {showBottomNav && (
        <BottomNav active={activeNav} onSelect={handleNavSelect} />
      )}
    </div>
  );
}
