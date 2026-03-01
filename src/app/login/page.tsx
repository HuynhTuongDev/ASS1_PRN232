"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.push("/");
            router.refresh();
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
                        className="hidden lg:block"
                    >
                        <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80"
                                alt="Login"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent" />
                            <div className="absolute bottom-12 left-12 right-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-500 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-white font-black uppercase tracking-widest text-xs">Truy cập Thành viên</span>
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight">Chào mừng bạn quay trở lại.</h2>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto w-full"
                    >
                        <div className="mb-12">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Đăng nhập</h1>
                            <p className="text-slate-500 font-medium">Nhập thông tin đăng nhập của bạn để truy cập tài khoản và quản lý bộ sưu tập.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
                                    {error}
                                </div>
                            )}

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
                                <div className="flex justify-between items-center ml-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:underline">Forgot?</a>
                                </div>
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
                                        Sign In <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-medium">
                                New to AURA?{" "}
                                <Link href="/register" className="text-emerald-800 font-black uppercase tracking-widest text-xs hover:underline ml-2">
                                    Create an Account
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
