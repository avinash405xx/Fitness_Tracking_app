import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Target, Dumbbell, User, TrendingUp, Flame, Plus } from 'lucide-react';

type Screen = 'dashboard' | 'workouts' | 'goals' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  const weeklySteps = [
    { day: 'Mon', steps: 3200 },
    { day: 'Tue', steps: 4100 },
    { day: 'Wed', steps: 3800 },
    { day: 'Thu', steps: 4325 },
    { day: 'Fri', steps: 3900 },
    { day: 'Sat', steps: 4200 },
    { day: 'Sun', steps: 0 },
  ];

  const maxSteps = Math.max(...weeklySteps.map((d) => d.steps));

  const DashboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-teal-200" />
              <span className="text-white/80 text-sm">Steps</span>
            </div>
            <span className="text-white/80 text-sm">This week</span>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-white mb-1">
              4,325
              <span className="text-lg text-white/70 ml-2">steps</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-32">
            {weeklySteps.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ height: 0 }}
                animate={{ height: `${(item.steps / maxSteps) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-8 rounded-lg mb-2 ${
                    item.steps === maxSteps
                      ? 'bg-gradient-to-t from-green-400 to-green-300'
                      : 'bg-white/30'
                  }`}
                  style={{ height: `${(item.steps / maxSteps) * 100}%` }}
                />
                <span className="text-xs text-white/70">{item.day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-300" />
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-white/70 text-xs mb-1">Calories</p>
            <p className="text-2xl font-bold text-white">
              1,243 <span className="text-sm text-white/70">kcal</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-400/30 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-teal-200" />
              </div>
              <span className="text-2xl">💪</span>
            </div>
            <p className="text-white/70 text-xs mb-1">Workouts</p>
            <p className="text-2xl font-bold text-white">
              12 <span className="text-sm text-white/70">this week</span>
            </p>
          </motion.div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Training Workouts</h2>
          <div className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-teal-600 to-green-700 rounded-3xl p-4 flex items-center space-x-4"
            >
              <img
                src="https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Strength Training"
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <span className="text-xs bg-green-400/30 text-white px-3 py-1 rounded-full">
                  Challenge
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Strength Training</h3>
                <div className="flex items-center space-x-4 mt-2 text-white/90">
                  <span className="text-sm">🔥 245 kcal</span>
                  <span className="text-sm">⏱ 30 min</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-600 to-teal-700 rounded-3xl p-4 flex items-center space-x-4"
            >
              <img
                src="https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Cardio Blast"
                className="w-20 h-20 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <span className="text-xs bg-teal-400/30 text-white px-3 py-1 rounded-full">
                  Popular
                </span>
                <h3 className="text-lg font-bold text-white mt-2">Cardio Blast</h3>
                <div className="flex items-center space-x-4 mt-2 text-white/90">
                  <span className="text-sm">🔥 320 kcal</span>
                  <span className="text-sm">⏱ 25 min</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkoutsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-3xl font-bold text-white mb-8">Workouts</h1>
        <div className="space-y-4">
          {[
            { name: 'Full Body Workout', duration: '45 min', calories: 380, image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'HIIT Cardio', duration: '20 min', calories: 290, image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'Yoga Flow', duration: '30 min', calories: 150, image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'Core Strength', duration: '15 min', calories: 120, image: 'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=300' },
          ].map((workout, index) => (
            <motion.div
              key={workout.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center space-x-4"
            >
              <img src={workout.image} alt={workout.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                <div className="flex items-center space-x-3 mt-1 text-white/80 text-sm">
                  <span>⏱ {workout.duration}</span>
                  <span>🔥 {workout.calories} kcal</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const GoalsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Goals</h1>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Target Weight', current: 68, target: 65, unit: 'kg', color: 'from-blue-500 to-blue-700' },
            { name: 'Weekly Workouts', current: 4, target: 5, unit: 'sessions', color: 'from-orange-500 to-red-600' },
            { name: 'Daily Water', current: 2.1, target: 3, unit: 'liters', color: 'from-cyan-500 to-blue-600' },
          ].map((goal, index) => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <motion.div
                key={goal.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{goal.name}</h3>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-3xl font-bold text-white">{goal.current}</p>
                    <p className="text-sm text-white/80">of {goal.target} {goal.unit}</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">{Math.min(percentage, 100).toFixed(0)}%</p>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Alex Johnson</h2>
              <p className="text-white/70">demo@fitnessapp.com</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-white/70 text-sm">Level</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">7</p>
                <p className="text-white/70 text-sm">Day Streak</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">3,450</p>
                <p className="text-white/70 text-sm">Total XP</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">23</p>
                <p className="text-white/70 text-sm">Best Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Info</h3>
            <div className="space-y-3 text-white/80">
              <div className="flex justify-between">
                <span>Age</span>
                <span className="text-white font-semibold">28 years</span>
              </div>
              <div className="flex justify-between">
                <span>Height</span>
                <span className="text-white font-semibold">175 cm</span>
              </div>
              <div className="flex justify-between">
                <span>Weight</span>
                <span className="text-white font-semibold">72 kg</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'workouts':
        return <WorkoutsScreen />;
      case 'goals':
        return <GoalsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around px-6 py-4">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'dashboard' ? 'text-teal-400' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentScreen('workouts')}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'workouts' ? 'text-teal-400' : 'text-gray-400'
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-medium">Workouts</span>
          </button>

          <button
            onClick={() => setCurrentScreen('goals')}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'goals' ? 'text-teal-400' : 'text-gray-400'
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">Goals</span>
          </button>

          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              currentScreen === 'profile' ? 'text-teal-400' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
