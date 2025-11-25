import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import SubjectCard from '../components/academic/SubjectCard';

export default function AcademicHub() {
    const { subjects, isLoading, addSubject } = useSubjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', professor_name: '', credits: 3, target_attendance: 75 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSubject.mutateAsync(newSubject);
        setIsModalOpen(false);
        setNewSubject({ name: '', professor_name: '', credits: 3, target_attendance: 75 });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Academic Hub</h1>
                        <p className="text-slate-400">Track your attendance and master your subjects.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Subject
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects?.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>

                {subjects?.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>No subjects yet. Add one to get started!</p>
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
