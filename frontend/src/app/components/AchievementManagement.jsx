import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from './ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Trash2,
    Download,
    Plus,
    Trophy,
    User,
    Calendar,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Database,
    ArrowUpRight,
    Sparkles,
    SearchCode
} from 'lucide-react';
import { useAchievements } from '../context/AchievementContext';
import { EVENT_CATEGORIES, DEPARTMENTS, AWARD_LEVELS } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Textarea } from './ui/textarea';

export default function AchievementManagement() {
    const { achievements, addAchievement, deleteAchievement } = useAchievements();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const filteredAchievements = achievements.filter(achievement => {
        const matchesSearch = (achievement.eventName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (achievement.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (achievement.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || achievement.eventCategory === filterCategory;
        const matchesDepartment = filterDepartment === 'all' || achievement.department === filterDepartment;

        return matchesSearch && matchesCategory && matchesDepartment;
    });

    const handleDelete = (id) => {
        deleteAchievement(id);
        toast.error('Record purged from database');
    };

    const handleExport = () => {
        toast.success('Excel report generated');
    };

    return (
        <div className="space-y-8 py-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black font-heading text-slate-900 tracking-tighter">Master Database</h2>
                    <p className="text-slate-500 font-medium text-lg mt-2">Centralized vault for all institutional academic credentials.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 gap-2 shadow-sm" onClick={handleExport}>
                        <Download className="w-5 h-5 text-indigo-500" />
                        Export Data
                    </Button>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-xl shadow-slate-100">
                                <Plus className="w-5 h-5 text-indigo-400" />
                                Initialize Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                            <div className="h-2 bg-indigo-600 w-full" />
                            <div className="p-10">
                                <DialogHeader className="mb-8">
                                    <DialogTitle className="text-3xl font-black font-heading tracking-tight">Add Achievement Record</DialogTitle>
                                    <p className="text-slate-400 font-medium">Create a new entry in the global achievement ledger.</p>
                                </DialogHeader>
                                <AddAchievementForm onSuccess={() => setIsAddDialogOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/40 bg-white overflow-visible">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                            <Input
                                placeholder="Search by student, event, or roll number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:ring-4 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="h-12 w-[180px] rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        <SelectValue placeholder="Category" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">Every Category</SelectItem>
                                    {EVENT_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                <SelectTrigger className="h-12 w-[180px] rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-600">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all">All Modules</SelectItem>
                                    {DEPARTMENTS.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100 h-16">
                                    <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] pl-8">Initiator</TableHead>
                                    <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Record Event</TableHead>
                                    <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Domain</TableHead>
                                    <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Territory</TableHead>
                                    <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Validation</TableHead>
                                    <TableHead className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-right pr-8">Control</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {filteredAchievements.map((achievement) => (
                                        <motion.tr
                                            key={achievement.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group border-slate-100 hover:bg-slate-50/50 transition-colors h-20"
                                        >
                                            <TableCell className="pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 p-0.5 border border-slate-200 group-hover:scale-110 transition-transform">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${achievement.studentName}`} className="w-full h-full object-cover rounded-lg" alt="avt" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-none mb-1">{achievement.studentName}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{achievement.rollNumber}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-bold text-slate-700">{achievement.eventName}</p>
                                                <p className="text-xs text-slate-400 font-medium">{achievement.awardType}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-lg bg-indigo-50/50 text-indigo-700 border-indigo-100/50 font-bold px-3 py-1 text-[10px] uppercase tracking-widest">
                                                    {achievement.eventCategory}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <MapPin className="w-4 h-4 text-indigo-400" />
                                                    <span className="font-bold text-xs">{achievement.level}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.2em] border shadow-sm",
                                                    achievement.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-50' :
                                                        achievement.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-50' :
                                                            'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-50'
                                                )}>
                                                    {achievement.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white group-hover:shadow-md transition-all">
                                                            <MoreVertical className="w-5 h-5 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-[1.5rem] border-none shadow-2xl p-2 min-w-[160px]">
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 font-bold text-slate-700 focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer gap-3"
                                                            onClick={() => {
                                                                setSelectedAchievement(achievement);
                                                                setIsViewDialogOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Intel
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer gap-3"
                                                            onClick={() => handleDelete(achievement.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Purge Record
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Displaying {filteredAchievements.length} of {achievements.length} synchronized records</p>
                    <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="w-10 h-10 rounded-xl border-slate-200 bg-white"><ChevronLeft className="w-4 h-4" /></Button>
                        <Button size="icon" variant="outline" className="w-10 h-10 rounded-xl border-slate-200 bg-white"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            </Card>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    {selectedAchievement && (
                        <div className="flex flex-col h-full">
                            <div className="h-4 bg-indigo-600 w-full" />
                            <div className="p-12">
                                <div className="flex items-start justify-between mb-10">
                                    <div className="space-y-4">
                                        <Badge className="bg-indigo-50/50 text-indigo-700 border-indigo-100 uppercase font-black text-[10px] px-4 py-1 rounded-full shadow-sm tracking-[0.2em]">Verified Transcript</Badge>
                                        <h2 className="text-4xl font-black text-slate-900 font-heading leading-tight tracking-tighter max-w-sm">{selectedAchievement.eventName}</h2>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-xl transition-transform hover:rotate-3">
                                        <Trophy className="w-12 h-12 text-indigo-600" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-slate-50">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Status</Label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={cn("w-2.5 h-2.5 rounded-full", selectedAchievement.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500')} />
                                            <span className="font-bold text-slate-800 capitalize">{selectedAchievement.status}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Recognition</Label>
                                        <p className="font-bold text-slate-800 mt-2">{selectedAchievement.awardType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Event Date</Label>
                                        <p className="font-bold text-slate-800 mt-2">{new Date(selectedAchievement.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Level</Label>
                                        <p className="font-bold text-slate-800 mt-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                            {selectedAchievement.level}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Category</Label>
                                        <p className="font-bold text-slate-800 mt-2">{selectedAchievement.eventCategory}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0">Student Profile</Label>
                                        <Button variant="ghost" className="h-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-100 rounded-full px-3">View Full Bio</Button>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-sm border border-slate-200">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAchievement.studentName}`} className="w-full h-full object-cover rounded-xl" alt="avt" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-slate-800 tracking-tight">{selectedAchievement.studentName}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedAchievement.rollNumber} • {selectedAchievement.department}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white h-16 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 gap-3">
                                        Initialize Audit
                                        <Database className="w-6 h-6 text-indigo-400" />
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="flex-1 border-slate-200 h-16 rounded-2xl font-black text-lg text-slate-600 hover:bg-slate-50">
                                        Dismiss
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

function AddAchievementForm({ onSuccess }) {
    const { addAchievement } = useAchievements();
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        rollNumber: '',
        department: '',
        eventName: '',
        eventCategory: '',
        level: '',
        awardType: '',
        date: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAchievement = {
            ...formData,
            id: Math.random().toString(36).substring(2, 9),
            status: 'approved',
            createdAt: new Date().toISOString(),
        };
        addAchievement(newAchievement);
        toast.success('Achievement entry synchronized');
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Intelligence Identifier</Label>
                    <Input
                        required
                        placeholder="e.g. 21CS042"
                        value={formData.rollNumber}
                        className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 font-bold"
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</Label>
                    <Input
                        required
                        placeholder="Full Name"
                        value={formData.studentName}
                        className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 font-bold"
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Domain</Label>
                    <Select required onValueChange={(val) => setFormData({ ...formData, eventCategory: val })}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 font-bold">
                            <SelectValue placeholder="Select Domain" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                            {EVENT_CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Achievement Label</Label>
                    <Input
                        required
                        placeholder="Event Name"
                        value={formData.eventName}
                        className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 font-bold"
                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Territory Level</Label>
                    <Select required onValueChange={(val) => setFormData({ ...formData, level: val })}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 font-bold">
                            <SelectValue placeholder="Select Territory" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                            {AWARD_LEVELS.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Conquest</Label>
                    <Input
                        required
                        type="date"
                        value={formData.date}
                        className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-4 font-bold"
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Narrative Description</Label>
                <Textarea
                    placeholder="Provide context for the record..."
                    className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-100 focus:ring-4 font-medium resize-none"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <Button type="submit" className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4">
                Authorize Synchronization
            </Button>
        </form>
    );
}
