import { motion } from 'framer-motion';
import { ChevronLeft, MoreVertical, Flame, Clock, Play } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  duration: string;
  image: string;
}

interface WorkoutDetailProps {
  onBack: () => void;
  onStartWorkout: () => void;
}

export default function WorkoutDetail({ onBack, onStartWorkout }: WorkoutDetailProps) {
  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Bending to the sides',
      duration: '1:36 min',
      image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      id: '2',
      name: 'Jump squats',
      duration: '2:10 min',
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50">
      <div className="relative h-96">
        <img
          src="https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Workout"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-transparent" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 pt-12">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Full body workout</h1>
          <p className="text-gray-600 text-sm mb-4">
            A full body workout is a workout in which the entire body is involved in one session.
          </p>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <p className="text-sm font-bold text-gray-900">345 kcal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-bold text-gray-900">30 min</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl border border-teal-100"
              >
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                  <p className="text-sm text-gray-500">{exercise.duration}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-green-600 flex items-center justify-center shadow-lg"
                >
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onStartWorkout}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold text-lg shadow-xl"
          >
            Start Workout
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
