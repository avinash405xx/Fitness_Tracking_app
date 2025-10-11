import { useState, useEffect } from 'react';
import { Plus, Apple, Coffee, Sunrise, Moon, Pizza } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDate } from '../../contexts/DateContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { getTodaysMeals, addMeal, type Meal as MealType } from '../../lib/mealService';


export default function Meals() {
  const { user } = useAuth();
  const { selectedDate } = useDate();
  const { refreshData } = useDataRefresh();
  const [showAddModal, setShowAddModal] = useState(false);
  const [meals, setMeals] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    meal_type: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMeals();
  }, [user, selectedDate]);

  const loadMeals = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getTodaysMeals(user.id);
      setMeals(data);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || submitting) return;

    try {
      setSubmitting(true);
      await addMeal(user.id, {
        meal_type: formData.meal_type,
        name: formData.name,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fats: parseInt(formData.fats) || 0,
        fiber: parseInt(formData.fiber) || 0,
      });
      await loadMeals();
      refreshData();
      setShowAddModal(false);
      setFormData({
        name: '',
        meal_type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        fiber: '',
      });
    } catch (error) {
      console.error('Error adding meal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const mealTypes = [
    { name: 'Breakfast', icon: Sunrise, color: 'from-orange-400 to-orange-600' },
    { name: 'Lunch', icon: Pizza, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Dinner', icon: Moon, color: 'from-blue-400 to-blue-600' },
    { name: 'Snack', icon: Apple, color: 'from-emerald-400 to-emerald-600' },
  ];

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
  const totalFiber = meals.reduce((sum, meal) => sum + (meal.fiber || 0), 0);
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Calories Analysis</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl font-bold text-gray-900">{totalCalories}</p>
            <p className="text-gray-600">of {targetCalories} kcal</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              {Math.max(targetCalories - totalCalories, 0)}
            </p>
            <p className="text-sm text-gray-600">kcal remaining</p>
          </div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
            style={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Protein</p>
            <p className="text-2xl font-bold text-blue-600">{totalProtein}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Carbs</p>
            <p className="text-2xl font-bold text-orange-600">{totalCarbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Fats</p>
            <p className="text-2xl font-bold text-yellow-600">{totalFats}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Fiber</p>
            <p className="text-2xl font-bold text-green-600">{totalFiber}g</p>
          </div>
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
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading meals...</div>
        ) : meals.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No meals logged today</p>
            <p className="text-sm mt-2">Click "Log Meal" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {meal.meal_type} • {new Date(meal.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{meal.calories} cal</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
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
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Fiber</p>
                    <p className="text-sm font-semibold text-gray-900">{meal.fiber}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log New Meal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Salmon"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.meal_type}
                  onChange={(e) => setFormData({ ...formData, meal_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="400"
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="30"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="40"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    placeholder="15"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    value={formData.fiber}
                    onChange={(e) => setFormData({ ...formData, fiber: e.target.value })}
                    placeholder="5"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: '',
                      meal_type: 'breakfast',
                      calories: '',
                      protein: '',
                      carbs: '',
                      fats: '',
                      fiber: '',
                    });
                  }}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Log Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
