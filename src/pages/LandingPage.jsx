import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Activity, BookOpen, Layout, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
    const { user } = useAuth();

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Kairos Logo" className="w-8 h-8 rounded-lg" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Kairos
                            </span>
                        </div>
                        <div>
                            <Link
                                to={user ? "/dashboard" : "/login"}
                                className="bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                {user ? "Go to Dashboard" : "Sign In"}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-sm mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v1.0 is now live
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Master Your Life <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                With Kairos
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                            The all-in-one student productivity ecosystem. Manage your academics, health, and projects in one beautiful, unified workspace.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to={user ? "/dashboard" : "/login"}
                                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                            >
                                Get Started Free <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-full font-medium transition-all"
                            >
                                Learn More
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Stop juggling multiple apps. Kairos brings your entire student life into one cohesive platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Layout className="w-32 h-32" />
                            </div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                                <Layout className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Productivity Hub</h3>
                            <p className="text-slate-400 mb-6">
                                Kanban boards, daily planners, and task management to keep your projects on track.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-blue-500" /> Smart Task Lists
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-blue-500" /> Project Tracking
                                </li>
                            </ul>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Activity className="w-32 h-32" />
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Vitality Hub</h3>
                            <p className="text-slate-400 mb-6">
                                Track your workouts, diet, and health metrics. A healthy body fuels a sharp mind.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Workout Logger
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Macro Tracking
                                </li>
                            </ul>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="w-32 h-32" />
                            </div>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Academic Hub</h3>
                            <p className="text-slate-400 mb-6">
                                Manage attendance, syllabus progress, and resources. Never miss a deadline again.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-purple-500" /> Attendance Manager
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-purple-500" /> Syllabus Tracker
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Kairos Logo" className="w-6 h-6 rounded-md grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <span className="font-bold text-slate-300">Kairos</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Kairos. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
