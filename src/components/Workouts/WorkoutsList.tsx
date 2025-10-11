import { motion } from 'framer-motion';
import { Dumbbell, Clock, Flame, TrendingUp } from 'lucide-react';

interface WorkoutsListProps {
  onWorkoutClick: () => void;
}

export default function WorkoutsList({ onWorkoutClick }: WorkoutsListProps) {
  const workouts = [
    {
      id: 1,
      name: 'Full Body HIIT',
      duration: '30 min',
      calories: 350,
      difficulty: 'Intermediate',
      image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800',
      exercises: 8,
    },
    {
      id: 2,
      name: 'Core Strength',
      duration: '20 min',
      calories: 200,
      difficulty: 'Beginner',
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=800',
      exercises: 6,
    },
    {
      id: 3,
      name: 'Upper Body Power',
      duration: '45 min',
      calories: 420,
      difficulty: 'Advanced',
      image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
      exercises: 10,
    },
    {
      id: 4,
      name: 'Leg Day Blast',
      duration: '40 min',
      calories: 380,
      difficulty: 'Intermediate',
      image: 'https://images.pexels.com/photos/4162483/pexels-photo-4162483.jpeg?auto=compress&cs=tinysrgb&w=800',
      exercises: 9,
    },
    {
      id: 5,
      name: 'Cardio Burn',
      duration: '25 min',
      calories: 300,
      difficulty: 'Beginner',
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800',
      exercises: 7,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-200';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-200';
      case 'Advanced':
        return 'bg-red-500/20 text-red-200';
      default:
        return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-6 pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Workouts</h1>
          <p className="text-white/70">Choose your workout for today</p>
        </div>

        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <motion.button
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={onWorkoutClick}
              className="w-full bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all text-left"
            >
              <div className="flex">
                <div
                  className="w-32 h-32 bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${workout.image})` }}
                />

                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{workout.name}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(
                        workout.difficulty
                      )}`}
                    >
                      {workout.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-teal-200" />
                      <span className="text-white/80 text-sm">{workout.duration}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-300" />
                      <span className="text-white/80 text-sm">{workout.calories}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dumbbell className="w-4 h-4 text-green-200" />
                      <span className="text-white/80 text-sm">{workout.exercises} ex</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
