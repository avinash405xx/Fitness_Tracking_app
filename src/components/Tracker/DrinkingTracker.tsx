import { motion } from 'framer-motion';
import { ArrowLeft, Droplet, Plus, Minus } from 'lucide-react';

interface DrinkingTrackerProps {
  onBack: () => void;
}

export default function DrinkingTracker({ onBack }: DrinkingTrackerProps) {
  const waterIntake = [
    { time: '08:00 AM', amount: 250 },
    { time: '10:30 AM', amount: 300 },
    { time: '12:00 PM', amount: 400 },
    { time: '02:30 PM', amount: 250 },
    { time: '04:00 PM', amount: 300 },
  ];

  const totalIntake = waterIntake.reduce((sum, item) => sum + item.amount, 0);
  const goal = 2300;
  const percentage = (totalIntake / goal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Drinking Tracker</h1>
          <div className="w-10" />
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
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
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplet className="w-12 h-12 text-cyan-500 mb-2" />
                <p className="text-4xl font-bold text-gray-900">{totalIntake}</p>
                <p className="text-gray-500 text-sm">ml / {goal}ml</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-gray-900 mb-1">{Math.round(percentage)}%</p>
            <p className="text-gray-500">Daily Goal Completed</p>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {[100, 200, 300, 500].map((amount) => (
              <button
                key={amount}
                className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl py-3 font-semibold hover:shadow-lg transition-all"
              >
                +{amount}ml
              </button>
            ))}
          </div>
        </motion.div>

        {/* Today's Intake */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Intake</h3>
          <div className="space-y-3">
            {waterIntake.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.amount}ml</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                </div>
                <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                  <Minus className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white"
        >
          <h4 className="font-bold mb-2">Hydration Tip</h4>
          <p className="text-sm text-cyan-50">
            Drink water consistently throughout the day. Your body needs regular hydration to function optimally!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
