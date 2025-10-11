import { useState } from 'react';
import { Plus, Dumbbell, Clock, Flame, Calendar } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
}

export default function Workouts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [workouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Morning Run',
      type: 'Cardio',
      duration: 45,
      calories: 420,
      date: '2025-10-10',
    },
    {
      id: '2',
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: 60,
      calories: 380,
      date: '2025-10-09',
    },
    {
      id: '3',
      name: 'Yoga Flow',
      type: 'Flexibility',
      duration: 30,
      calories: 150,
      date: '2025-10-09',
    },
  ]);

  const workoutTypes = ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
          <p className="text-gray-600">Track and manage your training sessions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Workout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workoutTypes.map((type) => (
          <div
            key={type}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <Dumbbell className="w-8 h-8 text-emerald-600" />
              <span className="text-sm font-medium text-gray-500">Quick Add</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{type}</h3>
            <p className="text-sm text-gray-600">Start a {type.toLowerCase()} workout</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Workouts</h2>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                  <p className="text-sm text-gray-600">{workout.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration} min</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Flame className="w-4 h-4" />
                  <span>{workout.calories} cal</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(workout.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Workout</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Run"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                  {workoutTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories Burned
                </label>
                <input
                  type="number"
                  placeholder="300"
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
                  Add Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
