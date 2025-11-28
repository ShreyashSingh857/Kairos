import React from 'react';
import { Plus, Minus } from 'lucide-react';
import clsx from 'clsx';

const COLORS = {
    orange: {
        iconBg: 'bg-orange-500/10',
        iconText: 'text-orange-500',
        bar: 'bg-orange-500'
    },
    blue: {
        iconBg: 'bg-blue-500/10',
        iconText: 'text-blue-500',
        bar: 'bg-blue-500'
    },
    indigo: {
        iconBg: 'bg-indigo-500/10',
        iconText: 'text-indigo-500',
        bar: 'bg-indigo-500'
    }
};

export default function MetricCard({
    title,
    value,
    unit,
    target,
    icon: Icon,
    color,
    onIncrease,
    onDecrease,
    step = 1
}) {
    const percentage = target ? Math.min((value / target) * 100, 100) : 0;
    const isCompleted = target && value >= target;
    const colorClasses = COLORS[color] || COLORS.blue;

    return (
        <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 flex flex-col justify-between hover:border-slate-700 transition-colors ${isCompleted ? 'border-green-500/30 bg-green-500/5' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg", colorClasses.iconBg, colorClasses.iconText)}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <p className="text-sm text-slate-400">Target: {target} {unit}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{value}</span>
                    <span className="text-sm text-slate-500 mb-1">{unit}</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                        className={clsx("h-full rounded-full transition-all duration-500", isCompleted ? 'bg-green-500' : colorClasses.bar)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {isCompleted && (
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1 animate-pulse">
                        🎉 Target Achieved!
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onDecrease(step)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center justify-center"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onIncrease(step)}
                    className="flex-1 py-2 rounded-lg transition-colors flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
