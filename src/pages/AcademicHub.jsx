import React, { useState } from 'react';
import { Plus, Loader2, BookOpen, UserCheck, Globe, FileText, Image, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { usePublicResources } from '../hooks/useResources';
import SubjectCard from '../components/academic/SubjectCard';
import SyllabusCard from '../components/academic/SyllabusCard';

export default function AcademicHub() {
    const { subjects, isLoading, addSubject } = useSubjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSubject, setNewSubject] = useState({
        name: '',
        professor_name: '',
        credits: 3,
        target_attendance: 75,
        category: 'academic'
    });
    const [activeTab, setActiveTab] = useState('attendance');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSubject.mutateAsync(newSubject);
        setIsModalOpen(false);
        setNewSubject({
            name: '',
            professor_name: '',
            credits: 3,
            target_attendance: 75,
            category: 'academic'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    // Filter subjects based on active tab
    const academicSubjects = subjects?.filter(s => s.category === 'academic') || [];

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Academic Hub</h1>
                        <p className="text-slate-400">Track your attendance and master your subjects.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        {/* Tab Switcher */}
                        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex flex-wrap gap-1">
                            <button
                                onClick={() => setActiveTab('attendance')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'attendance'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <UserCheck className="w-4 h-4" />
                                Attendance
                            </button>
                            <button
                                onClick={() => setActiveTab('syllabus')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'syllabus'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Syllabus
                            </button>
                            <button
                                onClick={() => setActiveTab('public')}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'public'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <Globe className="w-4 h-4" />
                                Public Resources
                            </button>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Add Subject
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'attendance' && academicSubjects.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                    {activeTab === 'syllabus' && academicSubjects.map((subject) => (
                        <SyllabusCard key={subject.id} subject={subject} />
                    ))}
                    {activeTab === 'public' && (
                        <div className="col-span-full">
                            <PublicResourcesList />
                        </div>
                    )}
                </div>

                {academicSubjects.length === 0 && activeTab !== 'public' && (
                    <div className="text-center py-20 text-slate-500">
                        <p>No academic subjects found. Add one to get started!</p>
                    </div>
                )}

                {/* Add Subject Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">Add New Subject</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Professor Name</label>
                                    <input
                                        type="text"
                                        value={newSubject.professor_name}
                                        onChange={(e) => setNewSubject({ ...newSubject, professor_name: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Credits</label>
                                        <input
                                            type="number"
                                            value={newSubject.credits}
                                            onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Target %</label>
                                        <input
                                            type="number"
                                            value={newSubject.target_attendance}
                                            onChange={(e) => setNewSubject({ ...newSubject, target_attendance: parseInt(e.target.value) })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Create Subject
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PublicResourcesList() {
    const { publicResources, isLoading } = usePublicResources();

    if (isLoading) return <div className="text-center text-slate-500 py-10">Loading shared resources...</div>;

    if (!publicResources || publicResources.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium text-slate-400">No public resources yet</p>
                <p className="text-sm">Be the first to share notes with your institute!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicResources.map(resource => (
                <div key={resource.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                                {resource.type === 'pdf' ? <FileText className="w-5 h-5" /> :
                                    resource.type === 'image' ? <Image className="w-5 h-5" /> :
                                        <LinkIcon className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-medium text-white line-clamp-1" title={resource.title}>{resource.title}</h3>
                                <p className="text-xs text-slate-500 capitalize">{resource.type}</p>
                            </div>
                        </div>
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                        <div className="flex items-center gap-2">
                            {resource.profiles?.avatar_url ? (
                                <img src={resource.profiles.avatar_url} alt={resource.profiles.full_name} className="w-5 h-5 rounded-full" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {resource.profiles?.full_name?.[0]}
                                </div>
                            )}
                            <span className="text-xs text-slate-400">{resource.profiles?.full_name}</span>
                        </div>
                        <span className="text-xs text-slate-600">
                            {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
