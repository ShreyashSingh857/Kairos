import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function AttendanceDial({ percentage }) {
    const data = [
        { name: 'Present', value: percentage },
        { name: 'Absent', value: 100 - percentage },
    ];

    let color = '#22c55e'; // Green
    if (percentage < 75) color = '#eab308'; // Yellow
    if (percentage < 60) color = '#ef4444'; // Red

    return (
        <div className="relative w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={45}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        <Cell key="present" fill={color} />
                        <Cell key="absent" fill="#1e293b" /> {/* slate-800 */}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold`} style={{ color }}>
                    {percentage}%
                </span>
            </div>
        </div>
    );
}
