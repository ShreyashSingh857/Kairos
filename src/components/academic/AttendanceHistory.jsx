import React from 'react';
import { X, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useSubjects } from '../../hooks/useSubjects';
import { format } from 'date-fns';

export default function AttendanceHistory({ subject, onClose }) {
    const { deleteAttendanceLog, updateAttendanceLog } = useSubjects();

    const handleDelete = (logId) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            deleteAttendanceLog.mutate(logId);
        }
    };

    const handleToggleStatus = (log) => {
        const newStatus = log.status === 'present' ? 'absent' : 'present';
        updateAttendanceLog.mutate({ logId: log.id, status: newStatus });
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">Attendance History</h3>
                        <p className="text-sm text-slate-400">{subject.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {subject.attendance_logs?.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No attendance records found.
                        </div>
                    ) : (
                        subject.attendance_logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleStatus(log)}
                                        className={`p-2 rounded-lg transition-colors ${log.status === 'present'
                                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                            }`}
                                        title={`Click to change to ${log.status === 'present' ? 'Absent' : 'Present'}`}
                                    >
                                        {log.status === 'present' ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <XCircle className="w-5 h-5" />
                                        )}
                                    </button>
                                    <div>
                                        <p className="text-sm font-medium text-white capitalize">
                                            {log.status}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {format(new Date(log.created_at), 'MMM d, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(log.id)}
                                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Record"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
