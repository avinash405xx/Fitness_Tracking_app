import { Award, Star, Flame, Trophy, Zap, Heart } from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  progress: number;
  target: number;
  unit: string;
  reward: string;
  unlocked: boolean;
}

export default function MilestoneTracker() {
  const milestones: Milestone[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Log your first workout',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      progress: 1,
      target: 1,
      unit: 'workout',
      reward: '+50 XP',
      unlocked: true,
    },
    {
      id: '2',
      name: 'Getting Started',
      description: 'Complete 5 workouts',
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      progress: 3,
      target: 5,
      unit: 'workouts',
      reward: '+100 XP',
      unlocked: false,
    },
    {
      id: '3',
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      progress: 5,
      target: 7,
      unit: 'days',
      reward: '+200 XP',
      unlocked: false,
    },
    {
      id: '4',
      name: 'Consistency King',
      description: 'Log meals for 14 consecutive days',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      progress: 8,
      target: 14,
      unit: 'days',
      reward: '+250 XP',
      unlocked: false,
    },
    {
      id: '5',
      name: 'Goal Crusher',
      description: 'Complete your first goal',
      icon: Trophy,
      color: 'from-emerald-500 to-teal-600',
      progress: 0,
      target: 1,
      unit: 'goal',
      reward: '+300 XP',
      unlocked: false,
    },
    {
      id: '6',
      name: 'Champion',
      description: 'Reach Level 10',
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      progress: 12,
      target: 10,
      unit: 'level',
      reward: '+500 XP',
      unlocked: true,
    },
  ];

  const completedCount = milestones.filter((m) => m.unlocked).length;
  const totalCount = milestones.length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">Milestone Progress</h3>
            <p className="text-white/90">
              {completedCount} of {totalCount} milestones achieved
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{Math.round((completedCount / totalCount) * 100)}%</div>
            <p className="text-white/80 text-sm">Complete</p>
          </div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone) => {
          const Icon = milestone.icon;
          const percentage = (milestone.progress / milestone.target) * 100;
          const isComplete = milestone.unlocked;

          return (
            <div
              key={milestone.id}
              className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                isComplete
                  ? 'border-emerald-300 shadow-md'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${milestone.color} rounded-xl flex items-center justify-center shadow-lg ${
                    !isComplete && 'opacity-60'
                  }`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {isComplete ? (
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlocked</span>
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                    {milestone.reward}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{milestone.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {milestone.progress} / {milestone.target} {milestone.unit}
                  </span>
                  <span className="font-bold text-emerald-600">
                    {Math.min(percentage, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${milestone.color} rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Keep Going!</h4>
            <p className="text-sm text-gray-700">
              You're just <strong>2 days away</strong> from unlocking the "On Fire" milestone.
              Don't break your streak now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
