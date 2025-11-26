import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import SyllabusList from './SyllabusList';

export default function SyllabusCard({ subject }) {
    const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

    return (
        <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors relative group h-full">

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">{subject.name}</h3>
                    <p className="text-sm text-slate-400">{subject.professor_name || 'No Professor'}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                            {subject.totalChapters} Chapters
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                            {subject.masteredChapters} Mastered
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Study Progress Bar */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Syllabus Mastered</span>
                            <span>{subject.studyProgress}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${subject.studyProgress}%` }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSyllabusOpen(true)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        View Syllabus
                    </button>
                </div>
            </div>

            {isSyllabusOpen && (
                <SyllabusList subject={subject} onClose={() => setIsSyllabusOpen(false)} />
            )}
        </>
    );
}
