import { Target, Dumbbell, Apple, TrendingUp, ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center text-white mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
            <Target className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Welcome to FitTrack!</h1>
          <p className="text-xl text-white/90 mb-2">Your personal fitness journey starts here</p>
          <p className="text-white/80">Let's set you up for success in just a few steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Set Your Goals</h3>
            <p className="text-white/80 text-sm">
              Define personalized fitness objectives that match your lifestyle and aspirations
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-white/80 text-sm">
              Log workouts and meals effortlessly with our quick-add features
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
            <p className="text-white/80 text-sm">
              Unlock achievements and level up as you crush your fitness milestones
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to transform your fitness journey?
          </h2>
          <p className="text-gray-600 mb-6">
            We'll help you set up your first goal and get started in less than 2 minutes
          </p>
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-xl transition-all shadow-lg transform hover:scale-105 mx-auto"
          >
            <span>Let's Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
