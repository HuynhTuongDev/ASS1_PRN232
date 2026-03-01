"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: displayName,
                    },
                },
            });
            if (error) throw error;
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block lg:order-2"
                    >
                        <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80"
                                alt="Register"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent" />
                            <div className="absolute bottom-12 left-12 right-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-500 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-white font-black uppercase tracking-widest text-xs">Join Us</span>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight">Begin your journey to intentional living.</h2>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto w-full lg:order-1"
                    >
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center bg-emerald-50/50 p-12 rounded-[3.5rem] border border-emerald-100 shadow-2xl shadow-emerald-900/5"
                                >
                                    <div className="bg-emerald-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-900/30">
                                        <Mail className="h-10 w-10 text-white" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">Xác thực Archive của bạn</h2>
                                    <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                                        Chúng tôi đã gửi một liên kết xác nhận cao cấp đến <span className="text-emerald-900 font-black">{email}</span>.
                                        Vui lòng kiểm tra hộp thư để kích hoạt quyền truy cập AURA.
                                    </p>
                                    <div className="space-y-4">
                                        <Link
                                            href="/login"
                                            className="block w-full bg-emerald-900 text-white py-6 rounded-2xl font-bold hover:bg-emerald-950 transition-all active:scale-95 text-center"
                                        >
                                            Tiếp tục đến Đăng nhập
                                        </Link>
                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-800 transition-colors"
                                        >
                                            Gửi lại email xác nhận
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="mb-12">
                                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Register</h1>
                                        <p className="text-slate-500 font-medium">Create your AURA account to manage your essentials and track your orders.</p>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-6">
                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
                                                {error}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all outline-none"
                                                    placeholder="John Doe"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all outline-none"
                                                    placeholder="name@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/5 transition-all outline-none"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-emerald-900 text-white py-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                        >
                                            {loading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Create Account <ArrowRight className="h-5 w-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-12 text-center">
                                        <p className="text-slate-500 font-medium">
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-emerald-800 font-black uppercase tracking-widest text-xs hover:underline ml-2">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
