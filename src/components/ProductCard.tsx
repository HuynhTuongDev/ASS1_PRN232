"use client";

import Link from "next/link";
import { Edit, Trash2, ArrowUpRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

import { formatVND } from "@/lib/currencies";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user, role } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(6,_95,_70,_0.05)] transition-all duration-500 flex flex-col h-full active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full h-full"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 font-bold bg-slate-100/50">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <span className="text-xs uppercase tracking-widest opacity-50">Không có ảnh</span>
            </div>
          )}
        </motion.div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-emerald-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
            {product.category === "General" ? "Chung" :
              product.category === "Living" ? "Đời sống" :
                product.category === "Wellness" ? "Sức khỏe" :
                  product.category === "Aroma" ? "Hương thơm" :
                    product.category === "Style" ? "Phong cách" :
                      product.category === "Other" ? "Khác" : product.category}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
          {user && role === "admin" && (
            <Link
              href={`/admin/products/edit/${product.id}`}
              className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all transform hover:scale-110 shadow-xl"
              title="Chỉnh sửa sản phẩm"
            >
              <Edit className="h-5 w-5" />
            </Link>
          )}
          <button
            onClick={() => addToCart(product)}
            className="p-4 bg-white rounded-2xl text-emerald-800 hover:bg-emerald-800 hover:text-white transition-all transform hover:scale-110 shadow-xl"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          {user && role === "admin" && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-4 bg-white/90 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-xl"
              title="Xóa sản phẩm"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-emerald-900 text-white px-4 py-2 rounded-full shadow-lg border border-emerald-800/20">
          <span className="text-sm font-black">{formatVND(product.price)}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`} className="group/title">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover/title:text-emerald-800 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed font-medium">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <Link
            href={`/products/${product.id}`}
            className="group/btn inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-800 transition-colors"
          >
            Xem thêm
            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-emerald-800 group-hover/btn:text-white transition-all">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="bg-emerald-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-950 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-900/10"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Thêm
          </button>
        </div>
      </div>
    </motion.div>
  );
}
