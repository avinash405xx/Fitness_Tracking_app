import { useState } from 'react';
import { Plus, Target, TrendingUp, Award, Zap, Heart, Droplets } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  icon: string;
  color: string;
}

export default function Goals() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Target Weight',
      category: 'Weight Loss',
      current: 68,
      target: 65,
      unit: 'kg',
      icon: 'target',
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: '2',
      name: 'Weekly Workouts',
      category: 'Fitness',
      current: 4,
      target: 5,
      unit: 'sessions',
      icon: 'zap',
      color: 'from-orange-500 to-red-600',
    },
    {
      id: '3',
      name: 'Daily Water Intake',
      category: 'Hydration',
      current: 2.1,
      target: 3,
      unit: 'liters',
      icon: 'droplets',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: '4',
      name: 'Running Distance',
      category: 'Cardio',
      current: 15,
      target: 30,
      unit: 'km/week',
      icon: 'trending',
      color: 'from-emerald-500 to-teal-600',
    },
  ]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      target: Target,
      zap: Zap,
      droplets: Droplets,
      trending: TrendingUp,
      heart: Heart,
    };
    return icons[iconName] || Target;
  };

  const categories = [
    { name: 'Weight Loss', icon: Target, color: 'from-blue-500 to-blue-700' },
    { name: 'Muscle Gain', icon: Zap, color: 'from-purple-500 to-pink-600' },
    { name: 'Endurance', icon: Heart, color: 'from-red-500 to-orange-600' },
    { name: 'Flexibility', icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Goals</h1>
          <p className="text-white/80">Set and track your fitness objectives</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const Icon = getIcon(goal.icon);
          const percentage = (goal.current / goal.target) * 100;
          const isCompleted = percentage >= 100;

          return (
            <div
              key={goal.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {isCompleted && (
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{goal.name}</h3>
              <p className="text-sm text-white/80 mb-4">{goal.category}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-white">{goal.current}</p>
                    <p className="text-sm text-white/80">
                      of {goal.target} {goal.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {Math.min(percentage, 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-white/80">Progress</p>
                  </div>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/80">
                    {goal.target - goal.current > 0
                      ? `${(goal.target - goal.current).toFixed(1)} ${goal.unit} to go`
                      : 'Goal achieved!'}
                  </span>
                  <button className="text-emerald-600 font-semibold hover:underline">
                    Update
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/20">
        <h2 className="text-xl font-bold text-white mb-6">Goal Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105`}
                onClick={() => setShowAddModal(true)}
              >
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-white/80 text-sm mt-1">Create goal</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">2 Goals Completed This Month!</h3>
            <p className="text-white/90">Keep up the amazing work. You're crushing it!</p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Target Weight"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value
                  </label>
                  <input
                    type="number"
                    placeholder="68"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    placeholder="65"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  placeholder="e.g., kg, km, sessions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
