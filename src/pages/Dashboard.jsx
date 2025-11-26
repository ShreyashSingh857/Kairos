import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckSquare, Activity, ArrowRight, AlertTriangle } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useProductivity } from '../hooks/useProductivity';
import { useVitality } from '../hooks/useVitality';
import { useProjects } from '../hooks/useProjects';

export default function Dashboard() {
    const { subjects } = useSubjects();
    const { tasks } = useProductivity();
    const { metrics } = useVitality();
    const { projects } = useProjects();

    const academicSubjects = subjects?.filter(s => s.category === 'academic') || [];
    const lowAttendanceSubjects = academicSubjects.filter(s => s.attendancePercentage < s.target_attendance);
    const selfLearningSubjects = subjects?.filter(s => s.category === 'self_learning') || [];
    const activeProjects = projects?.filter(p => p.status === 'active') || [];
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
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col hover:border-blue-500/50 transition-colors group h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <Link to="/academic" className="text-slate-500 hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-4">Academic</h2>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {academicSubjects.length === 0 ? (
                                <p className="text-slate-400 text-sm">No subjects added yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {academicSubjects.map(subject => (
                                        <div key={subject.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-medium text-white truncate pr-2">{subject.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subject.attendancePercentage < subject.target_attendance
                                                        ? 'bg-red-500/10 text-red-400'
                                                        : 'bg-green-500/10 text-green-400'
                                                    }`}>
                                                    {subject.attendancePercentage}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-400">
                                                <span>Attendance</span>
                                                <span>Target: {subject.target_attendance}%</span>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-slate-800/50 flex justify-between items-center text-xs">
                                                <span className="text-slate-400">Syllabus</span>
                                                <span className="text-white">
                                                    {subject.masteredChapters} / {subject.totalChapters} Ch.
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                        <h2 className="text-xl font-bold text-white mb-4">Productivity</h2>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Pending Tasks</span>
                                <span className="text-white font-bold text-lg">{pendingTasks.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Active Projects</span>
                                <span className="text-white font-bold text-lg">{activeProjects.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Skills Learning</span>
                                <span className="text-white font-bold text-lg">{selfLearningSubjects.length}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full"
                                    style={{ width: `${tasks?.length ? ((tasks.length - pendingTasks.length) / tasks.length) * 100 : 0}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1 text-right">Task Completion Rate</p>
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
