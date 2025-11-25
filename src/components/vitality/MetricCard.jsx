import React from 'react';
import { Plus, Minus } from 'lucide-react';
import clsx from 'clsx';

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

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg", `bg-${color}-500/10 text-${color}-500`)}>
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
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={clsx("h-full rounded-full transition-all duration-500", `bg-${color}-500`)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
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
                    className={clsx(
                        "flex-1 py-2 rounded-lg transition-colors flex items-center justify-center text-white",
                        `bg-${color}-600 hover:bg-${color}-700`
                    )}
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
