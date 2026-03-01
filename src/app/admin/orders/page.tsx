"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Loader2, CheckCircle2, CheckCircle, XCircle, Clock, Truck, Eye, Upload, AlertCircle } from "lucide-react";
import { formatVND } from "@/lib/currencies";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/context/NotificationContext";

export default function AdminOrdersPage() {
    const { showToast } = useNotification();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const selectedOrder = orders.find(o => o.id === selectedOrderId);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, status: string, deliveryPhoto?: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status, deliveryPhoto }),
            });
            const data = await res.json();

            if (res.ok) {
                setOrders(orders.map(o => o.id === orderId ? data : o));
                showToast(`Cập nhật trạng thái hành công`, "success");
                return true;
            } else {
                showToast(data.error || "Không thể cập nhật trạng thái", "error");
                return false;
            }
        } catch (error: any) {
            showToast("Cập nhật thất bại: " + error.message, "error");
            return false;
        }
    };

    const handlePhotoUpload = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(orderId);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${orderId}-${Math.random()}.${fileExt}`;
            const filePath = `delivery/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            const success = await updateStatus(orderId, "delivered", data.publicUrl);
            if (success) {
                showToast("Xác nhận giao hàng thành công!", "success");
            }
        } catch (error: any) {
            showToast("Lỗi khi tải ảnh: " + error.message, "error");
        } finally {
            setUploading(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "paid": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "shipped": return <Truck className="h-4 w-4 text-blue-500" />;
            case "delivered": return <CheckCircle className="h-4 w-4 text-emerald-600" />;
            case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Clock className="h-4 w-4 text-amber-500" />;
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Quản lý đơn hàng</h1>
                <p className="text-slate-500 font-medium">Theo dõi và cập nhật trạng thái đơn hàng của khách.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn hàng</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng cộng</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cập nhật nhanh</th>
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
                                    orders.map((order) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            key={order.id}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm italic tracking-tighter">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-slate-900 text-sm">{order.user.name || "Khách hàng"}</p>
                                                    <p className="text-[10px] font-medium text-slate-500">{order.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.status)}
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                                                        order.status === "shipped" ? "bg-blue-50 text-blue-700" :
                                                            order.status === "delivered" ? "bg-emerald-100 text-emerald-800" :
                                                                order.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                                                        }`}>
                                                        {order.status === "paid" ? "Đã thanh toán" :
                                                            order.status === "shipped" ? "Đang giao" :
                                                                order.status === "delivered" ? "Đã giao" :
                                                                    order.status === "cancelled" ? "Đã hủy" : "Chờ xử lý"}
                                                    </span>
                                                </div>
                                                {order.deliveryPhoto && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <button
                                                            onClick={() => setSelectedPhoto(order.deliveryPhoto)}
                                                            className="block w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 transition-colors group/photo relative"
                                                        >
                                                            <img src={order.deliveryPhoto} className="w-full h-full object-cover" alt="Giao hàng" />
                                                            <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity text-white">
                                                                <Eye className="h-4 w-4" />
                                                            </div>
                                                        </button>
                                                        <span className="text-[8px] font-bold text-slate-400 italic">Bấm để xem</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 font-bold text-slate-900 text-sm">
                                                {formatVND(order.totalAmount)}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* View Details Button - Always visible on hover */}
                                                    <button
                                                        onClick={() => setSelectedOrderId(order.id)}
                                                        className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Xem chi tiết đơn hàng"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    {order.status !== "cancelled" && order.status !== "delivered" && (
                                                        <>
                                                            {order.status === "paid" && (
                                                                <button
                                                                    onClick={() => updateStatus(order.id, "shipped")}
                                                                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                                    title="Đánh dấu là Đang Giao"
                                                                >
                                                                    <Truck className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            {order.status === "shipped" && (
                                                                <label className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer group/upload">
                                                                    {uploading === order.id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                                    ) : (
                                                                        <div className="flex items-center gap-2">
                                                                            <Upload className="h-4 w-4" />
                                                                            <span className="text-[10px] font-bold uppercase tracking-wider group-hover/upload:inline hidden">Xác nhận giao hàng</span>
                                                                            <input
                                                                                type="file"
                                                                                className="hidden"
                                                                                accept="image/*"
                                                                                onChange={(e) => handlePhotoUpload(order.id, e)}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </label>
                                                            )}
                                                            {order.status === "pending" && (
                                                                <button
                                                                    onClick={() => updateStatus(order.id, "paid")}
                                                                    className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                                    title="Đánh dấu là Đã Thanh Toán"
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            {order.status !== "shipped" && order.status !== "delivered" && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm("Hủy đơn hàng này?")) {
                                                                            updateStatus(order.id, "cancelled");
                                                                        }
                                                                    }}
                                                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                    title="Hủy đơn hàng"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {(order.status === "cancelled" || order.status === "delivered") && (
                                                    <div className="group-hover:hidden flex justify-end">
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic px-4">
                                                            {order.status === "delivered" ? "Đã hoàn thành" : "Đã chốt"}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrderId && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
                        onClick={() => setSelectedOrderId(null)}
                    >
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className="relative max-w-2xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                                        #{selectedOrder.id.slice(0, 8).toUpperCase()}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                        Chi tiết đơn hàng - {new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrderId(null)}
                                    className="p-4 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-10">
                                {/* Customer Information */}
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Thông tin khách hàng</h4>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider text-[8px]">Họ và Tên</p>
                                            <p className="text-lg font-black text-slate-900">{selectedOrder.user.name || "Khách hàng"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider text-[8px]">Email liên hệ</p>
                                            <p className="text-lg font-black text-slate-900">{selectedOrder.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Proof Photo if Delivered - MOVED TO TOP FOR VISIBILITY */}
                                {selectedOrder.status === "delivered" && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bằng chứng giao hàng</h4>
                                        {selectedOrder.deliveryPhoto ? (
                                            <button
                                                onClick={() => setSelectedPhoto(selectedOrder.deliveryPhoto)}
                                                className="w-full aspect-video rounded-[2rem] overflow-hidden border-4 border-emerald-100 hover:border-emerald-500 transition-all group relative shadow-xl bg-slate-50"
                                            >
                                                <img src={selectedOrder.deliveryPhoto} className="w-full h-full object-cover" alt="Xác nhận" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <div className="bg-white p-4 rounded-full text-slate-900 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                                                        <Eye className="h-6 w-6" />
                                                    </div>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="p-8 rounded-[2rem] bg-amber-50 border-2 border-dashed border-amber-200 text-center">
                                                <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                                                <p className="text-amber-900 font-bold">Chưa có ảnh bằng chứng</p>
                                                <p className="text-amber-600 text-xs mt-1">Vui lòng kiểm tra lại quy trình tải ảnh lên.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Order Items */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm đã đặt</h4>
                                    {selectedOrder.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-6 p-2 group">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                                                <img
                                                    src={item.product.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6"}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt={item.product.name}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="font-black text-slate-900 text-lg leading-tight">{item.product.name}</h5>
                                                        <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest min-w-[150px]">
                                                            Đơn giá: {formatVND(item.price)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-slate-900 text-lg">{formatVND(item.price * item.quantity)}</p>
                                                        <p className="text-emerald-800 text-[10px] font-black uppercase tracking-widest mt-1">Số lượng: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="border-t border-slate-100 pt-8 space-y-4">
                                    <div className="flex justify-between items-center bg-emerald-900 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-900/20">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Tổng giá trị đơn hàng</p>
                                            <h4 className="text-4xl font-black tracking-tighter leading-none italic">{formatVND(selectedOrder.totalAmount)}</h4>
                                        </div>
                                        <div className="text-right">
                                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 bg-white ${selectedOrder.status === "paid" ? "text-emerald-700" :
                                                selectedOrder.status === "shipped" ? "text-blue-700" :
                                                    selectedOrder.status === "delivered" ? "text-emerald-800" :
                                                        selectedOrder.status === "cancelled" ? "text-red-700" : "text-amber-700"
                                                }`}>
                                                {getStatusIcon(selectedOrder.status)}
                                                {selectedOrder.status === "paid" ? "Đã thanh toán" :
                                                    selectedOrder.status === "shipped" ? "Đang giao" :
                                                        selectedOrder.status === "delivered" ? "Đã hoàn thành" :
                                                            selectedOrder.status === "cancelled" ? "Đã hủy" : "Đang xử lý"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Photo Viewer Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selectedPhoto} className="w-full aspect-square md:aspect-video object-contain bg-slate-50" alt="Bằng chứng giao hàng" />
                            <div className="absolute top-6 right-6">
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    className="p-4 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-2xl transition-all shadow-xl"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-8 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg tracking-tighter uppercase">Minh chứng giao hàng</h3>
                                        <p className="text-slate-500 text-sm font-medium italic">Ảnh chụp thực tế từ nhân viên giao hàng.</p>
                                    </div>
                                </div>
                                <a
                                    href={selectedPhoto}
                                    download
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-900 transition-all shadow-xl active:scale-95"
                                >
                                    Tải ảnh xuống
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
