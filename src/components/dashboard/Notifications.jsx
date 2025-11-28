import React from 'react';
import { Bell, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useProductivity } from '../../hooks/useProductivity';
import { format, isPast, isToday, isTomorrow, parseISO, addDays } from 'date-fns';

export default function Notifications() {
    const { tasks } = useProductivity();

    const getNotifications = () => {
        if (!tasks) return [];

        const now = new Date();
        const upcoming = tasks.filter(task => {
            if (!task.due_date || task.status === 'done') return false;
            const due = parseISO(task.due_date);
            // Show tasks due within the next 3 days or overdue
            return due <= addDays(now, 3);
        });

        return upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    };

    const notifications = getNotifications();

    const getDueLabel = (dateStr) => {
        const date = parseISO(dateStr);
        if (isPast(date) && !isToday(date)) return 'Overdue';
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM d');
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-500" />
                    Notifications
                </h2>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                    {notifications.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>All caught up! No pending tasks.</p>
                    </div>
                ) : (
                    notifications.map(task => {
                        const label = getDueLabel(task.due_date);
                        const isOverdue = label === 'Overdue';

                        return (
                            <div key={task.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-medium text-white line-clamp-1">{task.title}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                                        {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        <span>{label} • {format(parseISO(task.due_date), 'h:mm a')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
