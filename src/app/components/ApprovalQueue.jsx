import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    Eye,
    Search,
    ArrowRight,
    ShieldCheck,
    Award,
    Calendar,
    User,
    History,
    AlertCircle,
    SearchCode,
    FileText,
    Sparkles,
    Database,
    Download
} from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function ApprovalQueue() {
    const { achievements, updateAchievement } = useAchievements();
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [evidenceUrl, setEvidenceUrl] = useState('');

    const pendingAchievements = achievements.filter(a => a.status === 'pending');

    const handleApprove = (id) => {
        updateAchievement(id, { status: 'approved', approvedAt: new Date().toISOString() });
        toast.success('Credential authorized and synchronized', {
            icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        });
        setIsDetailsOpen(false);
    };

    const handleReject = (id) => {
        if (!rejectionReason) {
            toast.error('Intelligence report requires a reason for rejection');
            return;
        }
        updateAchievement(id, {
            status: 'rejected',
            rejectionReason,
            approvedAt: new Date().toISOString()
        });
        toast.error('Credential entry declined');
        setIsRejecting(false);
        setIsDetailsOpen(false);
        setRejectionReason('');
    };

    return (
        <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tighter">Verification Queue</h2>
                    </div>
                    <p className="text-slate-500 font-medium text-lg">System-wide audit trail for pending student credentials.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="px-6 py-2 border-r border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Backlog</p>
                        <p className="text-xl font-black text-slate-800 leading-none">{pendingAchievements.length}</p>
                    </div>
                    <div className="px-6 py-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Queue Status</p>
                        <p className="text-xl font-black text-emerald-500 leading-none">Operational</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout" initial={false}>
                    {pendingAchievements.length > 0 ? (
                        pendingAchievements.map((achievement) => (
                            <motion.div
                                key={achievement.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, x: -100 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden rounded-[2.5rem] group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 border border-slate-50/50">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row h-full">
                                            <div className="lg:w-72 p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-slate-100 space-y-4">
                                                <div className="relative group/avatar">
                                                    <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-2xl opacity-0 group-hover/avatar:opacity-20 transition-all" />
                                                    <div className="w-24 h-24 rounded-[2rem] bg-white p-1 border-2 border-slate-100 relative z-10">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${achievement.studentName}`}
                                                            alt="avatar"
                                                            className="w-full h-full object-cover rounded-[1.5rem]"
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center z-20">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-slate-800 tracking-tight">{achievement.studentName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{achievement.rollNumber}</p>
                                                </div>
                                                <Badge className="bg-indigo-50/50 text-indigo-700 border-none px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                                                    {achievement.department}
                                                </Badge>
                                            </div>

                                            <div className="flex-1 p-10 flex flex-col justify-between">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className="bg-amber-100/50 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-3 h-6 rounded-full flex gap-1.5 items-center">
                                                                <Clock className="w-3 h-3" />
                                                                Pending Audit
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-3xl font-black font-heading text-slate-800 tracking-tighter leading-tight mt-2">
                                                            {achievement.eventName}
                                                        </h3>
                                                        <p className="text-slate-500 font-medium max-w-xl text-lg leading-relaxed line-clamp-2 italic">
                                                            “{achievement.description || 'No additional narrative provided by the claimant.'}”
                                                        </p>
                                                    </div>
                                                    <div className="flex md:flex-col gap-3">
                                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[140px]">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Domain</p>
                                                            <p className="font-bold text-slate-700 flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                                {achievement.eventCategory}
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[140px]">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hierarchy</p>
                                                            <p className="font-bold text-slate-700 flex items-center gap-2">
                                                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                                                {achievement.level}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Calendar className="w-4 h-4" />
                                                            <span className="text-xs font-bold uppercase tracking-wider">{new Date(achievement.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                        <Button
                                                            variant="link"
                                                            className="text-indigo-600 font-bold p-0 gap-1.5 h-fit text-xs uppercase tracking-widest hover:no-underline hover:text-indigo-700"
                                                            onClick={() => {
                                                                if (achievement.certificateUrl) {
                                                                    setEvidenceUrl(achievement.certificateUrl);
                                                                    setIsEvidenceOpen(true);
                                                                } else {
                                                                    toast.error('No evidence document discovered for this record');
                                                                }
                                                            }}
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                            Inspect Evidence
                                                        </Button>
                                                    </div>
                                                    <div className="flex gap-4 w-full sm:w-auto">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedAchievement(achievement);
                                                                setRejectionReason('');
                                                                setIsRejecting(true);
                                                                setIsDetailsOpen(true);
                                                            }}
                                                            className="flex-1 sm:flex-none h-14 px-8 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all gap-2"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                            Decline
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleApprove(achievement.id)}
                                                            className="flex-1 sm:flex-none h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-100 transition-all active:scale-95 gap-2"
                                                        >
                                                            <CheckCircle className="w-5 h-5 text-indigo-400" />
                                                            Authorize
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center px-10"
                        >
                            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner">
                                <Database className="w-14 h-14 text-slate-200" />
                            </div>
                            <h3 className="text-3xl font-black font-heading text-slate-800 tracking-tighter mb-4">Queue Synchronized</h3>
                            <p className="text-slate-400 font-medium max-w-sm text-lg leading-relaxed italic">
                                “The institutional backlog is clear. All credentials have been audited and indexed.”
                            </p>
                            <Button variant="outline" className="mt-10 h-14 px-8 rounded-2xl border-slate-200 font-bold gap-2 text-indigo-600" onClick={() => (window).location.reload()}>
                                <History className="w-5 h-5" />
                                Refresh Ledger
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    <div className="h-3 bg-indigo-600 w-full" />
                    <div className="p-10">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-3xl font-black font-heading tracking-tight mb-2">
                                {isRejecting ? 'Audit Rejection' : 'Authorization'} Report
                            </DialogTitle>
                            <DialogDescription className="font-medium text-slate-400 text-base leading-relaxed">
                                {isRejecting
                                    ? 'You are about to decline this achievement. Please provide a detailed briefing as to why this credential does not meet institutional standards.'
                                    : 'Review the final intelligence briefing before authorizing this record for the permanent global transcript.'}
                            </DialogDescription>
                        </DialogHeader>

                        {isRejecting ? (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Rejection Intelligence</p>
                                        <span className="text-[10px] font-bold text-slate-400">{rejectionReason.length}/400</span>
                                    </div>
                                    <Textarea
                                        placeholder="e.g. Evidence lacks institutional digital signature or watermark."
                                        className="min-h-[160px] rounded-2xl border-slate-100 bg-slate-50/50 p-6 font-medium text-slate-700 resize-none focus:ring-rose-50 focus:border-rose-100 transition-all"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                </div>
                                <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50 flex gap-4">
                                    <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                                    <p className="text-xs font-bold text-rose-800 leading-relaxed italic">
                                        Declining a request will notify the student and require them to re-declare with secondary evidence.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center p-1 border border-indigo-200">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAchievement?.studentName}`} className="w-full h-full object-cover rounded-xl" alt="avt" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-lg leading-none mb-1">{selectedAchievement?.studentName}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedAchievement?.rollNumber} • {selectedAchievement?.department}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Record Outcome</p>
                                        <p className="text-xl font-black text-slate-800 leading-tight">{selectedAchievement?.eventName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Validated Recognition</p>
                                        <p className="text-sm font-bold text-slate-600">{selectedAchievement?.awardType}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-10 flex gap-4 sm:justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDetailsOpen(false)}
                                className="h-14 px-8 rounded-2xl font-bold text-slate-500 hover:bg-slate-50"
                            >
                                Cancel Audit
                            </Button>
                            {isRejecting ? (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleReject(selectedAchievement?.id)}
                                    className="h-14 px-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-xl shadow-rose-100 transition-all active:scale-95 gap-2"
                                >
                                    Purge from Queue
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleApprove(selectedAchievement?.id)}
                                    className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-100 transition-all active:scale-95 gap-2"
                                >
                                    Sign Intelligence
                                </Button>
                            )}
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEvidenceOpen} onOpenChange={setIsEvidenceOpen}>
                <DialogContent className="max-w-4xl bg-white/80 backdrop-blur-2xl rounded-[3rem] border-none shadow-[0_0_100px_rgba(0,0,0,0.1)] p-0 overflow-hidden">
                    <div className="absolute top-6 right-6 z-50">
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={() => setIsEvidenceOpen(false)}
                            className="rounded-full bg-white/50 backdrop-blur-md border-none hover:bg-white shadow-xl"
                        >
                            <XCircle className="w-5 h-5 text-slate-800" />
                        </Button>
                    </div>
                    
                    <div className="p-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black font-heading text-slate-900 tracking-tighter">Credential Evidence</h3>
                                <p className="text-slate-500 font-medium font-sans">Official document provided by the claimant for verification.</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = evidenceUrl;
                                    a.download = `Evidence_${Date.now()}.png`;
                                    a.click();
                                }}
                                className="rounded-2xl h-12 px-6 border-slate-200 font-bold hover:bg-slate-50 gap-2 shadow-sm"
                            >
                                <Download className="w-5 h-5 text-indigo-500" />
                                Save Copy
                            </Button>
                        </div>
                        
                        <div className="relative rounded-[2rem] overflow-hidden bg-slate-100/50 border border-slate-200/50 flex items-center justify-center min-h-[400px]">
                            {evidenceUrl.includes('image/') ? (
                                <img 
                                    src={evidenceUrl} 
                                    alt="Evidence" 
                                    className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-xl"
                                />
                            ) : (
                                <div className="text-center p-12">
                                    <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold">Document format not supported for direct preview.</p>
                                    <p className="text-slate-400 text-sm italic">Use 'Save Copy' to view the full file.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
