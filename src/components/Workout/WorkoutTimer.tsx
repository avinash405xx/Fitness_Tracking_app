import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreVertical, Play, Pause, SkipForward } from 'lucide-react';

interface WorkoutTimerProps {
  workout: {
    name: string;
    duration: number;
    image: string;
  };
  onBack: () => void;
}

export default function WorkoutTimer({ workout, onBack }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalSeconds = workout.duration * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && seconds < totalSeconds) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, seconds, totalSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const progress = (seconds / totalSeconds) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={workout.image}
          alt={workout.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-6 pt-12">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-white text-lg font-semibold">{workout.name}</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        <div className="flex-1 flex items-end justify-center pb-32">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-8xl font-bold text-white mb-2">
              {formatTime(seconds)}
            </div>
            <div className="text-white/80 text-lg">
              {formatTime(totalSeconds)}
            </div>
          </motion.div>
        </div>

        <div className="p-6 pb-12">
          <div className="w-full h-1 bg-white/20 rounded-full mb-6">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-semibold"
            >
              Previous
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-2xl"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-gray-900" />
              ) : (
                <Play className="w-8 h-8 text-gray-900 ml-1" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md flex items-center space-x-2"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
