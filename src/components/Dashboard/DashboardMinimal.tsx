import { motion } from 'framer-motion';
import { Flame, Footprints, Target, Award, TrendingUp } from 'lucide-react';
import CircularProgress from '../shared/CircularProgress';
import AnimatedCounter from '../shared/AnimatedCounter';

export default function DashboardMinimal() {
  const stats = {
    calories: 1847,
    caloriesGoal: 2000,
    steps: 8542,
    stepsGoal: 10000,
    workouts: 4,
    workoutsGoal: 5,
    streak: 5,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          Welcome Back, Amanda
        </h1>
        <p className="text-gray-600">Here's your progress for today</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Today</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CircularProgress
              percentage={(stats.calories / stats.caloriesGoal) * 100}
              size={140}
              strokeWidth={10}
            />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter value={stats.calories} />
            </p>
            <p className="text-sm text-gray-600 mt-1">
              of {stats.caloriesGoal.toLocaleString()} cal burned
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border border-green-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <Footprints className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Today</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CircularProgress
              percentage={(stats.steps / stats.stepsGoal) * 100}
              size={140}
              strokeWidth={10}
            />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter value={stats.steps} />
            </p>
            <p className="text-sm text-gray-600 mt-1">
              of {stats.stepsGoal.toLocaleString()} steps
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">This Week</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <CircularProgress
              percentage={(stats.workouts / stats.workoutsGoal) * 100}
              size={140}
              strokeWidth={10}
            />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter value={stats.workouts} />
            </p>
            <p className="text-sm text-gray-600 mt-1">
              of {stats.workoutsGoal} workouts
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Flame className="w-8 h-8" />
              </motion.div>
              <h3 className="text-3xl font-bold">
                <AnimatedCounter value={stats.streak} /> Day Streak!
              </h3>
            </div>
            <p className="text-white/90">Keep it up! You're on fire!</p>
          </div>
          <div className="flex items-center space-x-2">
            {[...Array(stats.streak)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white"
              >
                <Flame className="w-6 h-6" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Weekly Progress</h2>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const progress = [85, 92, 78, 100, 88, 0, 0][index];
              return (
                <div key={day}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{day}</span>
                    <span className="text-gray-900 font-semibold">{progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        progress === 100
                          ? 'bg-gradient-to-r from-blue-600 to-green-600'
                          : progress > 0
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Achievements</h2>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'First Workout', date: 'Oct 1', color: 'from-yellow-400 to-orange-500' },
              { name: '7-Day Streak', date: 'Oct 8', color: 'from-orange-500 to-red-600' },
              { name: 'Early Bird', date: 'Oct 9', color: 'from-blue-500 to-blue-700' },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center`}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">Unlocked {achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
