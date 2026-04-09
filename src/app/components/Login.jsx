import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Award, AlertCircle, Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DEPARTMENTS } from '../types';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [captcha, setCaptcha] = useState({ code: '', userInput: '' });
    const navigate = useNavigate();
    const { login, register } = useAuth();

    React.useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        setCaptcha({ code, userInput: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        if (captcha.userInput.toLowerCase() !== captcha.code.toLowerCase()) {
            setError('Incorrect Captcha code. Please try again.');
            generateCaptcha();
            return;
        }

        let success = false;

        if (isRegistering) {
            if (!name || !rollNumber || !department) {
                setError('Please fill in all registration fields');
                return;
            }
            success = await register({ email, password, name, rollNumber, department, role: 'student' });
        } else {
            success = await login(email, password);
        }

        if (success) {
            navigate('/dashboard');
        } else {
            setError(isRegistering ? 'Registration failed. That email might already be taken.' : 'Invalid credentials. Please try again.');
            generateCaptcha();
        }
    };


    return (
        <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background font-sans">
            {/* Visual Section */}
            <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, 50, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative z-10 max-w-md text-center text-white space-y-12">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <div className="inline-flex p-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl mb-8 relative group">
                            <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all" />
                            <Award className="w-20 h-20 text-white relative z-10 animate-bounce-slow" />
                        </div>
                        <h1 className="text-6xl font-black font-heading tracking-tighter leading-none mb-6">
                            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Success</span>
                        </h1>
                        <p className="text-xl text-indigo-100 font-medium leading-relaxed opacity-90 px-4">
                            The elite platform to track, verify, and spotlight your academic excellence.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6 pt-10">
                        {[
                            { label: 'Verified', sub: 'Certificates', icon: ShieldCheck },
                            { label: 'Real-time', sub: 'Auditing', icon: Sparkles }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10"
                            >
                                <stat.icon className="w-6 h-6 mb-2 mx-auto text-indigo-200" />
                                <p className="text-lg font-black leading-none mb-1">{stat.label}</p>
                                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{stat.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center p-6 bg-slate-50 relative overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 lg:hidden" />

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8 py-10"
                >
                    <div className="lg:hidden text-center mb-6">
                        <Award className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-slate-900 font-heading">AchieveTrack</h2>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
                            {isRegistering ? 'Create your Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isRegistering ? 'Start tracking your academic and extracurricular journey' : 'Enter your credentials to access your dashboard'}
                        </p>
                    </div>

                    <Card className="border-none shadow-2xl shadow-indigo-100/50 bg-white/80 backdrop-blur-xl p-2 rounded-[2rem] border border-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-slate-800">
                                {isRegistering ? 'Sign Up' : 'Sign In'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}

                                {isRegistering && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Student Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-12 border-slate-200 hover:border-indigo-400 focus:ring-4 transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <Label htmlFor="rollNumber" className="text-sm font-semibold text-slate-700">Roll/ID Number</Label>
                                                <Input
                                                    id="rollNumber"
                                                    placeholder="CS2021001"
                                                    value={rollNumber}
                                                    onChange={(e) => setRollNumber(e.target.value)}
                                                    className="h-12 border-slate-200 hover:border-indigo-400 focus:ring-4 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-slate-700">Department</Label>
                                                <Select value={department} onValueChange={setDepartment}>
                                                    <SelectTrigger className="h-12 border-slate-200 hover:border-indigo-400 focus:ring-4 transition-all bg-white font-medium">
                                                        <SelectValue placeholder="Branch" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-none shadow-2xl rounded-xl">
                                                        {DEPARTMENTS?.map(dept => (
                                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@university.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 border-slate-200 hover:border-indigo-400 focus:ring-4 transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                                        {!isRegistering && <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot?</a>}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 border-slate-200 hover:border-indigo-400 focus:ring-4 transition-all"
                                    />
                                </div>

                                {/* Math Captcha */}
                                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <Label className="text-sm font-semibold text-slate-700">Security Verification</Label>
                                    <div className="flex items-center gap-4">
                                        <div 
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-lg text-center font-black tracking-[0.3em] text-indigo-700 select-none shadow-inner"
                                            style={{ fontFamily: 'monospace', textDecoration: 'line-through' }}
                                        >
                                            {captcha.code}
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Enter Code"
                                            value={captcha.userInput}
                                            onChange={(e) => setCaptcha({...captcha, userInput: e.target.value})}
                                            className="w-32 h-11 border-slate-200 hover:border-indigo-400 focus:ring-4 transition-all uppercase"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={generateCaptcha}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-500 underline"
                                    >
                                        Get New Code
                                    </button>
                                </div>

                                <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99]">
                                    {isRegistering ? 'Complete Registration' : 'Continue to Dashboard'}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}
                        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="ml-2 text-indigo-600 font-bold hover:underline">
                            {isRegistering ? "Sign in securely" : "Create New Account"}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
