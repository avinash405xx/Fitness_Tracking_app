import { motion } from 'framer-motion';
import { Droplet, Flame, Weight, Activity, Bell, Search, Plus, Edit2, Trash2, Target, ChevronRight, Coffee, Sun, Moon, Utensils } from 'lucide-react';
import { useState, useEffect } from 'react';
import CircularProgress from '../shared/CircularProgress';
import FitnessVideo from '../shared/FitnessVideo';
import Avatar from '../shared/Avatar';
import ChatBox from '../Chat/ChatBox';
import { useAuth } from '../../contexts/AuthContext';
import { getTodaysMeals, getTodayStats, addMeal, deleteMeal, updateMeal, type Meal } from '../../lib/mealService';
import { getWaterProgress } from '../../lib/waterService';
import { getGoals, calculateGoalProgress, type Goal } from '../../lib/goalsService';

interface DashboardBalancedProps {
  onNavigate: (page: string) => void;
}

export default function DashboardBalanced({ onNavigate }: DashboardBalancedProps) {
  const { user, profile } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [mealForm, setMealForm] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2300);
  const [waterPercentage, setWaterPercentage] = useState(0);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  const activities = [
    {
      title: 'Water Tracker',
      subtitle: 'Stay hydrated',
      videoUrl: 'https://videos.pexels.com/video-files/6985001/6985001-uhd_2560_1440_30fps.mp4',
      color: 'from-lime-400 to-lime-500',
    },
    {
      title: 'Daily Exercise',
      subtitle: 'Get moving',
      videoUrl: 'https://videos.pexels.com/video-files/4753989/4753989-uhd_2560_1440_30fps.mp4',
      color: 'from-blue-400 to-blue-500',
    },
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [mealsData, statsData, waterData, goalsData] = await Promise.all([
        getTodaysMeals(user.id),
        getTodayStats(user.id),
        getWaterProgress(user.id),
        getGoals(user.id),
      ]);

      setMeals(mealsData);
      setDailyStats(statsData);
      setWaterIntake(waterData.intake);
      setWaterGoal(waterData.goal);
      setWaterPercentage(waterData.percentage);
      setGoals(goalsData.filter(g => g.status === 'active').slice(0, 2));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealsByType = (type: 'breakfast' | 'lunch' | 'dinner') => {
    return meals.filter(meal => meal.meal_type === type);
  };

  const getTotalCaloriesByType = (type: 'breakfast' | 'lunch' | 'dinner') => {
    const typeMeals = getMealsByType(type);
    return typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const handleAddMeal = async () => {
    if (!user || !mealForm.name || mealForm.calories <= 0) return;

    try {
      if (editingMeal) {
        await updateMeal(editingMeal.id, user.id, mealForm);
      } else {
        await addMeal(user.id, {
          meal_type: selectedMealType,
          ...mealForm,
        });
      }

      await loadData();
      setShowMealModal(false);
      setMealForm({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
      setEditingMeal(null);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!user) return;

    try {
      await deleteMeal(mealId, user.id);
      await loadData();
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setSelectedMealType(meal.meal_type as 'breakfast' | 'lunch' | 'dinner');
    setMealForm({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      fiber: meal.fiber,
    });
    setShowMealModal(true);
  };

  const openAddMealModal = (type: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedMealType(type);
    setEditingMeal(null);
    setMealForm({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
    setShowMealModal(true);
  };

  const totalCalories = dailyStats?.calories_consumed || 0;
  const calorieIntakeGoal = goals.find(g => g.name.toLowerCase().includes('calorie') && g.category === 'nutrition');
  const calorieGoal = calorieIntakeGoal ? parseFloat(calorieIntakeGoal.target_value) : (dailyStats?.calories_goal || 2000);
  const caloriesBurned = dailyStats?.calories_burned || 0;
  const remainingCalories = (calorieGoal + caloriesBurned) - totalCalories;

  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);
  const totalFiber = meals.reduce((sum, meal) => sum + meal.fiber, 0);
  const totalMacros = totalProtein + totalCarbs + totalFats || 1;

  const proteinPercent = Math.round((totalProtein / totalMacros) * 100);
  const carbsPercent = Math.round((totalCarbs / totalMacros) * 100);
  const fatsPercent = Math.round((totalFats / totalMacros) * 100);

  const nutritionData = [
    { label: 'Protein', value: proteinPercent, color: 'bg-lime-400', amount: totalProtein },
    { label: 'Carbs', value: carbsPercent, color: 'bg-yellow-400', amount: totalCarbs },
    { label: 'Fats', value: fatsPercent, color: 'bg-red-400', amount: totalFats },
    { label: 'Fiber', value: totalFiber > 0 ? Math.min(Math.round((totalFiber / 30) * 100), 100) : 0, color: 'bg-green-500', amount: totalFiber },
  ];

  const calorieAnalysis = [
    { label: 'Carbs', value: carbsPercent, color: 'bg-yellow-400', amount: `${totalCarbs}g` },
    { label: 'Fats', value: fatsPercent, color: 'bg-red-400', amount: `${totalFats}g` },
    { label: 'Protein', value: proteinPercent, color: 'bg-blue-500', amount: `${totalProtein}g` },
    { label: 'Fiber', value: totalFiber > 0 ? Math.min(Math.round((totalFiber / 30) * 100), 100) : 0, color: 'bg-green-500', amount: `${totalFiber}g` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-screen overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-5 h-full">
        <div className="lg:col-span-6 overflow-y-auto px-4 py-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar src={profile?.avatar_url} alt={profile?.name || 'User'} size="md" />
              <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Search className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-5">Your Trackers</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-lime-400/10 border border-lime-400/20 rounded-xl p-4">
                <p className="text-lime-400 text-sm mb-1">
                  {remainingCalories > 0 ? 'Remaining' : 'Complete'}
                </p>
                <p className="text-4xl font-bold text-white">{Math.abs(remainingCalories)}</p>
                <p className="text-gray-400 text-sm">kcal</p>
                <div className="mt-3 pt-3 border-t border-lime-400/20 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-400">Goal</p>
                    <p className="text-sm font-semibold text-white">{calorieGoal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Eaten</p>
                    <p className="text-sm font-semibold text-white">{totalCalories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Burned</p>
                    <p className="text-sm font-semibold text-white">{caloriesBurned}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {nutritionData.map((item) => (
                    <div key={item.label} className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                      <p className="text-white text-3xl font-bold">{item.amount}</p>
                      <p className="text-gray-400 text-xs">grams</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 col-span-2">
                <h4 className="text-white font-semibold mb-3">Daily Targets</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <div className="flex items-center space-x-1 mb-2">
                      <Droplet className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400 text-xs">Water</span>
                    </div>
                    <p className="text-sm font-bold text-white">{waterIntake}/{waterGoal}</p>
                    <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full transition-all" style={{ width: `${waterPercentage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-400 text-xs">Calories</span>
                    </div>
                    <p className="text-sm font-bold text-white">{totalCalories}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-2">
                      <Weight className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400 text-xs">Weight</span>
                    </div>
                    <p className="text-sm font-bold text-white">{profile?.weight || '--'}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-2">
                      <Activity className="w-4 h-4 text-red-400" />
                      <span className="text-gray-400 text-xs">Steps</span>
                    </div>
                    <p className="text-sm font-bold text-white">{dailyStats?.steps || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {activities.map((activity, index) => (
                <motion.button
                  key={activity.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate(activity.title.toLowerCase())}
                  className="rounded-2xl p-5 text-left overflow-hidden relative h-32 shadow-lg"
                >
                  <FitnessVideo videoUrl={activity.videoUrl} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-70`} />
                  <div className="relative z-10">
                    <h4 className={`text-base font-bold mb-1 ${activity.color.includes('gray-800') ? 'text-white' : 'text-gray-900'}`}>
                      {activity.title}
                    </h4>
                    <p className={`text-sm ${activity.color.includes('gray-800') ? 'text-gray-300' : 'text-gray-600'}`}>
                      {activity.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 overflow-y-auto pb-24 lg:pb-4 px-4 py-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">My Meal Plan</h3>

            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="space-y-3">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const typeMeals = getMealsByType(mealType);
                const typeCalories = getTotalCaloriesByType(mealType);
                const MealIcon = mealType === 'breakfast' ? Coffee : mealType === 'lunch' ? Sun : Moon;

                return (
                  <div key={mealType} className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          mealType === 'breakfast' ? 'bg-amber-100' : mealType === 'lunch' ? 'bg-orange-100' : 'bg-indigo-100'
                        }`}>
                          <MealIcon className={`w-4 h-4 ${
                            mealType === 'breakfast' ? 'text-amber-600' : mealType === 'lunch' ? 'text-orange-600' : 'text-indigo-600'
                          }`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{mealType}</span>
                      </div>
                      <button
                        onClick={() => openAddMealModal(mealType)}
                        className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    {typeMeals.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {typeMeals.map((meal) => (
                          <div key={meal.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
                              {meal.image_url ? (
                                <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-lime-100 rounded-lg flex items-center justify-center">
                                  <Utensils className="w-5 h-5 text-lime-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{meal.name}</p>
                              <p className="text-xs text-gray-500">{meal.calories} kcal</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button onClick={() => handleEditMeal(meal)} className="p-1 hover:bg-gray-200 rounded">
                                <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              <button onClick={() => handleDeleteMeal(meal.id)} className="p-1 hover:bg-red-100 rounded">
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="text-xs text-gray-500 font-semibold">Total: {typeCalories} kcal</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {goals.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Your Goals</h3>
                <button onClick={() => onNavigate('goals')} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1">
                  <span>All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {goals.map((goal) => {
                  const progress = calculateGoalProgress(goal.current_value, goal.target_value, goal.category, goal.start_value);
                  const remaining = goal.target_value - goal.current_value;
                  return (
                    <div key={goal.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 bg-gradient-to-br ${goal.color} rounded-lg flex items-center justify-center`}>
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{goal.name}</h4>
                            <p className="text-xs text-gray-500">{goal.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900">{progress.toFixed(0)}%</p>
                          <p className="text-xs text-gray-500">{remaining > 0 ? `${remaining.toFixed(1)} ${goal.unit}` : 'Done!'}</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all`} style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 h-full overflow-hidden px-4 py-5">
          <ChatBox />
        </div>
      </div>

      {showMealModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingMeal ? 'Edit' : 'Add'} {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                <input
                  type="text"
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={mealForm.calories || ''}
                  onChange={(e) => setMealForm({ ...mealForm, calories: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={mealForm.protein || ''}
                    onChange={(e) => setMealForm({ ...mealForm, protein: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={mealForm.carbs || ''}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={mealForm.fats || ''}
                    onChange={(e) => setMealForm({ ...mealForm, fats: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    value={mealForm.fiber || ''}
                    onChange={(e) => setMealForm({ ...mealForm, fiber: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowMealModal(false);
                    setEditingMeal(null);
                    setMealForm({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button onClick={handleAddMeal} className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  {editingMeal ? 'Update' : 'Add'} Meal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
