"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { ArrowLeft, CreditCard, ShieldCheck, Truck, ShoppingBag, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const [isOrdered, setIsOrdered] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setIsOrdered(true);
            clearCart();
        }, 2000);
    };

    if (isOrdered) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-12 w-12 text-emerald-800" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Order Confirmed!</h1>
                    <p className="text-slate-500 mb-12 max-w-sm mx-auto font-medium">
                        Thank you for choosing AURA. Your premium essentials are being prepared for shipment.
                    </p>
                    <Link href="/" className="bg-emerald-900 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:scale-105 transition-transform inline-block">
                        Return to Collection
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-emerald-800 font-bold mb-12 transition-all group text-xs uppercase tracking-widest">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to bag
                </Link>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-7">
                        <h1 className="text-4xl font-black text-slate-900 mb-12 tracking-tighter">Shipping Details</h1>

                        <form onSubmit={handlePlaceOrder} className="space-y-12">
                            <section>
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                                    Contact Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input type="text" placeholder="First Name" required className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium" />
                                    <input type="text" placeholder="Last Name" required className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium" />
                                    <input type="email" placeholder="Email Address" required className="w-full md:col-span-2 px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium" />
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                                    Delivery Address
                                </h2>
                                <div className="grid gap-6">
                                    <input type="text" placeholder="Street Address" required className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium" />
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <input type="text" placeholder="City" required className="px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium" />
                                        <input type="text" placeholder="Postal Code" required className="px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium" />
                                        <select className="px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-emerald-800/20 focus:ring-4 focus:ring-emerald-800/5 outline-none transition-all font-medium">
                                            <option>Vietnam</option>
                                            <option>United States</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                                    Payment Method
                                </h2>
                                <div className="grid gap-4">
                                    <label className="flex items-center justify-between p-6 rounded-2xl border-2 border-emerald-900 bg-emerald-50/50 cursor-pointer transition-all">
                                        <div className="flex items-center gap-4">
                                            <CreditCard className="h-6 w-6 text-emerald-900" />
                                            <span className="font-bold text-slate-900">Online Payment</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-4 border-emerald-900 bg-white" />
                                    </label>
                                    <label className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-800/20 cursor-pointer transition-all grayscale opacity-50">
                                        <div className="flex items-center gap-4">
                                            <Truck className="h-6 w-6 text-slate-400" />
                                            <span className="font-bold text-slate-400">Cash on Delivery</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white" />
                                    </label>
                                </div>
                            </section>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading || cart.length === 0}
                                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-4"
                                >
                                    {loading ? "Verifying Transaction..." : `Complete Purchase — $${totalPrice.toFixed(2)}`}
                                    <ShieldCheck className="h-6 w-6" />
                                </button>
                                <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="h-4 w-4" /> Secure SSL Encrypted Checkout
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Order Summary</h2>
                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-100">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-bold">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-emerald-800 font-bold">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total to pay</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">${totalPrice.toFixed(2)}</p>
                                    </div>
                                    <ShoppingBag className="h-10 w-10 text-slate-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
