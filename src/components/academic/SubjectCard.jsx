import React, { useState } from 'react';
import { Plus, Minus, BookOpen, Trash2, AlertTriangle } from 'lucide-react';
import AttendanceDial from './AttendanceDial';
import { useSubjects } from '../../hooks/useSubjects';
import SyllabusList from './SyllabusList';

export default function SubjectCard({ subject }) {
    const { markAttendance, deleteSubject } = useSubjects();
    const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleAttendance = (status) => {
        markAttendance.mutate({ subjectId: subject.id, status });
    };

    const handleDelete = () => {
        deleteSubject.mutate(subject.id);
    };

    return (
        <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">

                {/* Delete Button (Top Right) */}
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Subject"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-slate-900/95 z-10 flex flex-col items-center justify-center p-4 rounded-xl text-center animate-in fade-in duration-200">
                        <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                        <p className="text-white font-bold mb-1">Delete {subject.name}?</p>
                        <p className="text-xs text-slate-400 mb-4">This action cannot be undone.</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-3 py-1 text-sm text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-4 pr-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{subject.name}</h3>
                        <p className="text-sm text-slate-400">{subject.professor_name || 'No Professor'}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                                {subject.credits} Credits
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                                Target: {subject.target_attendance}%
                            </span>
                        </div>
                    </div>
                    <AttendanceDial percentage={subject.attendancePercentage} />
                </div>

                <div className="space-y-4">
                    {/* Study Progress Bar */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Syllabus Mastered</span>
                            <span>{subject.studyProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${subject.studyProgress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-950 rounded-lg p-3">
                        <span className="text-sm text-slate-400">Mark Attendance</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAttendance('present')}
                                className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="Present"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleAttendance('absent')}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Absent"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{subject.presentClasses} / {subject.totalClasses} Classes</span>
                        <button
                            onClick={() => setIsSyllabusOpen(true)}
                            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            Syllabus
                        </button>
                    </div>
                </div>
            </div>

            {isSyllabusOpen && (
                <SyllabusList subject={subject} onClose={() => setIsSyllabusOpen(false)} />
            )}
        </>
    );
}
