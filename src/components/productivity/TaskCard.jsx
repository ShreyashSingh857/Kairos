import React from 'react';
import { Calendar, Flag, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const PRIORITY_COLORS = {
    low: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    high: 'text-red-400 bg-red-400/10',
};

export default function TaskCard({ task, onDelete }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('taskId', task.id);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 cursor-move hover:border-slate-600 transition-colors group shadow-sm"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium line-clamp-2">{task.title}</h4>
                <button
                    onClick={() => onDelete(task.id)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {task.description && (
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between text-xs">
                <span className={clsx("px-2 py-1 rounded-full font-medium", PRIORITY_COLORS[task.priority])}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {task.due_date && (
                    <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
