import React, { useState } from 'react';
import { Calendar, Trash2, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { useProjects } from '../../hooks/useProjects';
import ProjectDetails from './ProjectDetails';

export default function ProjectCard({ project }) {
    const { deleteProject } = useProjects();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject.mutate(project.id);
        }
    };

    return (
        <>
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                        {project.deadline && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Calendar className="w-3 h-3" />
                                <span>Due {format(new Date(project.deadline), 'MMM d, yyyy')}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleDelete}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                    <div className="mt-2 text-xs text-slate-500 text-right">
                        {project.completedMilestones}/{project.totalMilestones} Milestones
                    </div>
                </div>

                <button
                    onClick={() => setIsDetailsOpen(true)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <ListTodo className="w-4 h-4" />
                    Manage Milestones
                </button>
            </div>

            {isDetailsOpen && (
                <ProjectDetails
                    project={project}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}
        </>
    );
}
