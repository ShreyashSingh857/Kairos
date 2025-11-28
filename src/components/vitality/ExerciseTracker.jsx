import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Dumbbell, Activity, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { calculateExerciseCalories, EXERCISE_METS, GYM_EXERCISES } from '../../utils/fitnessCalculators';

export default function ExerciseTracker({ userWeight, onUpdate }) {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [date, setDate] = useState(new Date());

    // Form State
    const [mode, setMode] = useState('cardio'); // 'cardio' or 'gym'
    const [newLog, setNewLog] = useState({
        type: '',
        duration: '',
        calories: '',
        sets: '',
        reps: '',
        weight: ''
    });

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user, date]);

    // Auto-calculate calories
    useEffect(() => {
        if (userWeight && newLog.type) {
            let duration = 0;

            if (mode === 'gym' && newLog.sets) {
                // Estimate: 2.5 mins per set (lifting + rest)
                duration = parseInt(newLog.sets) * 2.5;
            } else if (mode === 'cardio' && newLog.duration) {
                duration = parseInt(newLog.duration);
            }

            if (duration > 0) {
                const calculated = calculateExerciseCalories(userWeight, newLog.type, duration);
                setNewLog(prev => ({ ...prev, calories: calculated }));
            }
        }
    }, [newLog.type, newLog.duration, newLog.sets, mode, userWeight]);

    const fetchLogs = async () => {
        setLoading(true);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const { data, error } = await supabase
            .from('exercise_logs')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', formattedDate)
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching exercise logs:', error);
        else setLogs(data || []);
        setLoading(false);
    };

    const syncDailyMetrics = async (updatedLogs) => {
        const totalBurned = updatedLogs.reduce((acc, log) => acc + (log.calories_burned || 0), 0);

        const { error } = await supabase
            .from('daily_metrics')
            .upsert({
                user_id: user.id,
                date: format(date, 'yyyy-MM-dd'),
                calories_burned: totalBurned
            }, { onConflict: 'user_id, date' });

        if (error) console.error('Error syncing daily metrics:', error);
        else if (onUpdate) onUpdate(); // Trigger refresh in parent
    };

    const handleAddLog = async (e) => {
        e.preventDefault();
        if (!newLog.type) return;

        // Determine duration
        let finalDuration = 0;
        if (mode === 'gym') {
            finalDuration = (parseInt(newLog.sets) || 0) * 2.5;
        } else {
            finalDuration = parseInt(newLog.duration) || 0;
        }

        if (finalDuration <= 0) {
            alert('Please enter valid duration or sets');
            return;
        }

        const { data, error } = await supabase
            .from('exercise_logs')
            .insert([{
                user_id: user.id,
                date: format(date, 'yyyy-MM-dd'),
                exercise_type: newLog.type,
                duration_minutes: Math.round(finalDuration),
                calories_burned: parseInt(newLog.calories) || 0,
                sets: mode === 'gym' ? (parseInt(newLog.sets) || 0) : null,
                reps: mode === 'gym' ? (parseInt(newLog.reps) || 0) : null,
                weight_lifted: mode === 'gym' ? (parseFloat(newLog.weight) || 0) : null
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding exercise log:', error);
            alert('Failed to add exercise log');
        } else {
            const updatedLogs = [...logs, data];
            setLogs(updatedLogs);
            syncDailyMetrics(updatedLogs);
            resetForm();
        }
    };

    const resetForm = () => {
        setNewLog({ type: '', duration: '', calories: '', sets: '', reps: '', weight: '' });
        setIsAdding(false);
    };

    const handleDeleteLog = async (id) => {
        const { error } = await supabase
            .from('exercise_logs')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting exercise log:', error);
        else {
            const updatedLogs = logs.filter(l => l.id !== id);
            setLogs(updatedLogs);
            syncDailyMetrics(updatedLogs);
        }
    };

    const totalCalories = logs.reduce((acc, log) => acc + (log.calories_burned || 0), 0);
    const totalDuration = logs.reduce((acc, log) => acc + (log.duration_minutes || 0), 0);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-blue-500" />
                    Exercise Tracker
                </h2>
                <input
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-center">
                    <p className="text-xs text-slate-500">Calories Burned</p>
                    <p className="text-lg font-bold text-orange-400">{totalCalories} kcal</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Active Minutes</p>
                    <p className="text-lg font-bold text-blue-400">{totalDuration} min</p>
                </div>
            </div>

            <div className="space-y-3">
                {logs.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No exercises logged today.</p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                            <div>
                                <p className="font-medium text-white">{log.exercise_type}</p>
                                <div className="flex gap-2 text-xs text-slate-500">
                                    <span>{log.duration_minutes} min</span>
                                    <span>•</span>
                                    <span>{log.calories_burned} kcal</span>
                                    {log.sets && (
                                        <>
                                            <span>•</span>
                                            <span className="text-blue-400">{log.sets} x {log.reps} @ {log.weight_lifted}kg</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}

                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Log Exercise
                </button>
            </div>

            {/* Add Log Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-xl w-full max-w-md border border-slate-800 p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Log Workout</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex bg-slate-950 p-1 rounded-lg mb-6 border border-slate-800">
                            <button
                                onClick={() => { setMode('cardio'); setNewLog({ ...newLog, sets: '', reps: '', weight: '' }); }}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'cardio' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Cardio
                            </button>
                            <button
                                onClick={() => { setMode('gym'); setNewLog({ ...newLog, duration: '' }); }}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'gym' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Gym / Weights
                            </button>
                        </div>

                        <form onSubmit={handleAddLog} className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Exercise Type</label>
                                <select
                                    value={newLog.type}
                                    onChange={e => setNewLog({ ...newLog, type: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Exercise</option>
                                    {mode === 'cardio' ? (
                                        Object.keys(EXERCISE_METS).filter(k => !GYM_EXERCISES.includes(k)).map(ex => (
                                            <option key={ex} value={ex}>{ex}</option>
                                        ))
                                    ) : (
                                        GYM_EXERCISES.map(ex => (
                                            <option key={ex} value={ex}>{ex}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {mode === 'cardio' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Duration (mins)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newLog.duration}
                                            onChange={e => setNewLog({ ...newLog, duration: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="30"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Calories (Est.)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newLog.calories}
                                            onChange={e => setNewLog({ ...newLog, calories: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="Auto"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                                        <div>
                                            <label className="block text-[10px] text-slate-400 mb-1">Sets</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newLog.sets}
                                                onChange={e => setNewLog({ ...newLog, sets: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                placeholder="3"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-slate-400 mb-1">Reps</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newLog.reps}
                                                onChange={e => setNewLog({ ...newLog, reps: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                placeholder="12"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-slate-400 mb-1">Weight (kg)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newLog.weight}
                                                onChange={e => setNewLog({ ...newLog, weight: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                placeholder="20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-slate-500 px-1">
                                        <span>Est. Duration: {newLog.sets ? Math.round(newLog.sets * 2.5) : 0} mins</span>
                                        <span>Est. Calories: {newLog.calories || 0} kcal</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Log Workout
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
