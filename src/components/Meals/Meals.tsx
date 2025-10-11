import { useState } from 'react';
import { Plus, Apple, Coffee, Sunrise, Moon, Pizza } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

export default function Meals() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [meals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Oatmeal with Berries',
      type: 'Breakfast',
      calories: 320,
      protein: 12,
      carbs: 58,
      fats: 6,
      time: '08:30 AM',
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      type: 'Lunch',
      calories: 450,
      protein: 38,
      carbs: 32,
      fats: 18,
      time: '01:00 PM',
    },
    {
      id: '3',
      name: 'Protein Shake',
      type: 'Snack',
      calories: 180,
      protein: 25,
      carbs: 15,
      fats: 3,
      time: '04:30 PM',
    },
  ]);

  const mealTypes = [
    { name: 'Breakfast', icon: Sunrise, color: 'from-orange-400 to-orange-600' },
    { name: 'Lunch', icon: Pizza, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Dinner', icon: Moon, color: 'from-blue-400 to-blue-600' },
    { name: 'Snack', icon: Apple, color: 'from-emerald-400 to-emerald-600' },
  ];

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const targetCalories = 2000;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition</h1>
          <p className="text-gray-600">Track your daily meals and nutrients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Log Meal</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Calories</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl font-bold text-gray-900">{totalCalories}</p>
            <p className="text-gray-600">of {targetCalories} kcal</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              {targetCalories - totalCalories}
            </p>
            <p className="text-sm text-gray-600">kcal remaining</p>
          </div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
            style={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mealTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.name}
              className={`bg-gradient-to-br ${type.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105`}
              onClick={() => setShowAddModal(true)}
            >
              <Icon className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg">{type.name}</h3>
              <p className="text-white/80 text-sm mt-1">Quick add</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Meals</h2>
        <div className="space-y-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                  <p className="text-sm text-gray-600">
                    {meal.type} • {meal.time}
                  </p>
                </div>
                <span className="text-lg font-bold text-emerald-600">{meal.calories} cal</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Protein</p>
                  <p className="text-sm font-semibold text-gray-900">{meal.protein}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Carbs</p>
                  <p className="text-sm font-semibold text-gray-900">{meal.carbs}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Fats</p>
                  <p className="text-sm font-semibold text-gray-900">{meal.fats}g</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log New Meal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grilled Salmon"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                  {mealTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  placeholder="400"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    placeholder="40"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
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
                  Log Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
