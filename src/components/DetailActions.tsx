"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Edit, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DetailActions({ product }: { product: any }) {
    const { user, role } = useAuth();
    const { addToCart } = useCart();

    return (
        <div className="mt-auto flex flex-wrap gap-6">
            <button
                onClick={() => addToCart(product)}
                className="px-10 py-5 bg-emerald-900 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 group"
            >
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ hàng
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {user && role === "admin" && (
                <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="px-10 py-5 bg-slate-100 text-slate-900 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-95"
                >
                    <Edit className="h-5 w-5" /> Chỉnh sửa sản phẩm
                </Link>
            )}
        </div>
    );
}
