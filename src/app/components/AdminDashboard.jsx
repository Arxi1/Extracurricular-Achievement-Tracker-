import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
    Trophy,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Users,
    Award,
    BarChart3,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    Target,
    FileText
} from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { Badge } from './ui/badge';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { achievements } = useAchievements();

    const totalAchievements = achievements.filter(a => a.status === 'approved').length;
    const pendingApprovals = achievements.filter(a => a.status === 'pending').length;

    const categories = ['Technical', 'Sports', 'Cultural', 'Leadership', 'Entrepreneurship', 'Social Service'];
    const categoryData = categories.map(cat => ({
        name: cat,
        count: achievements.filter(a => a.eventCategory === cat && a.status === 'approved').length
    })).filter(d => d.count > 0);

    const levelData = [
        { level: 'International', color: '#6366f1' },
        { level: 'National', color: '#8b5cf6' },
        { level: 'State', color: '#3b82f6' },
        { level: 'College', color: '#10b981' },
    ].map(l => ({
        name: l.level,
        value: achievements.filter(a => a.level === l.level && a.status === 'approved').length,
        color: l.color
    })).filter(d => d.value > 0);

    const recentAchievements = [...achievements]
        .filter(a => a.status === 'approved')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 animate-in fade-in duration-700"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <motion.h2 variants={item} className="text-3xl font-bold font-heading text-slate-900 tracking-tight">System Overview</motion.h2>
                    <motion.p variants={item} className="text-slate-500 font-medium mt-1">Real-time analytics and performance monitoring.</motion.p>
                </div>
                <motion.div variants={item} className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl h-11 border-slate-200 font-bold bg-white shadow-sm">
                        Generate PDF
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
                        Direct Message
                    </Button>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Claims', value: achievements.length, icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12% this week', trendColor: 'text-emerald-500' },
                    { label: 'Pending', value: pendingApprovals, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', trend: 'Requires attention', trendColor: 'text-amber-600' },
                    { label: 'Verified', value: totalAchievements, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '89.4% approval rate', trendColor: 'text-slate-400' },
                    { label: 'Avg / Student', value: (totalAchievements / 156 || 0).toFixed(1), icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0.2 from last term', trendColor: 'text-emerald-500' }
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/40 bg-white group hover:-translate-y-1 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", stat.trendColor)}>{stat.trend}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold font-heading text-slate-800 tracking-tight">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={item} className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-slate-50">
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-800 font-heading">Approval Volatility</CardTitle>
                                <p className="text-xs text-slate-400 font-medium mt-1">Submission frequency over the last 12 months</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-slate-400 hover:text-indigo-600">Weekly</Button>
                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">Monthly</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8 px-2">
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="adminBar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                            interval={0}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        />
                                        <Bar dataKey="count" fill="url(#adminBar)" radius={[6, 6, 6, 6]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-xl shadow-slate-200/40 bg-white">
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-slate-800">Quality Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={levelData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {levelData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                align="center"
                                                iconType="circle"
                                                formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-slate-200/40 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative h-full">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Users className="w-32 h-32" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Quick Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Key Metric</p>
                                    <p className="text-2xl font-bold leading-tight">Leadership & Sports are trending this term.</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                    <div className="p-2 bg-emerald-400 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold leading-none mb-1">+14.2% Growth</p>
                                        <p className="text-[10px] opacity-70 leading-none">compared to last month</p>
                                    </div>
                                </div>
                                <Button variant="link" className="text-white font-bold p-0 gap-2">
                                    View Deep Analysis <ChevronRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div variants={item} className="space-y-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-slate-50">
                            <CardTitle className="text-xl font-bold text-slate-800 font-heading">Recent Log</CardTitle>
                            <Button variant="link" className="text-indigo-600 font-bold p-0" onClick={() => navigate('/achievements')}>
                                Audit Board
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 pt-6">
                            <div className="space-y-6">
                                {recentAchievements.map((achievement, i) => (
                                    <div key={achievement.id} className="relative flex gap-4 group cursor-pointer">
                                        {i !== recentAchievements.length - 1 && (
                                            <div className="absolute left-6 top-12 bottom-[-24px] w-[2px] bg-slate-50" />
                                        )}
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${achievement.studentName}`}
                                                    className="w-full h-full object-cover rounded-xl"
                                                    alt="avt"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{achievement.studentName}</h4>
                                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                                    {new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 truncate mb-2">{achievement.eventName}</p>
                                            <Badge className="text-[9px] font-bold uppercase tracking-wider h-5 bg-indigo-50 text-indigo-600 border-none px-2">
                                                {achievement.level}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 mt-4">
                            <Card className="bg-slate-50 border-none p-5 rounded-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-800">Pending Review</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{pendingApprovals} achievements need your eyes.</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-indigo-600" onClick={() => navigate('/approvals')}>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Action Hub */}
            <motion.div variants={item}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Button
                        onClick={() => navigate('/achievements')}
                        className="h-24 bg-white border-2 border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-800 rounded-3xl shadow-sm transition-all flex flex-row items-center justify-start px-8 gap-5 group"
                    >
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-lg leading-none mb-1">Database</p>
                            <p className="text-xs text-slate-400 font-medium">Manage all student records</p>
                        </div>
                    </Button>
                    <Button
                        onClick={() => navigate('/approvals')}
                        className="h-24 bg-white border-2 border-slate-100 hover:border-amber-200 hover:bg-slate-50 text-slate-800 rounded-3xl shadow-sm transition-all flex flex-row items-center justify-start px-8 gap-5 group"
                    >
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                            <CheckCircle className="w-6 h-6" />
                            {pendingApprovals > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-lg leading-none mb-1">Queue</p>
                            <p className="text-xs text-slate-400 font-medium">Process pending approvals</p>
                        </div>
                    </Button>
                    <Button
                        onClick={() => navigate('/reports')}
                        className="h-24 bg-white border-2 border-slate-100 hover:border-emerald-200 hover:bg-slate-50 text-slate-800 rounded-3xl shadow-sm transition-all flex flex-row items-center justify-start px-8 gap-5 group"
                    >
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-lg leading-none mb-1">Reporting</p>
                            <p className="text-xs text-slate-400 font-medium">Generate academic analytics</p>
                        </div>
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
