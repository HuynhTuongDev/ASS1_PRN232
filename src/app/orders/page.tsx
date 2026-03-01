"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, ShoppingBag, ArrowRight, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatVND } from "@/lib/currencies";
import { Suspense } from "react";

function OrdersContent() {
    const { user } = useAuth();
    const { clearCart, cart } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get("status");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "success" && cart.length > 0) {
            clearCart();
        }
    }, [status, clearCart, cart.length]);

    useEffect(() => {
        if (user) {
            fetch(`/api/orders?userId=${user.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setOrders([]);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Lịch sử đơn hàng</h1>
                    <p className="text-slate-500 font-medium">Theo dõi hành trình sưu tầm các sản phẩm thảo mộc cao cấp của bạn.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="animate-spin h-10 w-10 border-4 border-emerald-900 border-t-transparent rounded-full"></div>
                        <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Đang tải lịch sử...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3.5rem] border border-slate-100">
                        <div className="bg-white p-10 rounded-full shadow-2xl mb-8">
                            <Package className="h-16 w-16 text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Chưa có đơn hàng nào</h2>
                        <p className="text-slate-500 mb-10 max-w-xs text-center">Lịch sử của bạn đang trống. Hãy bắt đầu thêm các sản phẩm thiết yếu để xây dựng không gian của bạn.</p>
                        <Link
                            href="/"
                            className="bg-emerald-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20"
                        >
                            Bắt đầu khám phá
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-100/50 transition-all"
                            >
                                <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex flex-wrap gap-x-12 gap-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày đặt hàng</p>
                                            <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                                            <p className="font-bold text-slate-900">{formatVND(order.totalAmount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
                                            <p className="font-bold text-slate-900 text-xs">{order.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                                        {order.status === 'paid' ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Đã thanh toán</span>
                                            </>
                                        ) : order.status === 'pending' ? (
                                            <>
                                                <Clock className="h-4 w-4 text-amber-500" />
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Đang chờ</span>
                                            </>
                                        ) : order.status === 'shipped' ? (
                                            <>
                                                <Truck className="h-4 w-4 text-blue-500" />
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Đang giao</span>
                                            </>
                                        ) : order.status === 'delivered' ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Đã giao</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-4 w-4 text-red-500" />
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{order.status === 'failed' ? 'Thất bại' : order.status === 'cancelled' ? 'Đã hủy' : order.status}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {order.deliveryPhoto && (
                                    <div className="px-10 py-6 bg-emerald-50/30 border-b border-slate-100">
                                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">Ảnh xác nhận giao hàng</p>
                                        <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                            <img src={order.deliveryPhoto} className="w-full h-full object-cover" alt="Xác nhận giao hàng" />
                                        </div>
                                    </div>
                                )}

                                <div className="p-10 space-y-8">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-8">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{item.product.name}</h3>
                                                    <p className="font-black text-slate-900">{formatVND(item.price * item.quantity)}</p>
                                                </div>
                                                <p className="text-slate-500 font-medium text-sm mb-4 line-clamp-1">{item.product.description}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SL: {item.quantity}</span>
                                                    <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{formatVND(item.price)} / sản phẩm</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50/50 p-10 border-t border-slate-100 flex justify-end gap-4">
                                    <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-50 transition-all">
                                        Cần trợ giúp?
                                    </button>
                                    <Link href={`/products/${order.items[0]?.productId}`} className="px-8 py-3 bg-emerald-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-950 transition-all flex items-center gap-2">
                                        Mua lại <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-emerald-900 animate-spin" />
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
