import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Trophy,
    Clock,
    CheckCircle,
    Upload,
    Award,
    TrendingUp,
    Star,
    Zap,
    Target,
    ChevronRight,
    Plus
} from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { achievements } = useAchievements();

    const userAchievements = achievements.filter(a => a.studentId === user?.id);
    const approvedCount = userAchievements.filter(a => a.status === 'approved').length;
    const pendingCount = userAchievements.filter(a => a.status === 'pending').length;

    const categoryData = userAchievements
        .filter(a => a.status === 'approved')
        .reduce((acc, achievement) => {
            const existing = acc.find(item => item.category === achievement.eventCategory);
            if (existing) {
                existing.count += 1;
            } else {
                acc.push({ category: achievement.eventCategory, count: 1 });
            }
            return acc;
        }, []);

    const recentAchievements = userAchievements
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h2 variants={item} className="text-4xl font-bold font-heading text-slate-900 tracking-tight">
                        Hi, {user?.name.split(' ')[0]}! 👋
                    </motion.h2>
                    <motion.p variants={item} className="text-slate-500 text-lg mt-1">
                        Build your legacy, one achievement at a time.
                    </motion.p>
                </div>
                <motion.div variants={item}>
                    <Button
                        onClick={() => navigate('/upload')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-12 rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 gap-2 font-bold"
                    >
                        <Plus className="w-5 h-5" />
                        New Submission
                    </Button>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Verified Wins', value: approvedCount, icon: Trophy, color: 'bg-emerald-500', shadow: 'shadow-emerald-100', text: 'text-emerald-600' },
                    { label: 'In Review', value: pendingCount, icon: Clock, color: 'bg-amber-500', shadow: 'shadow-amber-100', text: 'text-amber-600' },
                    { label: 'Global Rank', value: '#12', icon: Star, color: 'bg-indigo-500', shadow: 'shadow-indigo-100', text: 'text-indigo-600' }
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <Card className={`border-none ${stat.shadow} shadow-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                            <CardContent className="p-0">
                                <div className="flex items-stretch h-32">
                                    <div className={`${stat.color} w-3 flex items-center justify-center transition-all group-hover:w-4`} />
                                    <div className="flex-1 p-6 flex flex-col justify-center">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-4xl font-bold text-slate-800 font-heading tracking-tight">{stat.value}</p>
                                            {i === 0 && <span className="text-xs font-bold text-emerald-500">+2 this month</span>}
                                        </div>
                                    </div>
                                    <div className="p-6 flex items-center">
                                        <div className={`${stat.color}/10 p-4 rounded-3xl`}>
                                            <stat.icon className={`w-8 h-8 ${stat.text}`} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Card */}
                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-800 font-heading">Performance Matrix</CardTitle>
                                <p className="text-sm text-slate-400 mt-1">Distribution across event categories</p>
                            </div>
                            <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex gap-1">
                                <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs font-bold bg-white shadow-sm px-4">Bar View</Button>
                                <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs font-bold text-slate-400 hover:text-slate-600 px-4">Line View</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {categoryData.length > 0 ? (
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="category"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                            />
                                            <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[350px] flex items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <div className="text-center">
                                        <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold">No performance data yet</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={item}>
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-800 font-heading">Recent Feed</CardTitle>
                            <Button variant="link" className="text-indigo-600 font-bold p-0" onClick={() => navigate('/my-achievements')}>
                                See all
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-6">
                                {recentAchievements.length > 0 ? (
                                    recentAchievements.map((achievement, i) => (
                                        <div key={achievement.id} className="relative flex gap-4 group cursor-pointer">
                                            {i !== recentAchievements.length - 1 && (
                                                <div className="absolute left-6 top-12 bottom-[-24px] w-[2px] bg-slate-100" />
                                            )}
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110",
                                                achievement.status === 'approved' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-50' :
                                                    achievement.status === 'pending' ? 'bg-amber-50 text-amber-600 shadow-amber-50' :
                                                        'bg-red-50 text-red-600 shadow-red-50'
                                            )}>
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h4 className="font-bold text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors">
                                                        {achievement.eventName}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                                        {new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 pr-2 truncate">{achievement.awardType}</p>
                                                <div className="mt-2">
                                                    <Badge className={cn(
                                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-none",
                                                        achievement.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                            achievement.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                    )}>
                                                        {achievement.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                            <Target className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="font-bold text-slate-400">Waiting for your wins...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button
                                onClick={() => navigate('/upload')}
                                variant="outline"
                                className="w-full h-12 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 gap-2"
                            >
                                Submit Entry
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Highlights & CTA */}
            <motion.div variants={item}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Trophy className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div>
                                <Badge className="bg-white/20 text-white border-none py-1 px-3 mb-4 uppercase tracking-widest text-xs font-bold">Pro Milestone</Badge>
                                <h3 className="text-3xl font-bold font-heading mb-4 leading-tight">Your Talent Score is <span className="text-yellow-400">{(approvedCount * 125).toLocaleString()}</span></h3>
                                <p className="text-indigo-100/80 max-w-sm font-medium">Keep uploading your achievements to unlock exclusive university rewards and certifications.</p>
                            </div>
                            <Button className="w-fit bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-2xl h-12 px-8 shadow-xl shadow-black/20">
                                Redeem Points
                            </Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-indigo-50/50 transition-all">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                <Plus className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">New Entry</h4>
                            <p className="text-xs text-slate-400 mt-1">Add achievement</p>
                        </Card>
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-purple-50/50 transition-all">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                <Star className="w-7 h-7 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Badge Center</h4>
                            <p className="text-xs text-slate-400 mt-1">Unlock rewards</p>
                        </Card>
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-emerald-50/50 transition-all">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                <TrendingUp className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Growth Plan</h4>
                            <p className="text-xs text-slate-400 mt-1">Next steps</p>
                        </Card>
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-amber-50/50 transition-all">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                                <CheckCircle className="w-7 h-7 text-amber-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Verification</h4>
                            <p className="text-xs text-slate-400 mt-1">Submit proof</p>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
