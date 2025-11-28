import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { FOOD_DATABASE } from '../../data/foodDatabase';

export default function DietTracker({ onUpdate }) {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dailyTotals, setDailyTotals] = useState(null);

    // Form State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [portionSize, setPortionSize] = useState('');
    const [newLog, setNewLog] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user, date]);

    // Search Logic
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        const results = FOOD_DATABASE.filter(food =>
            food.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm]);

    const fetchLogs = async () => {
        setLoading(true);
        const formattedDate = format(date, 'yyyy-MM-dd');

        // Fetch Logs
        const { data: logsData, error: logsError } = await supabase
            .from('food_logs')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', formattedDate)
            .order('created_at', { ascending: true });

        if (logsError) console.error('Error fetching food logs:', logsError);
        else setLogs(logsData || []);

        // Fetch Daily Metrics (for totals if logs are archived)
        const { data: metricsData, error: metricsError } = await supabase
            .from('daily_metrics')
            .select('calories_consumed, protein_consumed, carbs_consumed, fats_consumed')
            .eq('user_id', user.id)
            .eq('date', formattedDate)
            .single();

        if (!metricsError && metricsData) {
            setDailyTotals({
                calories: metricsData.calories_consumed || 0,
                protein: metricsData.protein_consumed || 0,
                carbs: metricsData.carbs_consumed || 0,
                fats: metricsData.fats_consumed || 0
            });
        } else {
            setDailyTotals(null);
        }

        setLoading(false);
    };

    const handleFoodSelect = (food) => {
        setSelectedFood(food);
        setSearchTerm(food.name);
        setSearchResults([]);
        setPortionSize(food.default_size);

        // Initial Calculation
        calculateMacros(food, food.default_size);
    };

    const calculateMacros = (food, size) => {
        if (!food || !size) return;

        const multiplier = size / food.default_size;

        setNewLog({
            name: food.name,
            calories: Math.round(food.calories * multiplier),
            protein: Math.round(food.protein * multiplier),
            carbs: Math.round(food.carbs * multiplier),
            fats: Math.round(food.fats * multiplier)
        });
    };

    const handlePortionChange = (e) => {
        const val = parseFloat(e.target.value);
        setPortionSize(val);
        if (selectedFood) {
            calculateMacros(selectedFood, val);
        }
    };

    const syncDailyMetrics = async (updatedLogs) => {
        const totals = updatedLogs.reduce((acc, log) => ({
            calories: acc.calories + (log.calories || 0),
            protein: acc.protein + (log.protein || 0),
            carbs: acc.carbs + (log.carbs || 0),
            fats: acc.fats + (log.fats || 0)
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        // Update local state for immediate feedback
        setDailyTotals(totals);

        const { error } = await supabase
            .from('daily_metrics')
            .upsert({
                user_id: user.id,
                date: format(date, 'yyyy-MM-dd'),
                calories_consumed: totals.calories,
                protein_consumed: totals.protein,
                carbs_consumed: totals.carbs,
                fats_consumed: totals.fats
            }, { onConflict: 'user_id, date' });

        if (error) console.error('Error syncing daily metrics:', error);
        else if (onUpdate) onUpdate(); // Trigger refresh in parent
    };

    const handleAddLog = async (e) => {
        e.preventDefault();
        if (!newLog.name) return;

        const { data, error } = await supabase
            .from('food_logs')
            .insert([{
                user_id: user.id,
                date: format(date, 'yyyy-MM-dd'),
                food_name: newLog.name,
                calories: parseInt(newLog.calories) || 0,
                protein: parseInt(newLog.protein) || 0,
                carbs: parseInt(newLog.carbs) || 0,
                fats: parseInt(newLog.fats) || 0
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding food log:', error);
            toast.error('Failed to add food log');
        } else {
            const updatedLogs = [...logs, data];
            setLogs(updatedLogs);
            syncDailyMetrics(updatedLogs);
            resetForm();
        }
    };

    const resetForm = () => {
        setNewLog({ name: '', calories: '', protein: '', carbs: '', fats: '' });
        setSearchTerm('');
        setSelectedFood(null);
        setPortionSize('');
        setIsAdding(false);
    };

    const handleDeleteLog = async (id) => {
        const { error } = await supabase
            .from('food_logs')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting food log:', error);
        else {
            const updatedLogs = logs.filter(l => l.id !== id);
            setLogs(updatedLogs);
            syncDailyMetrics(updatedLogs);
        }
    };

    // Use logs for calculation if available, otherwise fallback to dailyTotals (archived data)
    const calculatedTotals = logs.reduce((acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fats: acc.fats + (log.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const displayMacros = logs.length > 0 ? calculatedTotals : (dailyTotals || calculatedTotals);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-green-500" />
                    Diet Tracker
                </h2>
                <input
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-green-500"
                />
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6 bg-slate-950 p-3 md:p-4 rounded-lg border border-slate-800">
                <div className="text-center">
                    <p className="text-xs text-slate-500">Calories</p>
                    <p className="text-lg font-bold text-white">{displayMacros.calories}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Protein</p>
                    <p className="text-lg font-bold text-blue-400">{displayMacros.protein}g</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Carbs</p>
                    <p className="text-lg font-bold text-orange-400">{displayMacros.carbs}g</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Fats</p>
                    <p className="text-lg font-bold text-yellow-400">{displayMacros.fats}g</p>
                </div>
            </div>

            <div className="space-y-3">
                {logs.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">
                        {dailyTotals && dailyTotals.calories > 0
                            ? "Detailed logs archived. Showing daily totals."
                            : "No food logged for this day."}
                    </p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                            <div>
                                <p className="font-medium text-white">{log.food_name}</p>
                                <p className="text-xs text-slate-500">
                                    {log.calories} kcal • P: {log.protein}g • C: {log.carbs}g • F: {log.fats}g
                                </p>
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
                    <Plus className="w-4 h-4" /> Log Food
                </button>
            </div>

            {/* Add Log Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-xl w-full max-w-md border border-slate-800 p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Log Food</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleAddLog} className="space-y-4">
                            {/* Search Input */}
                            <div className="relative">
                                <label className="block text-xs text-slate-400 mb-1">Search Food</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => {
                                            setSearchTerm(e.target.value);
                                            setSelectedFood(null); // Reset selection on type
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-green-500"
                                        placeholder="Type to search (e.g. Roti, Rice)..."
                                        autoFocus
                                    />
                                </div>
                                {/* Dropdown */}
                                {searchResults.length > 0 && !selectedFood && (
                                    <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                        {searchResults.map((food, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleFoodSelect(food)}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white border-b border-slate-700/50 last:border-0"
                                            >
                                                <span className="font-medium text-white">{food.name}</span>
                                                <span className="text-xs text-slate-500 ml-2">({food.calories} kcal / {food.default_size} {food.unit})</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Portion Size (Only if food selected) */}
                            {selectedFood && (
                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <label className="block text-xs text-green-400 mb-1 font-medium">
                                        Portion Size ({selectedFood.unit})
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={portionSize}
                                            onChange={handlePortionChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                        />
                                        <span className="text-sm text-slate-400">{selectedFood.unit}</span>
                                    </div>
                                </div>
                            )}

                            {/* Manual Entry Fallback / Display */}
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Food Name (Custom)</label>
                                <input
                                    type="text"
                                    value={newLog.name}
                                    onChange={e => setNewLog({ ...newLog, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                    placeholder="Or type custom name..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Cals</label>
                                    <input
                                        type="number"
                                        value={newLog.calories}
                                        onChange={e => setNewLog({ ...newLog, calories: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Prot</label>
                                    <input
                                        type="number"
                                        value={newLog.protein}
                                        onChange={e => setNewLog({ ...newLog, protein: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Carb</label>
                                    <input
                                        type="number"
                                        value={newLog.carbs}
                                        onChange={e => setNewLog({ ...newLog, carbs: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-slate-400 mb-1">Fat</label>
                                    <input
                                        type="number"
                                        value={newLog.fats}
                                        onChange={e => setNewLog({ ...newLog, fats: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                                    />
                                </div>
                            </div>

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
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Log Food
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
