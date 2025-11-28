import React, { useState, useEffect } from 'react';
import { Loader2, Flame, Droplets, Moon, Smile, RefreshCw, Utensils, Activity, HeartPulse } from 'lucide-react';
import { useVitality } from '../hooks/useVitality';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import MetricCard from '../components/vitality/MetricCard';
import GoalSuccessModal from '../components/vitality/GoalSuccessModal';
import DietPlanner from '../components/vitality/DietPlanner';
import DietTracker from '../components/vitality/DietTracker';
import ExerciseTracker from '../components/vitality/ExerciseTracker';
import { MOOD_DATA, getRandomQuote } from '../data/moodData';
import { calculateBMR, calculateTDEE } from '../utils/fitnessCalculators';

import { format } from 'date-fns';

export default function VitalityHub() {
    const { user } = useAuth();
    const { metrics, isLoading, updateMetric, refetch } = useVitality();
    const [targets, setTargets] = useState({ calories: 2000, hydration: 2500 });
    const [profile, setProfile] = useState(null);
    const [quote, setQuote] = useState('');
    const [successMetric, setSuccessMetric] = useState(null);
    const [activeTab, setActiveTab] = useState('metrics');
    const [bmr, setBmr] = useState(0);
    const [tdee, setTdee] = useState(0);
    const [todayExerciseBurn, setTodayExerciseBurn] = useState(0);

    const fetchExerciseSummary = async () => {
        if (!user) return;
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data, error } = await supabase
            .from('exercise_logs')
            .select('calories_burned')
            .eq('user_id', user.id)
            .eq('date', today);

        if (!error && data) {
            const total = data.reduce((acc, log) => acc + (log.calories_burned || 0), 0);
            setTodayExerciseBurn(total);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfileData();
            fetchExerciseSummary();
        }
    }, [user]);

    async function fetchProfileData() {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (data) {
            setProfile(data);
            setTargets({
                calories: data.caloric_target || 2000,
                hydration: data.hydration_target || 2500
            });

            // Calculate BMR & TDEE
            if (data.weight && data.height && data.gender && data.dob) {
                const calculatedBMR = calculateBMR(data.weight, data.height, data.gender, data.dob);
                setBmr(calculatedBMR);
                setTdee(calculateTDEE(calculatedBMR, data.activity_level || 'sedentary'));
            }
        }
    }

    // Set initial quote if mood exists
    useEffect(() => {
        if (metrics?.mood_rating && !quote) {
            setQuote(getRandomQuote(metrics.mood_rating));
        }
    }, [metrics?.mood_rating]);

    const handleRefresh = () => {
        refetch();
        fetchExerciseSummary();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const handleUpdate = (field, value) => {
        // Check for goal completion
        const oldValue = metrics?.[field] || 0;
        let target = 0;
        let label = '';

        if (field === 'calories_consumed') {
            target = targets.calories;
            label = 'Calories';
        } else if (field === 'water_intake') {
            target = targets.hydration;
            label = 'Hydration';
        } else if (field === 'sleep_hours') {
            target = 8;
            label = 'Sleep';
        }

        // Trigger only if we cross the threshold from below
        if (target > 0 && oldValue < target && value >= target) {
            setSuccessMetric(label);
        }

        updateMetric.mutate({ [field]: value });
        if (field === 'mood_rating') {
            setQuote(getRandomQuote(value));
        }
    };

    const currentMoodData = metrics?.mood_rating ? MOOD_DATA[metrics.mood_rating] : null;

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
            {successMetric && (
                <GoalSuccessModal
                    metric={successMetric}
                    onClose={() => setSuccessMetric(null)}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Vitality Hub</h1>
                        <p className="text-sm md:text-base text-slate-400">Optimize your body and mind.</p>
                    </div>

                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 flex-wrap gap-1 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('metrics')}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'metrics'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <Activity className="w-4 h-4" />
                            Daily Metrics
                        </button>
                        <button
                            onClick={() => setActiveTab('tracker')}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'tracker'
                                ? 'bg-orange-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <HeartPulse className="w-4 h-4" />
                            Fitness Tracker
                        </button>
                        <button
                            onClick={() => setActiveTab('diet')}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'diet'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <Utensils className="w-4 h-4" />
                            Meal Planner
                        </button>
                    </div>
                </div>

                {activeTab === 'metrics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">

                        {/* Calories */}
                        <MetricCard
                            title="Calories"
                            value={metrics?.calories_consumed || 0}
                            unit="kcal"
                            target={targets.calories}
                            icon={Flame}
                            color="orange"
                            step={50}
                            onIncrease={(step) => handleUpdate('calories_consumed', (metrics?.calories_consumed || 0) + step)}
                            onDecrease={(step) => handleUpdate('calories_consumed', Math.max(0, (metrics?.calories_consumed || 0) - step))}
                        />

                        {/* Water */}
                        <MetricCard
                            title="Hydration"
                            value={metrics?.water_intake || 0}
                            unit="ml"
                            target={targets.hydration}
                            icon={Droplets}
                            color="blue"
                            step={250}
                            onIncrease={(step) => handleUpdate('water_intake', (metrics?.water_intake || 0) + step)}
                            onDecrease={(step) => handleUpdate('water_intake', Math.max(0, (metrics?.water_intake || 0) - step))}
                        />

                        {/* Sleep */}
                        <MetricCard
                            title="Sleep"
                            value={metrics?.sleep_hours || 0}
                            unit="hrs"
                            target={8}
                            icon={Moon}
                            color="indigo"
                            step={0.5}
                            onIncrease={(step) => handleUpdate('sleep_hours', (metrics?.sleep_hours || 0) + step)}
                            onDecrease={(step) => handleUpdate('sleep_hours', Math.max(0, (metrics?.sleep_hours || 0) - step))}
                        />

                        {/* Mood Tracker */}
                        <div className={`border rounded-xl p-6 flex flex-col justify-between transition-all duration-500 ${currentMoodData ? currentMoodData.bg + ' ' + currentMoodData.border : 'bg-slate-900 border-slate-800'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${currentMoodData ? 'bg-white/20' : 'bg-pink-500/10 text-pink-500'}`}>
                                        <Smile className={`w-6 h-6 ${currentMoodData ? 'text-white' : ''}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Mood</h3>
                                        <p className={`text-sm ${currentMoodData ? 'text-white/80' : 'text-slate-400'}`}>
                                            {currentMoodData ? currentMoodData.label : 'Daily Check-in'}
                                        </p>
                                    </div>
                                </div>
                                {metrics?.mood_rating && (
                                    <span className="text-4xl animate-bounce">{currentMoodData.emoji}</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center bg-black/20 rounded-xl p-2 backdrop-blur-sm">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => handleUpdate('mood_rating', rating)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-300 ${metrics?.mood_rating === rating
                                            ? 'bg-white shadow-lg scale-110 -translate-y-1'
                                            : 'text-slate-500 hover:bg-white/10 hover:scale-105'
                                            }`}
                                        title={MOOD_DATA[rating].label}
                                    >
                                        {MOOD_DATA[rating].emoji}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 min-h-[60px] flex flex-col items-center justify-center text-center">
                                {quote ? (
                                    <div className="animate-fade-in">
                                        <p className={`text-sm font-medium italic mb-2 ${currentMoodData ? 'text-white' : 'text-slate-300'}`}>
                                            "{quote}"
                                        </p>
                                        <button
                                            onClick={() => setQuote(getRandomQuote(metrics.mood_rating))}
                                            className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1 mx-auto transition-opacity text-white"
                                        >
                                            <RefreshCw className="w-3 h-3" /> New Thought
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">How are you feeling today?</p>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'tracker' && (
                    <div className="animate-fade-in space-y-6">
                        {/* Fitness Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-medium text-slate-400 mb-1">Basal Metabolic Rate (BMR)</h3>
                                <p className="text-2xl font-bold text-white">{bmr > 0 ? `${bmr} kcal` : 'N/A'}</p>
                                <p className="text-xs text-slate-500 mt-1">Calories burned at rest</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-medium text-slate-400 mb-1">Total Spent Today</h3>
                                <p className="text-2xl font-bold text-orange-400">{bmr > 0 ? `${bmr + (todayExerciseBurn || metrics?.calories_burned || 0)} kcal` : 'N/A'}</p>
                                <p className="text-xs text-slate-500 mt-1">BMR + Exercise ({todayExerciseBurn || metrics?.calories_burned || 0})</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-medium text-slate-400 mb-1">TDEE (Maintenance)</h3>
                                <p className="text-2xl font-bold text-blue-400">{tdee > 0 ? `${tdee} kcal` : 'N/A'}</p>
                                <p className="text-xs text-slate-500 mt-1">Total daily energy expenditure</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-medium text-slate-400 mb-1">Target Calories</h3>
                                <p className="text-2xl font-bold text-green-400">{targets.calories} kcal</p>
                                <p className="text-xs text-slate-500 mt-1">Based on your goal: {profile?.fitness_goal?.replace('_', ' ') || 'Maintenance'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DietTracker onUpdate={handleRefresh} />
                            <ExerciseTracker userWeight={profile?.weight} onUpdate={handleRefresh} />
                        </div>
                    </div>
                )}

                {activeTab === 'diet' && (
                    <div className="animate-fade-in">
                        <DietPlanner />
                    </div>
                )}
            </div>
        </div>
    );
}
