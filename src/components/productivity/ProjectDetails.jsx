import React, { useState } from 'react';
import { X, Plus, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { format } from 'date-fns';
import ResourceList from '../common/ResourceList';

export default function ProjectDetails({ project, onClose }) {
    const { addMilestone, updateMilestoneStatus, deleteMilestone } = useProjects();
    const [newMilestone, setNewMilestone] = useState({ title: '', due_date: '' });

    const handleAddMilestone = async (e) => {
        e.preventDefault();
        await addMilestone.mutateAsync({
            projectId: project.id,
            milestone: newMilestone
        });
        setNewMilestone({ title: '', due_date: '' });
    };

    const toggleStatus = (milestone) => {
        const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
        updateMilestoneStatus.mutate({ milestoneId: milestone.id, status: newStatus });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl w-full max-w-2xl border border-slate-800 max-h-[90vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{project.title}</h2>
                        <p className="text-slate-400 text-sm">{project.description}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Milestones Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            Milestones
                        </h3>

                        <div className="space-y-3 mb-6">
                            {project.milestones?.length === 0 ? (
                                <p className="text-slate-500 text-sm italic">No milestones yet.</p>
                            ) : (
                                project.milestones?.map(milestone => (
                                    <div key={milestone.id} className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 group">
                                        <button
                                            onClick={() => updateMilestoneStatus.mutate({
                                                milestoneId: milestone.id,
                                                status: milestone.status === 'completed' ? 'pending' : 'completed'
                                            })}
                                            className={`shrink-0 transition-colors ${milestone.status === 'completed' ? 'text-green-500' : 'text-slate-600 hover:text-slate-400'
                                                }`}
                                        >
                                            {milestone.status === 'completed' ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <Circle className="w-5 h-5" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${milestone.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
                                                }`}>
                                                {milestone.title}
                                            </p>
                                            {milestone.due_date && (
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(milestone.due_date), 'MMM d, yyyy')}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => deleteMilestone.mutate(milestone.id)}
                                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleAddMilestone} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New milestone..."
                                value={newMilestone.title}
                                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="date"
                                value={newMilestone.due_date}
                                onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Resources Section */}
                    <div className="pt-6 border-t border-slate-800">
                        <ResourceList projectId={project.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
