import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useChapters } from '../../hooks/useChapters';
import ChapterItem from './ChapterItem';

export default function SyllabusList({ subject, onClose }) {
    const { chapters, isLoading, addChapter, updateStatus, deleteChapter } = useChapters(subject.id);
    const [newChapterTitle, setNewChapterTitle] = useState('');

    const handleAddChapter = async (e) => {
        e.preventDefault();
        if (!newChapterTitle.trim()) return;
        await addChapter.mutateAsync(newChapterTitle);
        setNewChapterTitle('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-xl w-full max-w-lg border border-slate-800 shadow-2xl flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">{subject.name} Syllabus</h2>
                        <p className="text-sm text-slate-400">Track your progress chapter by chapter</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Legend */}
                <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        <span>Not Started</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Learning</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Reviewing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Mastered</span>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : chapters?.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No chapters added yet. Start planning your syllabus!
                        </div>
                    ) : (
                        chapters?.map((chapter) => (
                            <ChapterItem
                                key={chapter.id}
                                chapter={chapter}
                                onUpdateStatus={(chapterId, status) => updateStatus.mutate({ chapterId, status })}
                                onDelete={(chapterId) => deleteChapter.mutate(chapterId)}
                            />
                        ))
                    )}
                </div>

                {/* Footer / Add Input */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <form onSubmit={handleAddChapter} className="flex gap-2">
                        <input
                            type="text"
                            value={newChapterTitle}
                            onChange={(e) => setNewChapterTitle(e.target.value)}
                            placeholder="Add new chapter..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={!newChapterTitle.trim() || addChapter.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
