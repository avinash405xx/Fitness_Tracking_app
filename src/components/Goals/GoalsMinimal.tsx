import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingDown, Zap, Droplets, Award } from 'lucide-react';
import CircularProgress from '../shared/CircularProgress';

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  icon: any;
  color: string;
}

export default function GoalsMinimal() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Target Weight',
      current: 68,
      target: 65,
      unit: 'kg',
      icon: TrendingDown,
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: '2',
      name: 'Weekly Workouts',
      current: 4,
      target: 5,
      unit: 'sessions',
      icon: Zap,
      color: 'from-blue-600 to-green-600',
    },
    {
      id: '3',
      name: 'Daily Water',
      current: 2.1,
      target: 3,
      unit: 'liters',
      icon: Droplets,
      color: 'from-blue-400 to-green-400',
    },
  ]);

  const completedGoals = goals.filter((g) => g.current >= g.target).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Your Goals
          </h1>
          <p className="text-gray-600">
            {completedGoals} of {goals.length} goals completed
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const percentage = (goal.current / goal.target) * 100;
          const isCompleted = percentage >= 100;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border ${
                isCompleted ? 'border-green-300' : 'border-blue-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                  >
                    <Award className="w-3 h-3" />
                    <span>Done</span>
                  </motion.div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">{goal.name}</h3>

              <div className="flex items-center justify-center mb-4">
                <CircularProgress
                  percentage={percentage}
                  size={120}
                  strokeWidth={8}
                />
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {goal.current} / {goal.target}
                </p>
                <p className="text-sm text-gray-600 mt-1">{goal.unit}</p>
              </div>

              {!isCompleted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 rounded-lg font-semibold text-sm"
                >
                  Update Progress
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Target className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">Keep Pushing Forward!</h3>
            <p className="text-white/90">You're making great progress. Stay consistent!</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{Math.round((completedGoals / goals.length) * 100)}%</p>
            <p className="text-white/80 text-sm">Complete</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Goal Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Weight Loss', icon: TrendingDown, color: 'from-blue-500 to-blue-700' },
            { name: 'Fitness', icon: Zap, color: 'from-blue-600 to-green-600' },
            { name: 'Nutrition', icon: Droplets, color: 'from-green-500 to-green-700' },
            { name: 'Custom', icon: Target, color: 'from-blue-400 to-green-400' },
          ].map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className={`bg-gradient-to-br ${category.color} text-white rounded-xl p-4 shadow-lg`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <p className="font-semibold text-sm">{category.name}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Target Weight"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current</label>
                  <input
                    type="number"
                    placeholder="68"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                  <input
                    type="number"
                    placeholder="65"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  placeholder="kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold"
                >
                  Create
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
