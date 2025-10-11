import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Droplets,
  X,
  Edit2,
  Trash2,
  Calendar,
  Flag,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  calculateGoalProgress,
  type Goal,
  type CreateGoalInput,
} from '../../lib/goalsService';

interface GoalFormData {
  name: string;
  description: string;
  category: string;
  target_value: string;
  current_value: string;
  unit: string;
  icon: string;
  color: string;
  target_date: string;
  priority: 'low' | 'medium' | 'high';
}

export default function GoalsManager() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'update-progress'>('create');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    description: '',
    category: 'fitness',
    target_value: '',
    current_value: '0',
    unit: '',
    icon: 'target',
    color: 'from-blue-600 to-green-600',
    target_date: '',
    priority: 'medium',
  });
  const [progressValue, setProgressValue] = useState('');

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getGoals(user.id);
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      target: Target,
      zap: Zap,
      droplets: Droplets,
      trending: TrendingUp,
      heart: Heart,
      award: Award,
    };
    return icons[iconName] || Target;
  };

  const categoryOptions = [
    { value: 'fitness', label: 'Fitness', icon: 'zap', color: 'from-orange-500 to-red-600' },
    { value: 'nutrition', label: 'Nutrition', icon: 'heart', color: 'from-red-500 to-pink-600' },
    { value: 'bodyweight', label: 'Body Weight', icon: 'target', color: 'from-blue-600 to-cyan-600' },
  ];

  const unitOptions: Record<string, string[]> = {
    fitness: ['meters', 'minutes', 'Kgs'],
    bodyweight: ['Kgs'],
    nutrition: ['Kcal', 'grams'],
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedGoal(null);
    setFormData({
      name: '',
      description: '',
      category: 'fitness',
      target_value: '',
      current_value: '0',
      unit: 'meters',
      icon: 'zap',
      color: 'from-orange-500 to-red-600',
      target_date: '',
      priority: 'medium',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setModalMode('edit');
    setSelectedGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      category: goal.category,
      target_value: goal.target_value.toString(),
      current_value: goal.current_value.toString(),
      unit: goal.unit,
      icon: goal.icon || 'target',
      color: goal.color || 'from-blue-600 to-green-600',
      target_date: goal.target_date || '',
      priority: goal.priority,
    });
    setShowModal(true);
  };

  const handleOpenUpdateProgress = (goal: Goal) => {
    setModalMode('update-progress');
    setSelectedGoal(goal);
    setProgressValue(goal.current_value.toString());
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (modalMode === 'create') {
        const newGoal: CreateGoalInput = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          target_value: parseFloat(formData.target_value),
          current_value: parseFloat(formData.current_value),
          unit: formData.unit,
          icon: formData.icon,
          color: formData.color,
          target_date: formData.target_date || undefined,
          priority: formData.priority,
        };
        await createGoal(user.id, newGoal);
      } else if (modalMode === 'edit' && selectedGoal) {
        await updateGoal(selectedGoal.id, user.id, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          target_value: parseFloat(formData.target_value),
          current_value: parseFloat(formData.current_value),
          unit: formData.unit,
          icon: formData.icon,
          color: formData.color,
          target_date: formData.target_date || undefined,
          priority: formData.priority,
        });
      } else if (modalMode === 'update-progress' && selectedGoal) {
        await updateGoalProgress(selectedGoal.id, user.id, parseFloat(progressValue));
      }

      await loadGoals();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!user || !confirm('Are you sure you want to delete this goal?')) return;

    try {
      await deleteGoal(goalId, user.id);
      await loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    const categoryOption = categoryOptions.find((opt) => opt.value === category);
    if (categoryOption) {
      const availableUnits = unitOptions[category] || [];
      setFormData((prev) => ({
        ...prev,
        category,
        icon: categoryOption.icon,
        color: categoryOption.color,
        unit: availableUnits[0] || prev.unit,
      }));
    }
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 pb-24">
      <div className="px-4 sm:px-6 pt-8 sm:pt-12 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Goals</h1>
            <p className="text-white/80 text-sm sm:text-base">Track your fitness objectives</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-emerald-700 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">New Goal</span>
          </button>
        </div>

        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center">
            <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Goals Yet</h3>
            <p className="text-white/80 mb-6">Create your first goal to start tracking your progress</p>
            <button
              onClick={handleOpenCreate}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <>
            {activeGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Active Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {activeGoals.map((goal) => {
                    const Icon = getIcon(goal.icon || 'target');
                    const percentage = calculateGoalProgress(goal.current_value, goal.target_value);
                    const remaining = goal.target_value - goal.current_value;

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOpenEdit(goal)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleDelete(goal.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{goal.name}</h3>
                        {goal.description && (
                          <p className="text-xs sm:text-sm text-white/70 mb-3">{goal.description}</p>
                        )}

                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-2xl sm:text-3xl font-bold text-white">{goal.current_value}</p>
                              <p className="text-xs sm:text-sm text-white/80">
                                of {goal.target_value} {goal.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                                {percentage.toFixed(0)}%
                              </p>
                              <p className="text-xs text-white/80">Progress</p>
                            </div>
                          </div>

                          <div className="h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-white/80">
                              {remaining > 0 ? `${remaining.toFixed(1)} ${goal.unit} to go` : 'Goal achieved!'}
                            </span>
                            <button
                              onClick={() => handleOpenUpdateProgress(goal)}
                              className="text-emerald-400 font-semibold hover:text-emerald-300 flex items-center space-x-1"
                            >
                              <span>Update</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {goal.target_date && (
                            <div className="flex items-center space-x-2 text-xs text-white/70 pt-2 border-t border-white/10">
                              <Calendar className="w-3 h-3" />
                              <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Completed Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {completedGoals.map((goal) => {
                    const Icon = getIcon(goal.icon || 'target');

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-emerald-500/30"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${goal.color} opacity-60 rounded-2xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center space-x-1">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Completed</span>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{goal.name}</h3>
                        <p className="text-xs sm:text-sm text-white/70">
                          {goal.current_value} / {goal.target_value} {goal.unit}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">
                      {completedGoals.length} Goal{completedGoals.length !== 1 ? 's' : ''} Completed!
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">Keep up the amazing work!</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {modalMode === 'create' && 'Create New Goal'}
                  {modalMode === 'edit' && 'Edit Goal'}
                  {modalMode === 'update-progress' && 'Update Progress'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalMode === 'update-progress' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Value ({selectedGoal?.unit})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={progressValue}
                      onChange={(e) => setProgressValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Target: {selectedGoal?.target_value} {selectedGoal?.unit}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Target Weight"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional details about your goal"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {categoryOptions.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.current_value}
                          onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.target_value}
                          onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      >
                        {(unitOptions[formData.category] || []).map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                      <input
                        type="date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    {modalMode === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
