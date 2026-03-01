"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Search, Package, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { formatVND } from "@/lib/currencies";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/context/NotificationContext";

export default function AdminProductsPage() {
    const { showToast } = useNotification();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?q=${search}&page=${page}&limit=8`);
            const data = await res.json();
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(1);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        fetchProducts(newPage);
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (!isConfirmed) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
                showToast("Đã xóa sản phẩm thành công", "success");
            } else {
                showToast("Xóa thất bại", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Lỗi server", "error");
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Quản lý sản phẩm</h1>
                    <p className="text-slate-500 font-medium">Thêm, sửa hoặc xóa sản phẩm từ danh mục của AURA.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-3 bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 w-fit"
                >
                    <Plus className="h-5 w-5" />
                    Thêm sản phẩm mới
                </Link>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc ID..."
                            className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 transition-all outline-none text-sm font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
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
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">Không tìm thấy sản phẩm nào.</td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={product.id}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-emerald-900 text-sm">
                                                {formatVND(product.price)}
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                                {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/edit/${product.id}`}
                                                        className="p-3 text-slate-400 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="p-10 border-t border-slate-50 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-4 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-900 hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${pagination.page === i + 1
                                            ? "bg-emerald-900 text-white shadow-lg shadow-emerald-900/20"
                                            : "bg-white text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="p-4 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-900 hover:bg-emerald-50 transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                            Hiển thị {products.length} trên tổng số {pagination.total} sản phẩm
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
