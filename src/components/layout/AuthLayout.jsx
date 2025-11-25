import React from 'react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Kairos</h1>
                    <p className="text-slate-400">Master your time, master your life.</p>
                </div>
                {children}
            </div>
        </div>
    );
}
