"use client";

import { useEffect, useState } from "react";
import { Users, Shield, ShieldAlert, Loader2, Mail, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
    const { showToast, confirm } = useNotification();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (userId: string, currentRole: string) => {
        if (currentUser && userId === currentUser.id) {
            showToast("Bạn không thể tự gỡ quyền Admin của chính mình!", "error");
            return;
        }

        const newRole = currentRole === "admin" ? "user" : "admin";
        const isConfirmed = await confirm(`Bạn có chắc muốn chuyển người dùng này thành ${newRole}?`);
        if (!isConfirmed) return;

        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                showToast(`Đã chuyển vai trò thành ${newRole}`, "success");
            } else {
                showToast("Cập nhật thất bại", "error");
            }
        } catch (error) {
            showToast("Cập nhật thất bại", "error");
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Quản lý người dùng</h1>
                <p className="text-slate-500 font-medium">Xem danh sách người dùng và phân quyền quản trị.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tham gia</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <Loader2 className="h-10 w-10 text-emerald-900 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            key={user.id}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase">
                                                        {user.name?.[0] || user.email[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{user.name || "Khách hàng"}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UID: {user.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                    <Mail className="h-4 w-4 text-slate-300" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === "admin"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                    <Calendar className="h-4 w-4 text-slate-300" />
                                                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => toggleRole(user.id, user.role)}
                                                    className={`p-3 rounded-xl transition-all ${user.role === "admin"
                                                        ? "text-red-400 hover:text-red-500 hover:bg-red-50"
                                                        : "text-emerald-400 hover:text-emerald-500 hover:bg-emerald-50"
                                                        }`}
                                                    title={user.role === "admin" ? "Gỡ quyền Admin" : "Cấp quyền Admin"}
                                                >
                                                    {user.role === "admin" ? <ShieldAlert className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
