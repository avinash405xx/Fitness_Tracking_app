import { useState } from 'react';
import { Plus, Dumbbell, Apple, X, Check } from 'lucide-react';

export default function QuickLogButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWorkoutQuick, setShowWorkoutQuick] = useState(false);
  const [showMealQuick, setShowMealQuick] = useState(false);

  const workoutPresets = [
    { name: '30 Min Run', calories: 300, icon: '🏃' },
    { name: 'Gym Session', calories: 400, icon: '💪' },
    { name: 'Yoga', calories: 150, icon: '🧘' },
    { name: '15 Min HIIT', calories: 200, icon: '🔥' },
  ];

  const mealPresets = [
    { name: 'Light Breakfast', calories: 300, icon: '🥐' },
    { name: 'Healthy Lunch', calories: 500, icon: '🥗' },
    { name: 'Protein Shake', calories: 200, icon: '🥤' },
    { name: 'Standard Dinner', calories: 600, icon: '🍽️' },
  ];

  const handleQuickLog = (type: string, name: string) => {
    console.log(`Quick logged: ${type} - ${name}`);
    setIsOpen(false);
    setShowWorkoutQuick(false);
    setShowMealQuick(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 flex items-center justify-center z-50 hover:scale-110 transition-all"
      >
        {isOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-44 right-6 md:bottom-28 md:right-8 z-50 flex flex-col space-y-3">
            <button
              onClick={() => {
                setShowWorkoutQuick(true);
                setShowMealQuick(false);
              }}
              className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center space-x-3 hover:scale-105 transition-all border-2 border-emerald-500"
            >
              <Dumbbell className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">Quick Workout</span>
            </button>
            <button
              onClick={() => {
                setShowMealQuick(true);
                setShowWorkoutQuick(false);
              }}
              className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center space-x-3 hover:scale-105 transition-all border-2 border-orange-500"
            >
              <Apple className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Quick Meal</span>
            </button>
          </div>
        </>
      )}

      {showWorkoutQuick && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Quick Log Workout</h3>
              <button
                onClick={() => setShowWorkoutQuick(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Select a preset or tap to customize</p>
            <div className="grid grid-cols-2 gap-3">
              {workoutPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleQuickLog('workout', preset.name)}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">{preset.icon}</div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{preset.name}</h4>
                  <p className="text-xs text-gray-600">{preset.calories} cal</p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-emerald-500 text-white text-xs py-1 px-2 rounded-full inline-flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Log It</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMealQuick && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Quick Log Meal</h3>
              <button
                onClick={() => setShowMealQuick(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Select a preset or tap to customize</p>
            <div className="grid grid-cols-2 gap-3">
              {mealPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleQuickLog('meal', preset.name)}
                  className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">{preset.icon}</div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{preset.name}</h4>
                  <p className="text-xs text-gray-600">{preset.calories} cal</p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-orange-500 text-white text-xs py-1 px-2 rounded-full inline-flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Log It</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
