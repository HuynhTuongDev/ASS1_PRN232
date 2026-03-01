"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/context/NotificationContext";

export default function CartPage() {
    const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
    const { confirm } = useNotification();

    const handleClearCart = async () => {
        const isConfirmed = await confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?");
        if (isConfirmed) clearCart();
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Your Bag</h1>
                    <p className="text-slate-500 font-medium">Review your selection before proceeding to checkout.</p>
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3.5rem] border border-slate-100">
                        <div className="bg-white p-10 rounded-full shadow-2xl mb-8">
                            <ShoppingBag className="h-16 w-16 text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your bag is empty</h2>
                        <p className="text-slate-500 mb-10 max-w-xs text-center">Looks like you haven't added any botanical essentials to your collection yet.</p>
                        <Link
                            href="/"
                            className="bg-emerald-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20"
                        >
                            Start Exploring
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-8">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                                    >
                                        <div className="w-full sm:w-40 aspect-square rounded-[2rem] overflow-hidden border border-slate-100 flex-shrink-0">
                                            <img
                                                src={item.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6"}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-2 text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.name}</h3>
                                                <p className="text-2xl font-black text-emerald-800">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Premium Choice</p>
                                            <p className="text-slate-500 font-medium text-sm line-clamp-1">Expertly curated for your sanctuary.</p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 bg-white text-slate-400 hover:text-emerald-800 rounded-xl shadow-sm transition-all"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="text-lg font-black min-w-[30px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 bg-white text-slate-400 hover:text-emerald-800 rounded-xl shadow-sm transition-all"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <Trash2 className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/20">
                                <h2 className="text-3xl font-black tracking-tighter mb-8">Summary</h2>

                                <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                                    <div className="flex justify-between items-center">
                                        <p className="text-white/60 font-medium uppercase tracking-widest text-[10px]">Subtotal ({totalItems} items)</p>
                                        <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-white/60 font-medium uppercase tracking-widest text-[10px]">Shipping</p>
                                        <span className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-white/60 font-medium uppercase tracking-widest text-[10px]">Tax</p>
                                        <span className="text-xl font-bold">$0.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-10">
                                    <p className="font-black uppercase tracking-tighter text-xl">Total</p>
                                    <span className="text-4xl font-black tracking-tighter text-emerald-400">${totalPrice.toFixed(2)}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-emerald-500 text-slate-900 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
                                >
                                    Proceed to Checkout <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <button
                                    onClick={handleClearCart}
                                    className="w-full mt-6 text-white/40 hover:text-red-400 font-bold uppercase tracking-widest text-[10px] transition-colors"
                                >
                                    Discard Collection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
