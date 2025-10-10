import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Droplet, Plus, Minus } from 'lucide-react';
import { getWaterLogs, addWaterLog, deleteWaterLog, getDailyStats, updateDailyStats, type WaterLog } from '../../lib/dataService';

interface DrinkingTrackerProps {
  onBack: () => void;
}

export default function DrinkingTracker({ onBack }: DrinkingTrackerProps) {
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [totalIntake, setTotalIntake] = useState(0);
  const [goal, setGoal] = useState(2300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logs, stats] = await Promise.all([
        getWaterLogs(),
        getDailyStats(),
      ]);

      setWaterLogs(logs);
      const total = logs.reduce((sum, log) => sum + log.amount_ml, 0);
      setTotalIntake(total);

      if (stats) {
        setGoal(stats.water_goal_ml);
      }
    } catch (error) {
      console.error('Error loading water data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async (amount: number) => {
    try {
      const newLog = await addWaterLog(amount);
      setWaterLogs((prev) => [newLog, ...prev]);
      setTotalIntake((prev) => prev + amount);

      await updateDailyStats({
        water_intake_ml: totalIntake + amount,
      });
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const handleDeleteLog = async (id: string, amount: number) => {
    try {
      await deleteWaterLog(id);
      setWaterLogs((prev) => prev.filter((log) => log.id !== id));
      setTotalIntake((prev) => prev - amount);

      await updateDailyStats({
        water_intake_ml: totalIntake - amount,
      });
    } catch (error) {
      console.error('Error deleting water log:', error);
    }
  };

  const percentage = Math.min((totalIntake / goal) * 100, 100);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Droplet className="w-12 h-12 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Drinking Tracker</h1>
          <div className="w-10" />
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-3xl overflow-hidden h-48 sm:h-64"
        >
          <img
            src="https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Water"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 mb-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
            <div className="relative">
              <svg className="w-40 h-40 sm:w-48 sm:h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="url(#waterGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplet className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500 mb-2" />
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{totalIntake}</p>
                <p className="text-gray-500 text-xs sm:text-sm">ml / {goal}ml</p>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{Math.round(percentage)}%</p>
              <p className="text-gray-500 text-sm sm:text-base mb-4">Daily Goal Completed</p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">{goal - totalIntake}ml</span> remaining
              </p>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[100, 200, 300, 500].map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddWater(amount)}
                className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl py-3 sm:py-4 font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                +{amount}ml
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Today's Intake */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Intake</h3>
          {waterLogs.length === 0 ? (
            <div className="text-center py-8">
              <Droplet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No water logged yet today</p>
              <p className="text-sm text-gray-400 mt-1">Start tracking your hydration!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {waterLogs.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Droplet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.amount_ml}ml</p>
                        <p className="text-sm text-gray-500">{formatTime(item.logged_at)}</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteLog(item.id, item.amount_ml)}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white"
        >
          <h4 className="font-bold mb-2 text-lg">Hydration Tip</h4>
          <p className="text-sm text-cyan-50">
            Drink water consistently throughout the day. Your body needs regular hydration to function optimally!
            Try to drink a glass of water every 2 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
