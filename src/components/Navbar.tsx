"use client";

import Link from "next/link";
import { Leaf, PlusCircle, ShoppingBag, X, Minus, Plus, Trash2, LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatVND } from "@/lib/currencies";

export default function Navbar() {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, role, signOut } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-900/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ rotate: 12 }}
                  className="bg-emerald-800 p-1.5 rounded-lg shadow-md shadow-emerald-900/10"
                >
                  <Leaf className="h-5 w-5 text-white" />
                </motion.div>
                <span className="text-xl font-black tracking-tighter text-slate-900">
                  AURA<span className="text-emerald-800">.</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className="hidden sm:block text-slate-500 hover:text-emerald-800 font-semibold transition-colors text-xs uppercase tracking-widest">
                Bộ sưu tập
              </Link>

              {user && role === "admin" && (
                <Link
                  href="/admin/products/new"
                  className="hidden sm:flex bg-emerald-50 text-emerald-800 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  Thêm sản phẩm
                </Link>
              )}

              {user ? (
                <>

                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                    >
                      <User className="h-5 w-5" />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đăng nhập với</p>
                            <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Lịch sử đơn hàng
                          </Link>

                          {role === "admin" && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Quản trị viên
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Đăng xuất
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-slate-50 text-slate-900 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Link>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-emerald-900 text-white rounded-2xl hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 group"
              >
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-white text-emerald-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg border border-emerald-100"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-screen max-w-md"
              >
                <div className="h-full flex flex-col bg-white shadow-2xl rounded-l-[3rem] overflow-hidden">
                  <div className="flex-1 py-10 overflow-y-auto px-8 sm:px-10">
                    <div className="flex items-start justify-between mb-12">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Giỏ hàng của bạn</h2>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {cart.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-slate-50 p-8 rounded-full mb-6">
                              <ShoppingBag className="h-12 w-12 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Giỏ hàng trống</p>
                            <button
                              onClick={() => setIsCartOpen(false)}
                              className="mt-6 text-emerald-800 font-bold hover:underline"
                            >
                              Tiếp tục mua sắm
                            </button>
                          </div>
                        ) : (
                          <ul className="space-y-8">
                            {cart.map((item) => (
                              <motion.li
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={item.id}
                                className="flex py-2"
                              >
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100">
                                  <img
                                    src={item.image || "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                <div className="ml-6 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-bold text-slate-900">
                                      <h3 className="line-clamp-1">{item.name}</h3>
                                      <p className="ml-4">{formatVND(item.price * item.quantity)}</p>
                                    </div>
                                    <p className="mt-1 text-[10px] font-black text-emerald-800 uppercase tracking-widest">Lựa chọn cao cấp</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:text-emerald-800 transition-colors"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="font-bold text-xs min-w-[20px] text-center">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:text-emerald-800 transition-colors"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id)}
                                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-slate-100 py-10 px-10 bg-slate-50/50">
                      <div className="flex justify-between text-base font-medium text-slate-900 mb-2">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tạm tính</p>
                        <p className="text-2xl font-black tracking-tighter">{formatVND(totalPrice)}</p>
                      </div>
                      <p className="mt-0.5 text-[10px] text-slate-400 mb-8 italic">Chưa bao gồm phí vận chuyển và thuế.</p>
                      <div className="space-y-4">
                        <Link
                          href="/checkout"
                          onClick={() => setIsCartOpen(false)}
                          className="w-full flex items-center justify-center rounded-2xl border border-transparent bg-emerald-900 px-6 py-5 text-base font-bold text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-950 transition-all active:scale-95"
                        >
                          Thanh toán an toàn
                        </Link>
                        <button
                          onClick={clearCart}
                          className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                          Xóa giỏ hàng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
