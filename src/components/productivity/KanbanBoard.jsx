import React from 'react';
import TaskCard from './TaskCard';
import clsx from 'clsx';

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'border-slate-500' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500' },
    { id: 'review', title: 'Review', color: 'border-purple-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
];

export default function KanbanBoard({ tasks, onStatusChange, onDeleteTask }) {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onStatusChange(taskId, status);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
            {COLUMNS.map((col) => {
                const colTasks = tasks?.filter((t) => t.status === col.id) || [];

                return (
                    <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className="flex flex-col h-full min-w-[250px] md:min-w-[280px]"
                    >
                        <div className={clsx("flex items-center justify-between mb-4 pb-2 border-b-2", col.color)}>
                            <h3 className="font-bold text-slate-300">{col.title}</h3>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                                {colTasks.length}
                            </span>
                        </div>

                        <div className="flex-1 bg-slate-900/50 rounded-xl p-3 space-y-3 min-h-[200px]">
                            {colTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onDelete={onDeleteTask}
                                />
                            ))}
                            {colTasks.length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-600 text-sm border-2 border-dashed border-slate-800 rounded-lg">
                                    Drop items here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
