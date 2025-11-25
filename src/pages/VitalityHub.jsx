import React from 'react';
import { Loader2, Flame, Droplets, Moon, Smile } from 'lucide-react';
import { useVitality } from '../hooks/useVitality';
import MetricCard from '../components/vitality/MetricCard';

export default function VitalityHub() {
    const { metrics, isLoading, updateMetric } = useVitality();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const handleUpdate = (field, value) => {
        updateMetric.mutate({ [field]: value });
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Vitality Hub</h1>
                    <p className="text-slate-400">Optimize your body and mind.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Calories */}
                    <MetricCard
                        title="Calories"
                        value={metrics?.calories_consumed || 0}
                        unit="kcal"
                        target={2500} // TODO: Fetch from profile
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
                        target={3000} // TODO: Fetch from profile
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

                    {/* Mood */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                                <Smile className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Mood</h3>
                                <p className="text-sm text-slate-400">Daily Check-in</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950 rounded-lg p-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleUpdate('mood_rating', rating)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${metrics?.mood_rating === rating
                                            ? 'bg-pink-600 text-white shadow-lg scale-110'
                                            : 'text-slate-500 hover:bg-slate-800'
                                        }`}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-center text-sm text-slate-400">
                            {metrics?.mood_rating ? `You're feeling a ${metrics.mood_rating}/5 today` : 'How are you feeling?'}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
