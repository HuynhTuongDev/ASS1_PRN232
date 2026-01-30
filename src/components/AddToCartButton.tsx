"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(product)}
            className="px-12 py-5 bg-emerald-900 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95"
        >
            <ShoppingBag className="h-5 w-5" />
            Add to Bag
        </button>
    );
}
