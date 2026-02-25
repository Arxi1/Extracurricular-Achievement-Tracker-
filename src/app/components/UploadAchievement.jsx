import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import {
    Trophy,
    Upload,
    Calendar,
    Award,
    Plus,
    ArrowRight,
    ChevronLeft,
    Sparkles,
    ShieldCheck,
    FileText,
    Rocket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAchievements } from '../context/AchievementContext';
import { EVENT_CATEGORIES, AWARD_LEVELS } from '../types';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

export default function UploadAchievement() {
    const { user } = useAuth();
    const { addAchievement } = useAchievements();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        eventName: '',
        eventCategory: '',
        level: '',
        awardType: '',
        date: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const newAchievement = {
            ...formData,
            id: Math.random().toString(36).substring(2, 9),
            studentId: user?.id || '',
            studentName: user?.name || '',
            rollNumber: user?.rollNumber || '',
            department: user?.department || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        addAchievement(newAchievement);
        toast.success('Achievement declared successfully', {
            description: 'Institutional audit will begin shortly.',
            icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        });
        navigate('/my-achievements');
    };

    return (
        <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => navigate(-1)}>
                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tighter leading-none mb-1">Declare Success</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initialize a new credential audit</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
                        <div className="h-3 bg-indigo-600 w-full" />
                        <CardHeader className="p-10 pb-0">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <CardTitle className="text-2xl font-black font-heading text-slate-800 tracking-tight">Intelligence Briefing</CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-slate-400 leading-relaxed">
                                Provide granular details about your achievement. Every declaration undergoes a rigorous institutional verification process.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 ml-1">
                                            <Trophy className="w-3.5 h-3.5" />
                                            Event Identifier
                                        </Label>
                                        <Input
                                            required
                                            placeholder="e.g. National Cyber Hackathon"
                                            value={formData.eventName}
                                            className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-800 focus:ring-4 transition-all placeholder:text-slate-300"
                                            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 ml-1">
                                            <Award className="w-3.5 h-3.5" />
                                            Domain
                                        </Label>
                                        <Select required onValueChange={(val) => setFormData({ ...formData, eventCategory: val })}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-800 focus:ring-4 transition-all">
                                                <SelectValue placeholder="Select Sector" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                {EVENT_CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 ml-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Hierarchy
                                        </Label>
                                        <Select required onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-800 focus:ring-4 transition-all">
                                                <SelectValue placeholder="Territory Level" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                {AWARD_LEVELS.map(level => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 ml-1">
                                            <Plus className="w-3.5 h-3.5" />
                                            Recognition
                                        </Label>
                                        <Input
                                            required
                                            placeholder="e.g. Winner, Runner Up, Silver Medal"
                                            value={formData.awardType}
                                            className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-800 focus:ring-4 transition-all placeholder:text-slate-300"
                                            onChange={(e) => setFormData({ ...formData, awardType: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 ml-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Execution Date
                                        </Label>
                                        <Input
                                            required
                                            type="date"
                                            value={formData.date}
                                            className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-800 focus:ring-4 transition-all"
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 ml-1">
                                        Narrative Analysis
                                    </Label>
                                    <Textarea
                                        placeholder="Provide additional context, team information, or event impact..."
                                        className="min-h-[160px] rounded-[1.5rem] bg-slate-50 border-none p-6 font-medium text-slate-700 resize-none focus:ring-4 transition-all placeholder:text-slate-300"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button type="submit" className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-[0.98] gap-4">
                                        Authorize Submission
                                        <ArrowRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-none shadow-2xl shadow-indigo-100/50 bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                            <Rocket className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black font-heading mb-4">Integrity Check</h3>
                            <p className="text-indigo-100 font-medium leading-relaxed opacity-80">
                                By submitting this record, you affirm that the information is accurate and you possess physical evidence (certified documents) to support your claim.
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Secured Audit</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8">
                        <h4 className="text-xl font-black font-heading text-slate-800 mb-6">Process Hierarchy</h4>
                        <div className="space-y-6">
                            {[
                                { step: 1, title: 'Declaration', desc: 'Initialize the record for audit.' },
                                { step: 2, title: 'Institutional Review', desc: 'Verified by department heads.' },
                                { step: 3, title: 'Synchronization', desc: 'Entry added to the global ledger.' }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                                        {s.step}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{s.title}</p>
                                        <p className="text-xs text-slate-400 font-medium">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
