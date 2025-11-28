import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, Clock, CheckCircle2, X } from 'lucide-react';
import { useProductivity } from '../../hooks/useProductivity';
import { format, isPast, isToday, isTomorrow, parseISO, addDays } from 'date-fns';

export default function NotificationBell() {
    const { tasks } = useProductivity();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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
    const hasUnread = notifications.length > 0; // Simplified for now

    const getDueLabel = (dateStr) => {
        const date = parseISO(dateStr);
        if (isPast(date) && !isToday(date)) return 'Overdue';
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM d');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
                <Bell className="w-6 h-6" />
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <span className="text-xs text-slate-500">{notifications.length} pending</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">All caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {notifications.map(task => {
                                    const label = getDueLabel(task.due_date);
                                    const isOverdue = label === 'Overdue';

                                    return (
                                        <div key={task.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-medium text-white line-clamp-1">{task.title}</h4>
                                                {isOverdue && (
                                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span className={isOverdue ? 'text-red-400' : ''}>
                                                    {label} • {format(parseISO(task.due_date), 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
