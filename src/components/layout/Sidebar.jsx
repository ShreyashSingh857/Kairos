import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Activity, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

export default function Sidebar({ isOpen, onClose }) {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/academic', icon: BookOpen, label: 'Academic' },
        { to: '/productivity', icon: CheckSquare, label: 'Productivity' },
        { to: '/vitality', icon: Activity, label: 'Vitality' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                "fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
                        <img src="/logo.png" alt="Kairos Logo" className="w-10 h-10 rounded-lg drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        Kairos
                    </h1>
                    {/* Close Button for Mobile */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => onClose && onClose()} // Close sidebar on mobile when link clicked
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
