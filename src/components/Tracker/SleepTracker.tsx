import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, TrendingUp } from 'lucide-react';

interface SleepTrackerProps {
  onBack: () => void;
}

export default function SleepTracker({ onBack }: SleepTrackerProps) {
  const sleepData = [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 6.5 },
    { day: 'Wed', hours: 8 },
    { day: 'Thu', hours: 7 },
    { day: 'Fri', hours: 6 },
    { day: 'Sat', hours: 9 },
    { day: 'Sun', hours: 8.5 },
  ];

  const maxHours = Math.max(...sleepData.map((d) => d.hours));
  const avgSleep = (sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length).toFixed(1);
  const lastNight = sleepData[sleepData.length - 1].hours;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Sleep Tracker</h1>
          <div className="w-10" />
        </div>

        {/* Last Night's Sleep */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-6"
        >
          <div className="text-center mb-6">
            <Moon className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-white/70 text-sm mb-2">Last Night's Sleep</p>
            <p className="text-6xl font-bold text-white mb-2">{lastNight}</p>
            <p className="text-white/70">hours</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <Moon className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
              <p className="text-white text-sm mb-1">Bedtime</p>
              <p className="text-white font-bold">10:30 PM</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <Sun className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-white text-sm mb-1">Wake Up</p>
              <p className="text-white font-bold">07:00 AM</p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">This Week</h3>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">+12%</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-40 mb-4">
            {sleepData.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ height: 0 }}
                animate={{ height: `${(item.hours / maxHours) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center flex-1"
              >
                <div className="relative w-full px-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-xl relative"
                    style={{ height: `${(item.hours / maxHours) * 160}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
                      {item.hours}h
                    </div>
                  </div>
                </div>
                <span className="text-xs text-white/70 mt-2">{item.day}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-8 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Average</p>
              <p className="text-white font-bold text-lg">{avgSleep}h</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">Goal</p>
              <p className="text-white font-bold text-lg">8h</p>
            </div>
          </div>
        </motion.div>

        {/* Sleep Quality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Sleep Quality</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Deep Sleep</span>
                <span className="text-white font-semibold">45%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Light Sleep</span>
                <span className="text-white font-semibold">35%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">REM Sleep</span>
                <span className="text-white font-semibold">20%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sleep Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6"
        >
          <h4 className="font-bold text-white mb-2">Sleep Tip</h4>
          <p className="text-sm text-indigo-100">
            Try to maintain a consistent sleep schedule. Going to bed and waking up at the same time helps regulate your body's internal clock.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
