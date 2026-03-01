"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Package, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || role !== "admin")) {
            router.push("/");
        }
    }, [user, role, loading, router]);

    if (loading || !user || role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 text-emerald-900 animate-spin" />
            </div>
        );
    }

    const navigation = [
        { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
        { name: "Sản phẩm", href: "/admin/products", icon: Package },
        { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
        { name: "Người dùng", href: "/admin/users", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-black italic">A</div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter">AURA Admin</h1>
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">Management</p>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-900 rounded-2xl transition-all group"
                        >
                            <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100 space-y-4">
                    <Link href="/" className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại cửa hàng
                    </Link>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-24 flex items-center justify-between px-12 sticky top-0 z-10 shadow-sm shadow-slate-200/50">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trang quản trị</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{user.email}</p>
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Administrator</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center font-bold text-slate-400 uppercase">
                            {user.email?.[0]}
                        </div>
                    </div>
                </header>

                <div className="p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
