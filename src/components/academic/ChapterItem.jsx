// import React from 'react';
// import { CheckCircle2, Circle, Clock, BookOpen, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import ResourceList from '../common/ResourceList';

const STATUS_CONFIG = {
    not_started: { icon: Circle, color: 'text-slate-500', bg: 'bg-slate-500/10', label: 'Not Started' },
    learning: { icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Learning' },
    reviewing: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Reviewing' },
    mastered: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Mastered' },
};

export default function ChapterItem({ chapter, onUpdateStatus, onDelete }) {
    const currentConfig = STATUS_CONFIG[chapter.status] || STATUS_CONFIG.not_started;
    const Icon = currentConfig.icon;
    const [isExpanded, setIsExpanded] = useState(false);

    const cycleStatus = () => {
        const statuses = Object.keys(STATUS_CONFIG);
        const currentIndex = statuses.indexOf(chapter.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        onUpdateStatus(chapter.id, nextStatus);
    };

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group overflow-hidden">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={cycleStatus}
                        className={clsx(
                            "p-2 rounded-full transition-colors",
                            currentConfig.bg,
                            currentConfig.color
                        )}
                        title={`Current: ${currentConfig.label} (Click to cycle)`}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                    <span className={clsx(
                        "font-medium transition-colors",
                        chapter.status === 'mastered' ? "text-slate-500 line-through" : "text-slate-200"
                    )}>
                        {chapter.title}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={clsx(
                            "p-2 rounded-lg transition-colors",
                            isExpanded ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:text-slate-300"
                        )}
                        title="Toggle Resources"
                    >
                        <BookOpen className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDelete(chapter.id)}
                        className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Chapter"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="px-3 pb-3 pt-0 border-t border-slate-700/50 mt-2">
                    <div className="pt-4">
                        <ResourceList chapterId={chapter.id} />
                    </div>
                </div>
            )}
        </div>
    );
}
