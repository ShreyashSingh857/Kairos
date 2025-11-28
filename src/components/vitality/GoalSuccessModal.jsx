import React, { useEffect } from 'react';
import { Trophy, X, PartyPopper } from 'lucide-react';

export default function GoalSuccessModal({ metric, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto close after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-yellow-500/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full relative transform transition-all animate-scale-up text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex justify-center mb-6">
                    <div className="bg-yellow-500/20 p-4 rounded-full ring-4 ring-yellow-500/10">
                        <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Goal Crushed! 🚀</h2>
                <p className="text-slate-300 mb-6">
                    Congratulations! You've hit your daily <span className="text-yellow-400 font-bold">{metric}</span> target.
                </p>

                <div className="flex justify-center gap-2">
                    <PartyPopper className="w-6 h-6 text-pink-500 animate-pulse" />
                    <PartyPopper className="w-6 h-6 text-blue-500 animate-pulse delay-75" />
                    <PartyPopper className="w-6 h-6 text-green-500 animate-pulse delay-150" />
                </div>
            </div>
        </div>
    );
}
