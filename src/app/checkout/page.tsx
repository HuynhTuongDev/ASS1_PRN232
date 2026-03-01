"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Truck, ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { formatVND } from "@/lib/currencies";
import { useNotification } from "@/context/NotificationContext";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useNotification();
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showCancelMsg, setShowCancelMsg] = useState(status === "cancelled");

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push("/login?redirect=/checkout");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: totalPrice,
                    userId: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || "Khách hàng",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    setSuccess(true);
                    clearCart();
                }
            } else {
                const data = await res.json();
                showToast("Đặt hàng thất bại: " + data.error, "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Đã xảy ra lỗi", "error");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="bg-emerald-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10">
                        <CheckCircle2 className="h-16 w-16 text-emerald-600" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Thanh toán thành công</h1>
                    <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto">Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được thanh toán và các nghệ nhân đang chuẩn bị lựa chọn của bạn.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/orders" className="bg-emerald-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 w-full sm:w-auto">
                            Xem lịch sử đơn hàng
                        </Link>
                        <Link href="/" className="text-emerald-800 font-black uppercase tracking-widest text-xs hover:underline">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
                <AnimatePresence>
                    {showCancelMsg && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-center justify-between overflow-hidden"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-amber-900 tracking-tight">Thanh toán đã bị hủy</p>
                                    <p className="text-sm text-amber-700 font-medium">Đừng lo lắng, đơn hàng của bạn vẫn chưa bị trừ tiền. Bạn có thể thử lại bất cứ lúc nào.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCancelMsg(false)} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                                <X className="h-5 w-5 text-amber-500" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12 mb-8">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Thanh toán</h1>
                        <p className="text-slate-500 font-medium">Hoàn tất mua hàng của bạn một cách an toàn và bảo mật.</p>
                    </div>

                    <div className="lg:col-span-7 space-y-12">
                        {/* Shipping Info */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <Truck className="h-6 w-6 text-emerald-800" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Thông tin vận chuyển</h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Họ và tên</label>
                                    <input type="text" defaultValue={user?.user_metadata?.full_name || ""} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 transition-all outline-none" placeholder="Nguyễn Văn A" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Địa chỉ Email</label>
                                    <input type="email" defaultValue={user?.email || ""} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 transition-all outline-none" placeholder="name@example.com" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Địa chỉ giao hàng</label>
                                    <input type="text" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-800 transition-all outline-none" placeholder="Số 123, Đường Hạnh Phúc, TP. Hồ Chí Minh" />
                                </div>
                            </div>
                        </section>

                        {/* Payment Info */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <CreditCard className="h-6 w-6 text-emerald-800" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Phương thức thanh toán</h2>
                            </div>

                            <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-emerald-100 flex items-center justify-center p-2 shadow-sm italic font-black text-emerald-900">VNPAY</div>
                                        <div>
                                            <p className="font-bold text-slate-900">Cổng thanh toán VNPAY</p>
                                            <p className="text-xs text-slate-500 font-medium">Bảo mật với mã hóa SSL 256-bit</p>
                                        </div>
                                    </div>
                                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-emerald-100">
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        Bạn sẽ được chuyển hướng đến cổng thanh toán an toàn của VNPAY để hoàn tất giao dịch. Chúng tôi hỗ trợ Thẻ nội địa, Thẻ quốc tế và Ứng dụng di động quét mã QR.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 sticky top-32">
                            <h2 className="text-3xl font-black tracking-tighter mb-8 text-slate-900">Tóm tắt đơn hàng</h2>

                            <div className="max-h-[300px] overflow-y-auto mb-8 space-y-4 pr-4 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">Số lượng: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-slate-900">{formatVND(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-10 pb-10 border-b border-slate-200">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Tạm tính</p>
                                    <p className="text-slate-900 font-bold">{formatVND(totalPrice)}</p>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Phí vận chuyển</p>
                                    <p className="text-emerald-800 font-bold uppercase text-[10px] tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Miễn phí</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-10">
                                <p className="text-xl font-black tracking-tighter text-slate-900 uppercase">Tổng cộng</p>
                                <p className="text-4xl font-black tracking-tighter text-emerald-900">{formatVND(totalPrice)}</p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || cart.length === 0}
                                className="w-full bg-emerald-900 text-white py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Thanh toán & Đặt hàng <ArrowRight className="h-5 w-5" /></>}
                            </button>
                            <p className="mt-6 text-center text-slate-400 text-[10px] font-medium leading-relaxed">
                                Bằng cách nhấp vào "Thanh toán & Đặt hàng", bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi. Tất cả các giao dịch được mã hóa và bảo mật.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
