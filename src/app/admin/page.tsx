"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, Users, TrendingUp, Loader2 } from "lucide-react";
import { formatVND } from "@/lib/currencies";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-emerald-900 animate-spin" />
            </div>
        );
    }

    const cards = [
        { name: "Doanh thu", value: formatVND(stats.revenue), icon: TrendingUp, color: "emerald" },
        { name: "Sản phẩm", value: stats.productCount, icon: Package, color: "slate" },
        { name: "Đơn hàng", value: stats.orderCount, icon: ShoppingBag, color: "slate" },
        { name: "Người dùng", value: stats.userCount, icon: Users, color: "slate" },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Tổng quan hệ thống</h1>
                <p className="text-slate-500 font-medium">Theo dõi hiệu suất kinh doanh của AURA.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={card.name}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
                    >
                        <div className={`p-4 bg-${card.color}-50 rounded-2xl w-fit mb-6 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                            <card.icon className="h-6 w-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{card.name}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-emerald-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tight mb-4 leading-none">Chào mừng trở lại, Admin</h3>
                    <p className="text-emerald-300 font-medium mb-8 max-w-lg">Hệ thống hiện đang hoạt động ổn định. Bạn có {stats.orderCount} đơn hàng cần xử lý.</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <TrendingUp className="w-96 h-96" />
                </div>
            </div>
        </div>
    );
}
