import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    );
}
