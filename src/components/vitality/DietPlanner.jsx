import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function DietPlanner() {
    const { user } = useAuth();
    const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMeal, setNewMeal] = useState({ type: 'Breakfast', name: '', calories: '', protein: '', carbs: '', fats: '' });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMeals();
        }
    }, [user, selectedDay]);

    const fetchMeals = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('diet_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('day_of_week', selectedDay)
            .order('created_at', { ascending: true });

        if (error) console.error('Error fetching meals:', error);
        else setMeals(data || []);
        setLoading(false);
    };

    const handleAddMeal = async (e) => {
        e.preventDefault();
        if (!newMeal.name) return;

        const { data, error } = await supabase
            .from('diet_plans')
            .insert([{
                user_id: user.id,
                day_of_week: selectedDay,
                meal_type: newMeal.type,
                meal_name: newMeal.name,
                calories: parseInt(newMeal.calories) || 0,
                protein: parseInt(newMeal.protein) || 0,
                carbs: parseInt(newMeal.carbs) || 0,
                fats: parseInt(newMeal.fats) || 0
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding meal:', error);
            alert('Failed to add meal');
        } else {
            setMeals([...meals, data]);
            setNewMeal({ type: 'Breakfast', name: '', calories: '', protein: '', carbs: '', fats: '' });
            setIsAdding(false);
        }
    };

    const handleDeleteMeal = async (id) => {
        const { error } = await supabase
            .from('diet_plans')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting meal:', error);
        else setMeals(meals.filter(m => m.id !== id));
    };

    const getMealsByType = (type) => meals.filter(m => m.meal_type === type);

    const totalMacros = meals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-green-500" />
                    Diet Planner
                </h2>
                <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${selectedDay === day
                                ? 'bg-green-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-center">
                    <p className="text-xs text-slate-500">Calories</p>
                    <p className="text-lg font-bold text-white">{totalMacros.calories}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Protein</p>
                    <p className="text-lg font-bold text-blue-400">{totalMacros.protein}g</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Carbs</p>
                    <p className="text-lg font-bold text-orange-400">{totalMacros.carbs}g</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500">Fats</p>
                    <p className="text-lg font-bold text-yellow-400">{totalMacros.fats}g</p>
                </div>
            </div>

            <div className="space-y-6">
                {MEAL_TYPES.map(type => (
                    <div key={type}>
                        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">{type}</h3>
                        <div className="space-y-2">
                            {getMealsByType(type).map(meal => (
                                <div key={meal.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                                    <div>
                                        <p className="font-medium text-white">{meal.meal_name}</p>
                                        <p className="text-xs text-slate-500">
                                            {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteMeal(meal.id)}
                                        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    setNewMeal(prev => ({ ...prev, type }));
                                    setIsAdding(true);
                                }}
                                className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add {type}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Meal Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-xl w-full max-w-md border border-slate-800 p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Add {newMeal.type}</h3>
                        <form onSubmit={handleAddMeal} className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Meal Name</label>
                                <input
                                    type="text"
                                    value={newMeal.name}
                                    onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                    placeholder="e.g., Oatmeal with Berries"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Calories</label>
                                    <input
                                        type="number"
                                        value={newMeal.calories}
                                        onChange={e => setNewMeal({ ...newMeal, calories: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Protein (g)</label>
                                    <input
                                        type="number"
                                        value={newMeal.protein}
                                        onChange={e => setNewMeal({ ...newMeal, protein: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Carbs (g)</label>
                                    <input
                                        type="number"
                                        value={newMeal.carbs}
                                        onChange={e => setNewMeal({ ...newMeal, carbs: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Fats (g)</label>
                                    <input
                                        type="number"
                                        value={newMeal.fats}
                                        onChange={e => setNewMeal({ ...newMeal, fats: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Meal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
