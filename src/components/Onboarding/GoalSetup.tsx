import { useState } from 'react';
import { Target, TrendingDown, Zap, Heart, Droplets, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

interface GoalSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

interface GoalTemplate {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  description: string;
  defaultCurrent: number;
  defaultTarget: number;
  unit: string;
  tips: string;
}

export default function GoalSetup({ onComplete, onBack }: GoalSetupProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [customValues, setCustomValues] = useState({ current: 0, target: 0 });

  const goalTemplates: GoalTemplate[] = [
    {
      id: 'weight-loss',
      name: 'Weight Loss',
      category: 'Body Composition',
      icon: TrendingDown,
      color: 'from-blue-500 to-blue-700',
      description: 'Lose weight and improve body composition',
      defaultCurrent: 70,
      defaultTarget: 65,
      unit: 'kg',
      tips: 'Aim for 0.5-1kg per week for sustainable results',
    },
    {
      id: 'workout-frequency',
      name: 'Weekly Workouts',
      category: 'Consistency',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      description: 'Build a consistent exercise routine',
      defaultCurrent: 0,
      defaultTarget: 4,
      unit: 'sessions/week',
      tips: 'Start with 3-4 sessions and gradually increase',
    },
    {
      id: 'cardio-endurance',
      name: 'Running Distance',
      category: 'Endurance',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      description: 'Improve cardiovascular fitness',
      defaultCurrent: 0,
      defaultTarget: 20,
      unit: 'km/week',
      tips: 'Increase distance by 10% each week',
    },
    {
      id: 'hydration',
      name: 'Daily Water',
      category: 'Nutrition',
      icon: Droplets,
      color: 'from-cyan-500 to-blue-600',
      description: 'Stay properly hydrated every day',
      defaultCurrent: 0,
      defaultTarget: 3,
      unit: 'liters/day',
      tips: 'Drink a glass of water with each meal',
    },
    {
      id: 'workout-duration',
      name: 'Active Minutes',
      category: 'Activity',
      icon: Clock,
      color: 'from-emerald-500 to-teal-600',
      description: 'Accumulate daily active time',
      defaultCurrent: 0,
      defaultTarget: 30,
      unit: 'min/day',
      tips: 'Break it up into smaller chunks if needed',
    },
  ];

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    setCustomValues({
      current: template.defaultCurrent,
      target: template.defaultTarget,
    });
    setStep(2);
  };

  const handleComplete = () => {
    console.log('Goal created:', { selectedTemplate, customValues });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={step === 1 ? onBack : () => setStep(1)}
              className="text-white/80 hover:text-white flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-green-400' : 'bg-white/30'}`} />
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-green-400' : 'bg-white/30'}`} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {step === 1 ? 'Choose Your First Goal' : 'Customize Your Goal'}
          </h1>
          <p className="text-white/80">
            {step === 1
              ? 'Select a goal template to get started quickly'
              : 'Set your starting point and target'}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goalTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border-2 border-white/20 hover:border-green-400 hover:shadow-xl transition-all text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                      <p className="text-sm text-white/80 mb-2">{template.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">
                          {template.category}
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold">
                          Popular choice →
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          selectedTemplate && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${selectedTemplate.color} rounded-2xl flex items-center justify-center`}
                >
                  {(() => {
                    const Icon = selectedTemplate.icon;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                  <p className="text-white/80">{selectedTemplate.description}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Pro Tip:</strong> {selectedTemplate.tips}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    What's your current value?
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={customValues.current}
                      onChange={(e) =>
                        setCustomValues({ ...customValues, current: parseFloat(e.target.value) })
                      }
                      className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl text-2xl font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      step="0.1"
                    />
                    <span className="text-white/80 font-medium min-w-[100px]">
                      {selectedTemplate.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    What's your target?
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={customValues.target}
                      onChange={(e) =>
                        setCustomValues({ ...customValues, target: parseFloat(e.target.value) })
                      }
                      className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl text-2xl font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      step="0.1"
                    />
                    <span className="text-white/80 font-medium min-w-[100px]">
                      {selectedTemplate.unit}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80">Progress to goal</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {customValues.target > 0
                        ? Math.min(
                            ((customValues.current / customValues.target) * 100).toFixed(0),
                            100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedTemplate.color} rounded-full transition-all`}
                      style={{
                        width: `${Math.min(
                          (customValues.current / customValues.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full mt-8 bg-emerald-600 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Complete Setup & Start Tracking</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
