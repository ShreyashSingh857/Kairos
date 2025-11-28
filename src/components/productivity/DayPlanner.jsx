import React, { useState, useEffect, useRef } from 'react';
import { format, isSameDay, parseISO, startOfDay, addDays, setHours, setMinutes, addMinutes, isWithinInterval } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock } from 'lucide-react';
import { useProductivity } from '../../hooks/useProductivity';

export default function DayPlanner() {
    const { tasks, addTask, updateTaskStatus } = useProductivity();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTime, setNewTaskTime] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState(15);

    const scrollRef = useRef(null);

    // Generate 15-minute slots
    const timeSlots = [];
    let currentTime = startOfDay(new Date());
    for (let i = 0; i < 96; i++) { // 24 * 4 = 96 slots
        timeSlots.push(currentTime);
        currentTime = addMinutes(currentTime, 15);
    }

    useEffect(() => {
        if (tasks) {
            const dayTasks = tasks.filter(task => {
                if (!task.due_date) return false;
                return isSameDay(parseISO(task.due_date), selectedDate);
            });
            setTodaysTasks(dayTasks);
        }
    }, [tasks, selectedDate]);

    // Scroll to current time on mount
    useEffect(() => {
        if (scrollRef.current) {
            const now = new Date();
            const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
            const pixelsPerMinute = 2; // Approximate height per minute
            // scrollRef.current.scrollTop = minutesSinceMidnight * pixelsPerMinute - 100;
        }
    }, []);

    const handlePrevDay = () => setSelectedDate(prev => addDays(prev, -1));
    const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

    const handleSlotClick = (time) => {
        setNewTaskTime(time);
        setNewTaskTitle('');
        setNewTaskDuration(15);
        setIsModalOpen(true);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTime || !newTaskTitle) return;

        // Construct due_date with selected date and time
        const dueDateTime = new Date(selectedDate);
        dueDateTime.setHours(newTaskTime.getHours());
        dueDateTime.setMinutes(newTaskTime.getMinutes());

        await addTask.mutateAsync({
            title: newTaskTitle,
            status: 'todo',
            priority: 'medium',
            due_date: dueDateTime.toISOString(),
            duration: parseInt(newTaskDuration)
        });

        setIsModalOpen(false);
    };

    const getTaskStyle = (task) => {
        const date = parseISO(task.due_date);
        const startMinutes = date.getHours() * 60 + date.getMinutes();
        const duration = task.duration || 15;

        // Each 15 min slot is 60px height (example)
        // So 1 min = 4px
        const pixelsPerMinute = 4;
        const top = (date.getMinutes() % 15) * pixelsPerMinute; // Offset within the slot
        const height = duration * pixelsPerMinute;

        return {
            height: `${height}px`,
            top: `${top}px`,
            zIndex: 10
        };
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 z-20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Day Planner
                </h2>
                <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
                    <button onClick={handlePrevDay} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-white w-24 text-center">
                        {format(selectedDate, 'EEE, MMM d')}
                    </span>
                    <button onClick={handleNextDay} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-950" ref={scrollRef}>
                {timeSlots.map((time, index) => {
                    const isHour = time.getMinutes() === 0;
                    const timeLabel = format(time, 'h:mm a');

                    // Find tasks that start in this slot
                    const slotTasks = todaysTasks.filter(task => {
                        const taskDate = parseISO(task.due_date);
                        return taskDate.getHours() === time.getHours() &&
                            taskDate.getMinutes() >= time.getMinutes() &&
                            taskDate.getMinutes() < time.getMinutes() + 15;
                    });

                    return (
                        <div key={index} className="flex group min-h-[60px] border-b border-slate-800/50 relative">
                            {/* Time Label */}
                            <div className={`w-20 shrink-0 text-right pr-3 py-2 text-xs border-r border-slate-800/50 ${isHour ? 'text-white font-medium' : 'text-slate-600'}`}>
                                {isHour || index % 2 === 0 ? timeLabel : ''}
                            </div>

                            {/* Slot Content */}
                            <div
                                className="flex-1 relative hover:bg-slate-900/30 transition-colors cursor-pointer"
                                onClick={() => handleSlotClick(time)}
                            >
                                {/* Add Button on Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <Plus className="w-4 h-4 text-slate-600" />
                                </div>

                                {/* Tasks */}
                                {slotTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateTaskStatus.mutate({
                                                taskId: task.id,
                                                status: task.status === 'done' ? 'todo' : 'done'
                                            });
                                        }}
                                        className={`absolute left-1 right-1 rounded px-2 py-1 text-xs border cursor-pointer overflow-hidden transition-all hover:z-20 ${task.status === 'done'
                                                ? 'bg-slate-800/80 border-slate-700 text-slate-500 line-through'
                                                : 'bg-blue-600/20 border-blue-500/50 text-blue-100 hover:bg-blue-600/30'
                                            }`}
                                        style={getTaskStyle(task)}
                                    >
                                        <div className="font-medium truncate">{task.title}</div>
                                        {task.duration > 15 && (
                                            <div className="opacity-70 truncate">{task.duration}m</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Current Time Indicator (if today) */}
                {isSameDay(selectedDate, new Date()) && (
                    <div
                        className="absolute left-20 right-0 border-t-2 border-red-500 z-20 pointer-events-none flex items-center"
                        style={{
                            top: `${(new Date().getHours() * 60 + new Date().getMinutes()) * 4}px` // Assuming 4px per min
                        }}
                    >
                        <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Add Task</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                                <div className="flex items-center gap-2 text-white bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    {newTaskTime && format(newTaskTime, 'h:mm a')}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="What needs to be done?"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Duration (minutes)</label>
                                <select
                                    value={newTaskDuration}
                                    onChange={(e) => setNewTaskDuration(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors mt-2"
                            >
                                Add Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
