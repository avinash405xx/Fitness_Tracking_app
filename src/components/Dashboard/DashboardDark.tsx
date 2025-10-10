import { motion } from 'framer-motion';
import { TrendingUp, Flame, Dumbbell, User } from 'lucide-react';
import AnimatedCounter from '../shared/AnimatedCounter';

interface DashboardDarkProps {
  onWorkoutClick: () => void;
}

export default function DashboardDark({ onWorkoutClick }: DashboardDarkProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800">
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30"
          >
            <User className="w-6 h-6 text-white" />
          </motion.button>
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
              <AnimatedCounter value={4325} />
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
              143 <span className="text-sm text-white/70">kcal</span>
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
            <p className="text-white/70 text-xs mb-1">Exercises</p>
            <p className="text-2xl font-bold text-white">
              130 <span className="text-sm text-white/70">minutes</span>
            </p>
          </motion.div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Training Workout</h2>
            <button className="text-sm text-white/70">See all</button>
          </div>

          <div className="space-y-4">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onWorkoutClick}
              className="w-full text-left"
            >
              <div className="bg-gradient-to-br from-teal-600 to-green-700 rounded-3xl p-4 flex items-center space-x-4 shadow-xl">
                <img
                  src="https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Challenge"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <span className="text-xs bg-green-400/30 text-white px-3 py-1 rounded-full">
                    Challenge
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Strength</h3>
                  <div className="flex items-center space-x-4 mt-2 text-white/90">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm">245 kcal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">⏱ 30 min</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl text-white">→</span>
                </div>
              </div>
            </motion.button>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left"
            >
              <div className="bg-gradient-to-br from-green-600 to-teal-700 rounded-3xl p-4 flex items-center space-x-4 shadow-xl">
                <img
                  src="https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Cardio"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <span className="text-xs bg-teal-400/30 text-white px-3 py-1 rounded-full">
                    Challenge
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">Cardio</h3>
                  <div className="flex items-center space-x-4 mt-2 text-white/90">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm">320 kcal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">⏱ 25 min</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl text-white">→</span>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
