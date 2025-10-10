import { motion } from 'framer-motion';
import { Droplet, Flame, Weight, Activity, ChevronDown, Bell, Search, Plus } from 'lucide-react';
import CircularProgress from '../shared/CircularProgress';

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
      subtitle: 'Stay hydrated. it\'s nature\'s best nutrient',
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-lime-400 to-lime-500',
    },
    {
      title: 'Daily Exercise',
      subtitle: 'Stay hydrated. it\'s nature\'s best nutrient',
      image: 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: 'from-white to-gray-100',
    },
    {
      title: 'Sleep Tracker',
      subtitle: 'Stay hydrated. it\'s nature\'s best nutrient',
      image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400',
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
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Jenny Wilson</h2>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <span className="text-sm text-gray-600">Monthly</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Search className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Body Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Body Overview</h3>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                See All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Calorie Section */}
              <div>
                <div className="bg-lime-400/10 border border-lime-400/20 rounded-2xl p-6 mb-4">
                  <p className="text-lime-400 text-sm mb-2">You've gain 2kg in a month keep it up!</p>
                  <p className="text-gray-400 text-xs">Still need to gain</p>
                  <div className="mt-4">
                    <p className="text-5xl font-bold text-white">950</p>
                    <p className="text-gray-400 text-sm">kcal</p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4">
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

            <div className="grid grid-cols-3 gap-4">
              {activities.map((activity, index) => (
                <motion.button
                  key={activity.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate(activity.title.toLowerCase())}
                  className={`bg-gradient-to-br ${activity.color} rounded-3xl p-6 text-left overflow-hidden relative h-48`}
                >
                  <h4 className={`text-lg font-bold mb-2 ${activity.color.includes('gray-800') ? 'text-white' : 'text-gray-900'}`}>
                    {activity.title}
                  </h4>
                  <p className={`text-sm mb-4 ${activity.color.includes('gray-800') ? 'text-gray-300' : 'text-gray-600'}`}>
                    {activity.subtitle}
                  </p>
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="absolute bottom-0 right-0 w-32 h-32 object-cover rounded-tl-3xl"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Meal Plan */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">My Meal Plan</h3>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Sat, 09 September 2023</p>
            </div>

            <div className="space-y-4">
              {mealPlan.map((item) => (
                <div key={item.meal} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-3">
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
