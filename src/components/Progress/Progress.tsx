import { useState } from 'react';
import { Award, TrendingUp, Flame, Star, Trophy, Medal } from 'lucide-react';
import MilestoneTracker from './MilestoneTracker';

export default function Progress() {
  const [showMilestones, setShowMilestones] = useState(false);
  const achievements = [
    {
      id: '1',
      name: 'First Workout',
      description: 'Complete your first workout',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      unlocked: true,
      date: '2025-10-01',
    },
    {
      id: '2',
      name: '7-Day Streak',
      description: 'Maintain a 7-day workout streak',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      unlocked: true,
      date: '2025-10-08',
    },
    {
      id: '3',
      name: 'Early Bird',
      description: 'Complete 5 morning workouts',
      icon: Award,
      color: 'from-blue-400 to-blue-600',
      unlocked: true,
      date: '2025-10-09',
    },
    {
      id: '4',
      name: '1000 Calories',
      description: 'Burn 1000 calories in a single day',
      icon: Flame,
      color: 'from-red-500 to-pink-600',
      unlocked: false,
      date: null,
    },
    {
      id: '5',
      name: '30-Day Champion',
      description: 'Maintain a 30-day streak',
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      unlocked: false,
      date: null,
    },
    {
      id: '6',
      name: 'Goal Crusher',
      description: 'Complete 10 fitness goals',
      icon: Medal,
      color: 'from-emerald-500 to-teal-600',
      unlocked: false,
      date: null,
    },
  ];

  const stats = [
    { label: 'Total Workouts', value: '47', change: '+12%' },
    { label: 'Total Calories', value: '18.5K', change: '+8%' },
    { label: 'Current Streak', value: '5 days', change: 'Active' },
    { label: 'Achievements', value: '3/6', change: '50%' },
  ];

  const weeklyData = [
    { day: 'Mon', workouts: 2, calories: 450 },
    { day: 'Tue', workouts: 1, calories: 320 },
    { day: 'Wed', workouts: 3, calories: 680 },
    { day: 'Thu', workouts: 2, calories: 540 },
    { day: 'Fri', workouts: 1, calories: 380 },
    { day: 'Sat', workouts: 0, calories: 0 },
    { day: 'Sun', workouts: 0, calories: 0 },
  ];

  const maxCalories = Math.max(...weeklyData.map((d) => d.calories));

  if (showMilestones) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Milestones</h1>
            <p className="text-gray-600">Track your progress toward key achievements</p>
          </div>
          <button
            onClick={() => setShowMilestones(false)}
            className="text-emerald-600 font-semibold hover:underline"
          >
            View All Stats
          </button>
        </div>
        <MilestoneTracker />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress & Achievements</h1>
          <p className="text-gray-600">Track your journey and celebrate milestones</p>
        </div>
        <button
          onClick={() => setShowMilestones(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
        >
          View Milestones
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-emerald-600 font-semibold">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Weekly Activity</h2>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weeklyData.map((day) => (
            <div key={day.day} className="text-center">
              <div className="mb-2 flex flex-col items-center justify-end h-32 relative">
                <div className="relative w-full flex justify-center">
                  {day.workouts > 0 && (
                    <div className="absolute -top-6 text-xs font-semibold text-emerald-600">
                      {day.workouts}
                    </div>
                  )}
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: day.calories > 0 ? `${(day.calories / maxCalories) * 100}%` : '2%',
                      minHeight: day.calories > 0 ? '20px' : '2px',
                    }}
                  />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600">{day.day}</p>
              <p className="text-xs text-gray-500 mt-1">{day.calories}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Calories burned per day • Workouts shown above bars
        </p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-2">Level 12</h3>
            <p className="text-white/90 mb-4">2,847 / 3,000 XP to Level 13</p>
            <div className="h-3 bg-white/20 rounded-full w-64 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: '94.9%' }}
              />
            </div>
          </div>
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Award className="w-14 h-14" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`rounded-xl p-6 border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center shadow-lg ${
                      !achievement.unlocked && 'opacity-50'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {achievement.unlocked && (
                    <div className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                {achievement.unlocked && achievement.date && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    Unlocked {new Date(achievement.date).toLocaleDateString()}
                  </p>
                )}
                {!achievement.unlocked && (
                  <p className="text-xs text-gray-500 font-semibold">Locked</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
