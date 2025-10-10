import { Flame, Footprints, TrendingUp, Award, Target, Activity } from 'lucide-react';

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Amanda!</h1>
        <p className="text-gray-600">Here's your fitness journey at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <Flame className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Today</span>
          </div>
          <p className="text-3xl font-bold mb-1">1,847</p>
          <p className="text-white/80 text-sm">Calories Burned</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <Footprints className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Today</span>
          </div>
          <p className="text-3xl font-bold mb-1">8,542</p>
          <p className="text-white/80 text-sm">Steps Taken</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <Activity className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">This Week</span>
          </div>
          <p className="text-3xl font-bold mb-1">12</p>
          <p className="text-white/80 text-sm">Workouts Completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <Award className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Level 12</span>
          </div>
          <p className="text-3xl font-bold mb-1">2,847</p>
          <p className="text-white/80 text-sm">Total XP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Weekly Progress</h2>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
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
                    <div
                      className={`h-full rounded-full transition-all ${
                        progress === 100
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : progress > 0
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gray-200'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Weight Loss', current: 68, target: 65, unit: 'kg' },
              { name: 'Weekly Workouts', current: 4, target: 5, unit: 'sessions' },
              { name: 'Daily Water', current: 2.1, target: 3, unit: 'L' },
            ].map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.name} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-900">{goal.name}</span>
                    <span className="text-sm text-gray-600">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Keep Up The Great Work!</h3>
            <p className="text-white/90">You're on a 5-day streak. Don't break it!</p>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((day) => (
              <div
                key={day}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white"
              >
                <Flame className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
