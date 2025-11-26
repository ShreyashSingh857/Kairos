import React, { useState } from 'react';
import { Plus, Loader2, ListTodo, FolderKanban, Brain } from 'lucide-react';
import { useProductivity } from '../hooks/useProductivity';
import { useSubjects } from '../hooks/useSubjects';
import { useProjects } from '../hooks/useProjects';
import KanbanBoard from '../components/productivity/KanbanBoard';
import ProjectCard from '../components/productivity/ProjectCard';
import SyllabusCard from '../components/academic/SyllabusCard';

export default function ProductivityHub() {
    const { tasks, isLoading: isTasksLoading, addTask, updateTaskStatus, deleteTask } = useProductivity();
    const { subjects, isLoading: isSubjectsLoading, addSubject } = useSubjects();
    const { projects, isLoading: isProjectsLoading, addProject } = useProjects();

    const [activeTab, setActiveTab] = useState('tasks');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '' });
    const [newProject, setNewProject] = useState({ title: '', description: '', deadline: '' });
    const [newSkill, setNewSkill] = useState({ name: '' });

    const handleAddTask = async (e) => {
        e.preventDefault();
        await addTask.mutateAsync({ ...newTask, status: 'todo' });
        setIsModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        await addProject.mutateAsync(newProject);
        setIsModalOpen(false);
        setNewProject({ title: '', description: '', deadline: '' });
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        await addSubject.mutateAsync({ ...newSkill, category: 'self_learning', credits: 0, target_attendance: 0 });
        setIsModalOpen(false);
        setNewSkill({ name: '' });
    };

    const isLoading = isTasksLoading || isSubjectsLoading || isProjectsLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const selfLearningSubjects = subjects?.filter(s => s.category === 'self_learning') || [];

    return (
        <div className="min-h-screen bg-slate-950 p-8 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Productivity Hub</h1>
                        <p className="text-slate-400">Manage your projects, tasks, and learning goals.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tasks'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <ListTodo className="w-4 h-4" />
                                Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'projects'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <FolderKanban className="w-4 h-4" />
                                Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('self_learning')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'self_learning'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <Brain className="w-4 h-4" />
                                Self Learning
                            </button>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {activeTab === 'tasks' ? 'Add Task' : activeTab === 'projects' ? 'Add Project' : 'Add Skill'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === 'tasks' && (
                        <KanbanBoard
                            tasks={tasks}
                            onStatusChange={(taskId, status) => updateTaskStatus.mutate({ taskId, status })}
                            onDeleteTask={(taskId) => deleteTask.mutate(taskId)}
                        />
                    )}

                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects?.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    No projects yet. Start building something!
                                </div>
                            ) : (
                                projects?.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'self_learning' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selfLearningSubjects.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    No learning goals yet. Add a skill to track!
                                </div>
                            ) : (
                                selfLearningSubjects.map(subject => (
                                    <SyllabusCard key={subject.id} subject={subject} />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Modals */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">
                                {activeTab === 'tasks' ? 'Add New Task' : activeTab === 'projects' ? 'Add New Project' : 'Add New Skill'}
                            </h2>

                            {activeTab === 'tasks' && (
                                <form onSubmit={handleAddTask} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                                            <select
                                                value={newTask.priority}
                                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                            <input
                                                type="date"
                                                value={newTask.due_date}
                                                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Create Task</button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'projects' && (
                                <form onSubmit={handleAddProject} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Project Title</label>
                                        <input
                                            type="text"
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                        <textarea
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Deadline</label>
                                        <input
                                            type="date"
                                            value={newProject.deadline}
                                            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Create Project</button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'self_learning' && (
                                <form onSubmit={handleAddSkill} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Skill / Topic Name</label>
                                        <input
                                            type="text"
                                            value={newSkill.name}
                                            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Start Learning</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
