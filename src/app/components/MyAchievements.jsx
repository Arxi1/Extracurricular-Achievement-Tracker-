import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Trophy,
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    Award,
    ExternalLink,
    ChevronRight,
    Sparkles,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAchievements } from '../context/AchievementContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { toast } from 'sonner';

export default function MyAchievements() {
    const { user } = useAuth();
    const { achievements } = useAchievements();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const userAchievements = achievements.filter(a => a.studentId === user?.id);

    const filteredAchievements = userAchievements.filter(a => {
        const matchesSearch = a.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.awardType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || a.eventCategory === filterCategory;
        const matchesStatus = filterStatus === 'all' || a.status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDownloadSummary = () => {
        toast.success('High-resolution Portfolio Export started');
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    icon: CheckCircle,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-50',
                    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    desc: 'Verified by Institution'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-amber-500',
                    bg: 'bg-amber-50',
                    badge: 'bg-amber-50 text-amber-700 border-amber-100',
                    desc: 'Awaiting Audit'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'text-rose-500',
                    bg: 'bg-rose-50',
                    badge: 'bg-rose-50 text-rose-700 border-rose-100',
                    desc: 'Clarification Required'
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-slate-500',
                    bg: 'bg-slate-50',
                    badge: 'bg-slate-50 text-slate-700 border-slate-100',
                    desc: 'Status Unknown'
                };
        }
    };

    return (
        <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tighter">Your Portfolio</h2>
                    <p className="text-slate-500 font-medium text-lg mt-2">A curated collection of your verified success and academic milestones.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownloadSummary}
                        className="rounded-2xl h-12 px-6 border-slate-200 font-bold hover:bg-slate-50 gap-2 shadow-sm"
                    >
                        <Download className="w-5 h-5 text-indigo-500" />
                        Export Portfolio
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white overflow-visible">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                            <Input
                                placeholder="Search your records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:ring-4 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-12 w-[160px] rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-600">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">Every State</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">In Review</SelectItem>
                                    <SelectItem value="rejected">Revisions</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-12 w-[160px] rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-600">
                                    <SelectValue placeholder="Domain" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">All Domains</SelectItem>
                                    <SelectItem value="Sports">Sports</SelectItem>
                                    <SelectItem value="Technical">Technical</SelectItem>
                                    <SelectItem value="Cultural">Cultural</SelectItem>
                                    <SelectItem value="Leadership">Leadership</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredAchievements.length > 0 ? (
                        filteredAchievements.map((achievement) => {
                            const cfg = getStatusConfig(achievement.status);
                            return (
                                <motion.div
                                    key={achievement.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group"
                                >
                                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden rounded-[2.5rem] flex flex-col h-full transition-all duration-500 hover:shadow-indigo-100 hover:scale-[1.02]">
                                        <div className={cn("h-2.5 w-full", cfg.color.replace('text', 'bg'))} />
                                        <CardContent className="p-8 flex flex-col flex-1">
                                            <div className="flex items-start justify-between mb-8">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform", cfg.bg)}>
                                                    <Trophy className={cn("w-7 h-7", cfg.color)} />
                                                </div>
                                                <Badge className={cn("px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border", cfg.badge)}>
                                                    {achievement.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-3 mb-8">
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{achievement.eventCategory}</p>
                                                <h3 className="text-2xl font-black text-slate-800 font-heading leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {achievement.eventName}
                                                </h3>
                                                <p className="text-slate-500 font-bold text-sm">{achievement.awardType}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hierarchy</p>
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                        <span className="font-bold text-slate-700 text-xs">{achievement.level}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Conquest</p>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                                        <span className="font-bold text-slate-700 text-xs">{new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                                                        <Award className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cfg.desc}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedAchievement(achievement);
                                                        setIsViewDialogOpen(true);
                                                    }}
                                                    className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center px-6"
                        >
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                                <Sparkles className="w-12 h-12 text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 font-heading tracking-tight mb-2">Workspace Clear</h3>
                            <p className="text-slate-400 font-medium max-w-xs leading-relaxed italic">
                                “Every achievement has been declared. Keep pushing the boundaries of excellence.”
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
                    {selectedAchievement && (
                        <div className="flex flex-col">
                            <div className={cn("h-3 w-full", getStatusConfig(selectedAchievement.status).color.replace('text', 'bg'))} />
                            <div className="p-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="space-y-4">
                                        <Badge className={cn("px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border", getStatusConfig(selectedAchievement.status).badge)}>
                                            {selectedAchievement.status}
                                        </Badge>
                                        <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tighter leading-tight max-w-sm">
                                            {selectedAchievement.eventName}
                                        </h2>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-transform hover:rotate-3">
                                        <Trophy className="w-10 h-10 text-indigo-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Validation Status</p>
                                        <p className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            Synchronized
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Recognition</p>
                                        <p className="font-bold text-slate-800 text-lg">{selectedAchievement.awardType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Category</p>
                                        <p className="font-bold text-slate-800">{selectedAchievement.eventCategory}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Territory</p>
                                        <p className="font-bold text-slate-800">{selectedAchievement.level}</p>
                                    </div>
                                </div>

                                <div className="mb-10 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Claim Narrative</p>
                                    <p className="text-slate-600 font-medium leading-relaxed italic">
                                        “{selectedAchievement.description || 'No additional narrative provided for this achievement record.'}”
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    {selectedAchievement.status === 'approved' && (
                                        <Button className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-100 gap-3">
                                            Download Credential
                                            <ExternalLink className="w-5 h-5 text-indigo-400" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsViewDialogOpen(false)}
                                        className="flex-1 h-14 rounded-2xl border-slate-200 font-black text-lg text-slate-600 hover:bg-slate-50"
                                    >
                                        Close Intel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
