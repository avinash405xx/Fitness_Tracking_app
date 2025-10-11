import { motion } from 'framer-motion';
import { Droplet, Flame, Weight, Activity, ChevronDown, Bell, Search, Plus, Edit2, Trash2, Target, ChevronRight, Coffee, Sun, Moon, Utensils } from 'lucide-react';
import { useState, useEffect } from 'react';
import CircularProgress from '../shared/CircularProgress';
import FitnessVideo from '../shared/FitnessVideo';
import Avatar from '../shared/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { getTodaysMeals, getTodayStats, addMeal, deleteMeal, updateMeal, type Meal } from '../../lib/mealService';
import { getWaterProgress } from '../../lib/waterService';
import { getGoals, calculateGoalProgress, type Goal } from '../../lib/goalsService';

interface DashboardModernProps {
  onNavigate: (page: string) => void;
}

export default function DashboardModern({ onNavigate }: DashboardModernProps) {
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
      subtitle: 'Stay hydrated, nature\'s best nutrient',
      videoUrl: 'https://videos.pexels.com/video-files/6985001/6985001-uhd_2560_1440_30fps.mp4',
      color: 'from-lime-400 to-lime-500',
    },
    {
      title: 'Daily Exercise',
      subtitle: 'Build strength and endurance',
      videoUrl: 'https://videos.pexels.com/video-files/4753989/4753989-uhd_2560_1440_30fps.mp4',
      color: 'from-white to-gray-100',
    },
    {
      title: 'Sleep Tracker',
      subtitle: 'Quality sleep for recovery',
      videoUrl: 'https://videos.pexels.com/video-files/5357416/5357416-uhd_2560_1440_30fps.mp4',
      color: 'from-gray-800 to-gray-900',
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
      setGoals(goalsData.filter(g => g.status === 'active').slice(0, 3));
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
    <div className="min-h-screen bg-gray-50">
      <div className="grid lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto">
        <div className="lg:col-span-1 bg-gray-900 rounded-3xl p-4 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </motion.button>
        </div>

        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.name || 'User'}
                size="md"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">Your Trackers</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <div className="bg-lime-400/10 border border-lime-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4">
                  <p className="text-lime-400 text-xs sm:text-sm mb-2">
                    {remainingCalories > 0
                      ? `Still need ${remainingCalories} calories to reach your goal!`
                      : 'You\'ve reached your calorie goal today!'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {remainingCalories > 0 ? 'Calories remaining' : 'Goal achieved'}
                  </p>
                  <div className="mt-3 sm:mt-4">
                    <p className="text-4xl sm:text-5xl font-bold text-white">
                      {Math.abs(remainingCalories)}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">kcal</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-lime-400/20">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-400">Goal</p>
                        <p className="text-sm font-semibold text-white">{calorieGoal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Consumed</p>
                        <p className="text-sm font-semibold text-white">{totalCalories}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Burned</p>
                        <p className="text-sm font-semibold text-white">{caloriesBurned}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {nutritionData.map((item) => (
                    <div key={item.label} className="flex flex-col items-center bg-white/5 rounded-xl p-3 sm:p-4">
                      <CircularProgress value={item.value} size={60} color={item.color} />
                      <p className="text-gray-400 text-xs mt-2">{item.label}</p>
                      <p className="text-white text-sm font-semibold">{item.amount}g</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">My Daily Target</h4>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs sm:text-sm">Water</span>
                    </div>
                    <p className="text-white text-xs mb-1">Total Goal</p>
                    <p className="text-base sm:text-lg font-bold text-white break-words">
                      {waterIntake}/{waterGoal}
                    </p>
                    <p className="text-xs text-gray-400">ml</p>
                    <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${waterPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs sm:text-sm">Calories</span>
                    </div>
                    <p className="text-white text-xs mb-1">Consumed</p>
                    <p className="text-base sm:text-lg font-bold text-white">{totalCalories}</p>
                    <p className="text-xs text-gray-400">kCal</p>
                  </div>

                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs sm:text-sm">Weight</span>
                    </div>
                    <p className="text-white text-xs mb-1">My Weight</p>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {profile?.weight || '--'}
                    </p>
                    <p className="text-xs text-gray-400">{profile?.weight ? 'kg' : ''}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs sm:text-sm">Steps</span>
                    </div>
                    <p className="text-white text-xs mb-1">Today</p>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {dailyStats?.steps || 0}
                    </p>
                    <p className="text-xs text-gray-400">steps</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">New Activity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {activities.map((activity, index) => (
                <motion.button
                  key={activity.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate(activity.title.toLowerCase())}
                  className={`rounded-3xl p-4 sm:p-6 text-left overflow-hidden relative h-40 sm:h-48`}
                >
                  <FitnessVideo
                    videoUrl={activity.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-70`} />
                  <div className="relative z-10">
                    <h4 className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${activity.color.includes('gray-800') ? 'text-white' : 'text-gray-900'}`}>
                      {activity.title}
                    </h4>
                    <p className={`text-xs sm:text-sm ${activity.color.includes('gray-800') ? 'text-gray-300' : 'text-gray-600'}`}>
                      {activity.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">My Meal Plan</h3>
            </div>

            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const typeMeals = getMealsByType(mealType);
                const typeCalories = getTotalCaloriesByType(mealType);
                const MealIcon = mealType === 'breakfast' ? Coffee : mealType === 'lunch' ? Sun : Moon;

                return (
                  <div key={mealType} className="border-b border-gray-100 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          mealType === 'breakfast' ? 'bg-amber-100' :
                          mealType === 'lunch' ? 'bg-orange-100' :
                          'bg-indigo-100'
                        }`}>
                          <MealIcon className={`w-4 h-4 ${
                            mealType === 'breakfast' ? 'text-amber-600' :
                            mealType === 'lunch' ? 'text-orange-600' :
                            'text-indigo-600'
                          }`} />
                        </div>
                        <span className="font-semibold text-gray-900 capitalize">{mealType}</span>
                      </div>
                      <button
                        onClick={() => openAddMealModal(mealType)}
                        className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    {typeMeals.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {typeMeals.map((meal) => (
                          <div key={meal.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                            <div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden">
                              {meal.image_url ? (
                                <img
                                  src={meal.image_url}
                                  alt={meal.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `
                                      <div class="w-full h-full bg-lime-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-lime-100 rounded-lg flex items-center justify-center">
                                  <Utensils className="w-6 h-6 text-lime-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                              <p className="text-xs text-gray-500">{meal.calories} kcal</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditMeal(meal)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Edit2 className="w-3 h-3 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="text-xs text-gray-500 font-semibold">
                          Total: {typeCalories} kcal
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Calories Analysis</h3>
            <div className="space-y-3">
              {calorieAnalysis.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {goals.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Your Goals</h3>
                <button
                  onClick={() => onNavigate('goals')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {goals.map((goal) => {
                  const progress = calculateGoalProgress(
                    goal.current_value,
                    goal.target_value,
                    goal.category,
                    goal.start_value
                  );
                  const remaining = goal.target_value - goal.current_value;

                  return (
                    <div
                      key={goal.id}
                      onClick={() => onNavigate('goals')}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${goal.color} rounded-lg flex items-center justify-center`}>
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                            <p className="text-xs text-gray-500">{goal.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{progress.toFixed(0)}%</p>
                          <p className="text-xs text-gray-500">{remaining > 0 ? `${remaining.toFixed(1)} ${goal.unit} left` : 'Complete!'}</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showMealModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
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
                <button
                  onClick={handleAddMeal}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
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
