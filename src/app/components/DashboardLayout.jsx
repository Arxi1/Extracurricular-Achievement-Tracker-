import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
    Award,
    LayoutDashboard,
    Trophy,
    Upload,
    CheckCircle,
    BarChart,
    LogOut,
    User,
    Bell,
    Search,
    Settings,
    ChevronRight,
    Sparkles,
    Command,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminMenuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Trophy, label: 'Achievements', path: '/achievements' },
        { icon: CheckCircle, label: 'Approvals', path: '/approvals' },
        { icon: BarChart, label: 'Reports', path: '/reports' },
    ];

    const studentMenuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Trophy, label: 'My Track', path: '/my-achievements' },
        { icon: Upload, label: 'Submit New', path: '/upload' },
    ];

    const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className={cn(
                    "fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 lg:static lg:flex flex-col z-50 transition-transform duration-500 ease-spring shadow-2xl shadow-slate-200/50",
                    !isMobileMenuOpen && "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-4 mb-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl shadow-slate-200 ring-4 ring-slate-50 transition-transform group-hover:scale-105 group-hover:rotate-3">
                            <Award className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black font-heading text-slate-900 tracking-tighter">AchieveTrack</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    {user?.role} portal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-10 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group font-bold relative overflow-hidden",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-2xl shadow-slate-300"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarActive"
                                        className="absolute inset-0 bg-slate-900 -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon className={cn(
                                    "w-5 h-5 relative z-10 transition-all group-hover:scale-110",
                                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-900"
                                )} />
                                <span className="relative z-10">{item.label}</span>
                                {!isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
                        <div className="relative z-10">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6 shadow-lg border border-white/20">
                                <Sparkles className="w-5 h-5 text-indigo-100" />
                            </div>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Pro Feature</p>
                            <h4 className="text-lg font-black font-heading leading-tight mb-2">Portfolio Export</h4>
                            <p className="text-xs font-medium leading-relaxed opacity-80">
                                Generate high-resolution institutional transcripts in one click.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-24 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-100 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-12 w-12 rounded-2xl bg-slate-50 text-slate-600"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>

                        <div className="relative max-w-md w-full group hidden md:block">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transition-colors group-focus-within:text-slate-900" />
                            <input
                                type="text"
                                placeholder="Search database records..."
                                className="w-full h-14 bg-slate-50/50 border-none rounded-2xl pl-14 pr-4 text-sm focus:ring-4 focus:ring-slate-100 transition-all font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <Command className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 relative group transition-all">
                                <Bell className="w-6 h-6 group-hover:rotate-12" />
                                <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white" />
                            </Button>
                        </div>

                        <div className="h-10 w-[1px] bg-slate-100" />

                        <div className="flex items-center gap-5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{user?.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    {user?.role === 'student' ? user?.rollNumber : 'Security Admin'}
                                </p>
                            </div>

                            <div className="relative group p-1 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-700 overflow-hidden border-2 border-white">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 relative custom-scrollbar">
                    <div className="max-w-7xl mx-auto pb-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
