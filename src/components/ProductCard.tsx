import Link from "next/link";
import { Edit, Trash2, ArrowUpRight, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(6,_95,_70,_0.05)] transition-all duration-500 flex flex-col h-full active:scale-[0.98]">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 font-bold bg-slate-100/50">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
            <span className="text-xs uppercase tracking-widest opacity-50">No Image</span>
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
          <Link
            href={`/products/${product.id}/edit`}
            className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all transform hover:scale-110 shadow-xl"
            title="Edit Product"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="p-4 bg-white/90 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 shadow-xl"
            title="Delete Product"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
          <span className="text-sm font-black text-slate-900">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`} className="group/title">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover/title:text-emerald-800 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
          {product.description}
        </p>
        
        <Link
          href={`/products/${product.id}`}
          className="mt-auto group/btn inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-800 transition-colors"
        >
          Explore
          <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-emerald-800 group-hover/btn:text-white transition-all">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
