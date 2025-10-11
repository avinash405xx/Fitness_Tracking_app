import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, TrendingUp, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getRecentSleepLogs, type SleepLog } from '../../lib/sleepService';

interface SleepTrackerProps {
  onBack: () => void;
}

export default function SleepTracker({ onBack }: SleepTrackerProps) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const sleepLogs = await getRecentSleepLogs(user.id, 7);
      setLogs(sleepLogs);
    } catch (error) {
      console.error('Error loading sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const sleepData = logs.length > 0 ? logs.map(log => ({
    day: getDayName(log.date),
    hours: log.hours
  })).reverse() : Array(7).fill({ day: '', hours: 0 });

  const maxHours = Math.max(...sleepData.map((d) => d.hours), 8);
  const avgSleep = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.hours, 0) / logs.length).toFixed(1)
    : '0.0';
  const lastNight = logs[0]?.hours || 0;
  const lastLog = logs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <div className="px-4 sm:px-6 pt-8 sm:pt-12 pb-24 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Sleep Tracker</h1>
          <div className="w-10" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-purple-300 animate-spin" />
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 mb-6"
            >
              <div className="text-center mb-6">
                <Moon className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mx-auto mb-4" />
                <p className="text-white/70 text-xs sm:text-sm mb-2">Last Night's Sleep</p>
                <p className="text-5xl sm:text-6xl font-bold text-white mb-2">{lastNight}</p>
                <p className="text-white/70 text-sm sm:text-base">hours</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 text-center">
                  <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-300 mx-auto mb-2" />
                  <p className="text-white text-xs sm:text-sm mb-1">Bedtime</p>
                  <p className="text-white font-bold text-sm sm:text-base">{lastLog?.bedtime || '10:30 PM'}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 text-center">
                  <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 mx-auto mb-2" />
                  <p className="text-white text-xs sm:text-sm mb-1">Wake Up</p>
                  <p className="text-white font-bold text-sm sm:text-base">{lastLog?.wake_time || '07:00 AM'}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-white">This Week</h3>
                <div className="flex items-center space-x-2 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-end justify-between h-32 sm:h-40 mb-4">
                {sleepData.slice(-7).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.hours / maxHours) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative w-full px-1">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-xl"
                        style={{ height: item.hours > 0 ? `${(item.hours / maxHours) * 128}px` : '2px' }}
                      >
                        {item.hours > 0 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
                            {item.hours}h
                          </div>
                        )}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">Sleep Quality</h3>
              <div className="space-y-4">
                {[
                  { label: 'Deep Sleep', value: lastLog?.deep_sleep_percent || 45, color: 'from-indigo-500 to-purple-500' },
                  { label: 'Light Sleep', value: lastLog?.light_sleep_percent || 35, color: 'from-blue-400 to-cyan-400' },
                  { label: 'REM Sleep', value: lastLog?.rem_sleep_percent || 20, color: 'from-purple-400 to-pink-400' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
