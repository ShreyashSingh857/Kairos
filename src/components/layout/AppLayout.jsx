import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 z-40">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-slate-400 hover:text-white p-2"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="ml-4 text-xl font-bold text-white">Kairos</span>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 md:ml-64 pt-16 md:pt-0 transition-all duration-300 w-full max-w-[100vw] overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
