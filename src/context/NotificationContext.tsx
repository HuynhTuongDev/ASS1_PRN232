"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface NotificationContextType {
    showToast: (message: string, type?: ToastType) => void;
    confirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        message: string;
        resolve: (value: boolean) => void;
    } | null>(null);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const confirm = useCallback((message: string) => {
        return new Promise<boolean>((resolve) => {
            setConfirmState({ isOpen: true, message, resolve });
        });
    }, []);

    const handleConfirm = (value: boolean) => {
        if (confirmState) {
            confirmState.resolve(value);
            setConfirmState(null);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showToast, confirm }}>
            {children}

            {/* Custom Confirmation Modal */}
            <AnimatePresence>
                {confirmState?.isOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => handleConfirm(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-sm w-full text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-900 rounded-full flex items-center justify-center mx-auto mb-8">
                                <AlertCircle className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Xác nhận?</h3>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{confirmState.message}</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleConfirm(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl font-bold bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleConfirm(true)}
                                    className="flex-1 px-8 py-4 rounded-2xl font-bold bg-emerald-900 text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-950 transition-all active:scale-95"
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toasts */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl border min-w-[320px] max-w-md ${toast.type === "success"
                                ? "bg-white border-emerald-100 text-emerald-900"
                                : toast.type === "error"
                                    ? "bg-red-50 border-red-100 text-red-900"
                                    : "bg-blue-50 border-blue-100 text-blue-900"
                                }`}
                        >
                            <div className={`p-2 rounded-xl flex-shrink-0 ${toast.type === "success"
                                ? "bg-emerald-50 text-emerald-600"
                                : toast.type === "error"
                                    ? "bg-white text-red-600"
                                    : "bg-white text-blue-600"
                                }`}>
                                {toast.type === "success" && <CheckCircle2 className="h-5 w-5" />}
                                {toast.type === "error" && <AlertCircle className="h-5 w-5" />}
                                {toast.type === "info" && <Info className="h-5 w-5" />}
                            </div>
                            <p className="flex-1 text-sm font-bold leading-tight">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
