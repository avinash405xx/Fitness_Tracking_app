import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardDark from '../Dashboard/DashboardDark';
import WorkoutDetail from '../Workout/WorkoutDetail';
import WorkoutTimer from '../Workout/WorkoutTimer';
import BottomNav from '../Navigation/BottomNav';

type Screen = 'dashboard' | 'workout-detail' | 'workout-timer';
type NavItem = 'home' | 'saved' | 'browse' | 'profile';

export default function AppModern() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [activeNav, setActiveNav] = useState<NavItem>('home');

  const workout = {
    name: 'Squats with a jump',
    duration: 3,
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800',
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardDark onWorkoutClick={() => setCurrentScreen('workout-detail')} />;
      case 'workout-detail':
        return (
          <WorkoutDetail
            onBack={() => setCurrentScreen('dashboard')}
            onStartWorkout={() => setCurrentScreen('workout-timer')}
          />
        );
      case 'workout-timer':
        return (
          <WorkoutTimer workout={workout} onBack={() => setCurrentScreen('workout-detail')} />
        );
      default:
        return <DashboardDark onWorkoutClick={() => setCurrentScreen('workout-detail')} />;
    }
  };

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

      {currentScreen === 'dashboard' && (
        <BottomNav active={activeNav} onSelect={setActiveNav} />
      )}
    </div>
  );
}
