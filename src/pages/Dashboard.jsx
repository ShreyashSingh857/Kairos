import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckSquare, Activity, ArrowRight, AlertTriangle } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useProductivity } from '../hooks/useProductivity';
import { useVitality } from '../hooks/useVitality';

export default function Dashboard() {
    const { subjects } = useSubjects();
    const { tasks } = useProductivity();
    const { metrics } = useVitality();

    const lowAttendanceSubjects = subjects?.filter(s => s.attendancePercentage < s.target_attendance) || [];
    const pendingTasks = tasks?.filter(t => t.status === 'todo' || t.status === 'in_progress') || [];
    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Good Day, Traveler</h1>
                    <p className="text-slate-400">Here is your daily overview.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Academic Widget */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col hover:border-blue-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <Link to="/academic" className="text-slate-500 hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Academic</h2>
                        <div className="flex-1">
                            {lowAttendanceSubjects.length > 0 ? (
                                <div className="flex items-start gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm">
                                        <span className="font-bold">{lowAttendanceSubjects.length} subjects</span> are below target attendance.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">Attendance is on track. Keep it up!</p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-sm text-slate-400">
                            <span>Total Subjects</span>
                            <span className="text-white font-medium">{subjects?.length || 0}</span>
                        </div>
                    </div>

                    {/* Productivity Widget */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col hover:border-green-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                                <CheckSquare className="w-6 h-6" />
                            </div>
                            <Link to="/productivity" className="text-slate-500 hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Productivity</h2>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Pending Tasks</span>
                                <span className="text-white font-bold text-lg">{pendingTasks.length}</span>
                            </div>
                            {highPriorityTasks.length > 0 && (
                                <div className="text-sm text-red-400 bg-red-400/10 px-2 py-1 rounded">
                                    {highPriorityTasks.length} High Priority
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full"
                                    style={{ width: `${tasks?.length ? ((tasks.length - pendingTasks.length) / tasks.length) * 100 : 0}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1 text-right">Completion Rate</p>
                        </div>
                    </div>

                    {/* Vitality Widget */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col hover:border-pink-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-lg">
                                <Activity className="w-6 h-6" />
                            </div>
                            <Link to="/vitality" className="text-slate-500 hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Vitality</h2>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Calories</p>
                                <p className="text-lg font-bold text-white">{metrics?.calories_consumed || 0}</p>
                                <p className="text-xs text-slate-600">/ 2500</p>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Water</p>
                                <p className="text-lg font-bold text-white">{metrics?.water_intake || 0}</p>
                                <p className="text-xs text-slate-600">ml</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800 text-sm text-slate-400">
                            Mood: <span className="text-white">{metrics?.mood_rating ? `${metrics.mood_rating}/5` : 'Not logged'}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
