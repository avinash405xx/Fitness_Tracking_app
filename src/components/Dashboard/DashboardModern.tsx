import { motion } from 'framer-motion';
import { Droplet, Flame, Weight, Activity, ChevronDown, Bell, Search, Plus } from 'lucide-react';
import CircularProgress from '../shared/CircularProgress';
import FitnessVideo from '../shared/FitnessVideo';
import { getFoodImage } from '../../constants/foodImages';

interface DashboardModernProps {
  onNavigate: (page: string) => void;
}

export default function DashboardModern({ onNavigate }: DashboardModernProps) {
  const nutritionData = [
    { label: 'Protein', value: 35, color: 'bg-lime-400' },
    { label: 'Carbo', value: 65, color: 'bg-yellow-400' },
    { label: 'Fat', value: 65, color: 'bg-red-400' },
  ];

  const activities = [
    {
      title: 'Drinking Tracker',
      subtitle: 'Stay hydrated, nature\'s best nutrient',
      videoUrl: 'https://videos.pexels.com/video-files/6985001/6985001-uhd_2560_1440_30fps.mp4',
      color: 'from-lime-400 to-lime-500',
    },
    {
      title: 'Daily Exercise',
      subtitle: 'Build strength and endurance',
      videoUrl: 'https://videos.pexels.com/video-files/4753989/4753989-uhd_2560_1440_30fps.mp4',
      color: 'from-white to-gray-100',
    },
    {
      title: 'Sleep Tracker',
      subtitle: 'Quality sleep for recovery',
      videoUrl: 'https://videos.pexels.com/video-files/5357416/5357416-uhd_2560_1440_30fps.mp4',
      color: 'from-gray-800 to-gray-900',
    },
  ];

  const mealPlan = [
    {
      meal: 'Breakfast',
      items: ['Bread', 'Peanut Butter', 'Apple'],
      calories: '230kcal',
      hasItems: true,
    },
    {
      meal: 'Lunch',
      items: ['Salad', 'Bread', 'Yogurt'],
      calories: '120kcal',
      hasItems: true,
    },
    {
      meal: 'Dinner',
      items: ['Salad', 'Bread', 'Yogurt'],
      calories: '120kcal',
      hasItems: true,
    },
  ];

  const calorieAnalysis = [
    { label: 'Carbo', value: 40, color: 'bg-yellow-400' },
    { label: 'Fat', value: 25, color: 'bg-red-400' },
    { label: 'Protein', value: 35, color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Left Sidebar - User Info */}
        <div className="lg:col-span-1 bg-gray-900 rounded-3xl p-4 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">N</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="User"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Jenny Wilson</h2>
              </div>
              <button className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <span className="text-xs sm:text-sm text-gray-600">Monthly</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Body Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">Body Overview</h3>
              <button className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                See All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Calorie Section */}
              <div>
                <div className="bg-lime-400/10 border border-lime-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4">
                  <p className="text-lime-400 text-xs sm:text-sm mb-2">You've gain 2kg in a month keep it up!</p>
                  <p className="text-gray-400 text-xs">Still need to gain</p>
                  <div className="mt-3 sm:mt-4">
                    <p className="text-4xl sm:text-5xl font-bold text-white">950</p>
                    <p className="text-gray-400 text-xs sm:text-sm">kcal</p>
                  </div>
                </div>

                {/* Nutrition Circles */}
                <div className="flex items-center justify-around">
                  {nutritionData.map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                      <CircularProgress value={item.value} size={60} color={item.color} />
                      <p className="text-gray-400 text-xs mt-2">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Targets */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4">My Daily Target</h4>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Droplet className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-400 text-sm">Water</span>
                    </div>
                    <p className="text-white text-sm mb-1">Total Goal</p>
                    <p className="text-2xl font-bold text-white">2300ml</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span className="text-gray-400 text-sm">Calories</span>
                    </div>
                    <p className="text-white text-sm mb-1">Total Goal</p>
                    <p className="text-2xl font-bold text-white">890kCal</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Weight className="w-5 h-5 text-orange-400" />
                      <span className="text-gray-400 text-sm">Weight</span>
                    </div>
                    <p className="text-white text-sm mb-1">My Weight</p>
                    <p className="text-2xl font-bold text-white">62Kg</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-5 h-5 text-red-400" />
                      <span className="text-gray-400 text-sm">Bpm</span>
                    </div>
                    <p className="text-white text-sm mb-1">My Weight</p>
                    <p className="text-2xl font-bold text-white">62Kg</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* New Activity Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">New Activity</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                See All Suggestions
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {activities.map((activity, index) => (
                <motion.button
                  key={activity.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate(activity.title.toLowerCase())}
                  className={`rounded-3xl p-4 sm:p-6 text-left overflow-hidden relative h-40 sm:h-48`}
                >
                  <FitnessVideo
                    videoUrl={activity.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-70`} />
                  <div className="relative z-10">
                    <h4 className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${activity.color.includes('gray-800') ? 'text-white' : 'text-gray-900'}`}>
                      {activity.title}
                    </h4>
                    <p className={`text-xs sm:text-sm ${activity.color.includes('gray-800') ? 'text-gray-300' : 'text-gray-600'}`}>
                      {activity.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Meal Plan */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">My Meal Plan</h3>
            </div>

            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Sat, 09 September 2023</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {mealPlan.map((item) => (
                <div key={item.meal} className="border-b border-gray-100 pb-3 sm:pb-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${item.hasItems ? 'bg-gray-900' : 'bg-gray-300'}`} />
                      <span className="font-semibold text-gray-900">{item.meal}</span>
                    </div>
                    <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  {item.hasItems && (
                    <div className="flex items-center space-x-3 ml-4">
                      {item.items.map((food, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl mb-1" />
                          <span className="text-xs text-gray-600">{food}</span>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500">{item.calories}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calories Analysis */}
          <div className="bg-white rounded-3xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Calories Analysis</h3>
            <div className="space-y-3">
              {calorieAnalysis.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
