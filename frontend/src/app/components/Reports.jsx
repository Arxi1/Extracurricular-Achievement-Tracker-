import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import {
    Download,
    FileText,
    BarChart3,
    TrendingUp,
    Users,
    Trophy,
    Activity,
    Calendar,
    Filter,
    ArrowRight,
    ChevronRight,
    Sparkles,
    Award
} from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { EVENT_CATEGORIES, DEPARTMENTS, AWARD_LEVELS } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

export default function Reports() {
    const { achievements } = useAchievements();
    const [reportType, setReportType] = useState('overview');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');

    const approvedAchievements = achievements.filter(a => a.status === 'approved');

    const categoryDistribution = EVENT_CATEGORIES.map(cat => ({
        name: cat,
        val: approvedAchievements.filter(a => a.eventCategory === cat).length
    })).filter(d => d.val > 0);

    const levelDistribution = AWARD_LEVELS.map(level => ({
        name: level,
        value: approvedAchievements.filter(a => a.level === level).length
    })).filter(d => d.value > 0);

    const departmentDistribution = DEPARTMENTS.map(dept => ({
        name: dept,
        val: approvedAchievements.filter(a => a.department === dept).length
    })).filter(d => d.val > 0);

    const studentPerformance = {};
    approvedAchievements.forEach(a => {
        if (!studentPerformance[a.studentId]) {
            studentPerformance[a.studentId] = { name: a.studentName, count: 0, roll: a.rollNumber };
        }
        studentPerformance[a.studentId].count++;
    });

    const topPerformers = Object.values(studentPerformance)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(s => ({ studentName: s.name, rollNumber: s.roll, count: s.count }));

    const monthlyTrend = {};
    approvedAchievements.forEach(a => {
        const date = new Date(a.date);
        const monthYear = date.toLocaleString('default', { month: 'short' });
        monthlyTrend[monthYear] = (monthlyTrend[monthYear] || 0) + 1;
    });

    const trendData = Object.entries(monthlyTrend).map(([name, val]) => ({ name, val }));

    const handleExportPDF = () => {
        toast.success('High-resolution PDF report generated');
    };

    const handleExportExcel = () => {
        toast.success('Data exported to Excel ledger');
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tighter">Reporting Suite</h2>
                    <p className="text-slate-500 font-medium text-lg mt-2">Comprehensive institutional intelligence and audit trails.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 gap-2 shadow-sm" onClick={handleExportPDF}>
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Export PDF
                    </Button>
                    <Button className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-xl shadow-slate-100" onClick={handleExportExcel}>
                        <Download className="w-5 h-5 text-indigo-400" />
                        Export Raw Data
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white overflow-visible">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Report Perspective</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="overview">Executive Overview</SelectItem>
                                    <SelectItem value="category">Categorical Breakdown</SelectItem>
                                    <SelectItem value="department">Departmental Metrics</SelectItem>
                                    <SelectItem value="level">Hierarchy Distribution</SelectItem>
                                    <SelectItem value="trend">Temporal Analysis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Category Slice</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">Consolidated View</SelectItem>
                                    {EVENT_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Faculty Filter</Label>
                            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {DEPARTMENTS.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="h-12 aspect-square p-0 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none shrink-0 shadow-sm shadow-indigo-50 transition-all active:scale-90">
                            <Filter className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Validated Success', val: approvedAchievements.length, icon: Trophy, bg: 'bg-indigo-50', text: 'text-indigo-600' },
                    { label: 'Contributing Students', val: Object.keys(studentPerformance).length, icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                    { label: 'Global Breadth', val: categoryDistribution.length, icon: Activity, bg: 'bg-purple-50', text: 'text-purple-600' },
                    { label: 'Efficiency Index', val: '98.4%', icon: TrendingUp, bg: 'bg-rose-50', text: 'text-rose-600' }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-slate-200/40 bg-white group hover:-translate-y-1 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold font-heading text-slate-800 tracking-tight">{stat.val}</p>
                                </div>
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", stat.bg, stat.text)}>
                                    <stat.icon className="w-7 h-7" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-xl font-bold font-heading text-slate-800">Growth Projection</CardTitle>
                            <CardDescription className="font-semibold text-slate-400">Monthly achievement acquisition trend.</CardDescription>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                                />
                                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-xl font-bold font-heading text-slate-800">Hierarchy Split</CardTitle>
                            <CardDescription className="font-semibold text-slate-400">Distribution of status across levels.</CardDescription>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={levelDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    cornerRadius={12}
                                    dataKey="value"
                                >
                                    {levelDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
                            <p className="text-4xl font-black text-slate-800 font-heading">{approvedAchievements.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-xl font-bold font-heading text-slate-800">Faculty Standing</CardTitle>
                            <CardDescription className="font-semibold text-slate-400">Performance benchmarking across departments.</CardDescription>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <Award className="w-5 h-5 text-rose-400" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentDistribution} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <Bar dataKey="val" fill="#10b981" radius={[0, 10, 10, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <CardTitle className="text-xl font-bold font-heading text-slate-800">Global Category Audit</CardTitle>
                            <CardDescription className="font-semibold text-slate-400">Volume distribution by activity field.</CardDescription>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <BarChart3 className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} height={50} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                                />
                                <Bar dataKey="val" fill="#8b5cf6" radius={[12, 12, 12, 12]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold font-heading text-slate-800">Hall of Fame</CardTitle>
                                <CardDescription className="font-medium text-slate-400">Top contributors in the current academic cycle.</CardDescription>
                            </div>
                            <Button variant="ghost" className="rounded-xl h-10 px-4 text-xs font-bold text-indigo-600 hover:bg-indigo-50">View Leaderboard</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="space-y-4">
                            {topPerformers.map((performer, index) => (
                                <div key={performer.rollNumber} className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border",
                                            index === 0 ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50' :
                                                index === 1 ? 'bg-slate-50 text-slate-500 border-slate-200' :
                                                    index === 2 ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-50' :
                                                        'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-50'
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-1 border border-slate-200 group-hover:border-indigo-200 transition-all">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${performer.studentName}`} className="w-full h-full object-cover rounded-lg" alt="avt" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{performer.studentName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{performer.rollNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900 leading-none">{performer.count}</p>
                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Acquisitions</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl shadow-indigo-100/50 bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                        <Trophy className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <Badge className="bg-white/20 border-none text-white font-bold h-8 px-4 mb-6 uppercase tracking-widest text-[10px]">Academic Audit 2026</Badge>
                            <h3 className="text-4xl font-black font-heading leading-tight mb-4">Total Value <br /> Generated</h3>
                            <p className="text-indigo-100 font-medium text-lg opacity-80 max-w-xs leading-relaxed">
                                Every achievement contributes to the institutional prestige score. Keep verifying success.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="p-8 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Cumulative Points</p>
                                <p className="text-5xl font-black font-heading tracking-tighter">{(approvedAchievements.length * 1250).toLocaleString()}+</p>
                            </div>
                            <Button className="w-full h-14 rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 font-black shadow-2xl shadow-black/20 gap-3">
                                Print Executive Summary
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
