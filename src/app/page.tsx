"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Search, Loader2, PackageX, SlidersHorizontal, ArrowRight, ShoppingBag, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-40 lg:pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center text-center lg:text-left">
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-emerald-50/50 border border-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in">
                <Sparkles className="h-3 w-3" />
                Botanical & Pure Essentials
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-slate-900 mb-8 leading-[0.85] tracking-tighter">
                HARMONIZE <br />
                <span className="text-gradient">YOUR SPACE.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 max-w-xl leading-relaxed">
                Discover curated essentials for an intentional life. High-integrity materials meets timeless design for the modern sanctuary.
              </p>
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <a href="#collection" className="group bg-emerald-900 text-white px-10 py-6 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95">
                  Explore Essentials <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link href="/products/new" className="bg-white border border-slate-200 text-slate-900 px-10 py-6 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95">
                  Join the Circle
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto lg:ml-auto">
                <div className="absolute inset-0 bg-emerald-900/5 rounded-[4rem] -rotate-3 translate-x-4 translate-y-4" />
                <div className="relative z-10 w-full h-full rounded-[4rem] overflow-hidden shadow-2xl shadow-emerald-900/10 rotate-2 hover:rotate-0 transition-transform duration-1000">
                  <img 
                    src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80" 
                    alt="Hero" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 lg:-left-12 z-20 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-emerald-50 flex items-center gap-5 max-w-[260px] animate-bounce-subtle">
                  <div className="bg-emerald-800 text-white p-4 rounded-3xl shadow-lg shadow-emerald-900/20">
                    <Leaf className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Our Choice</p>
                    <p className="text-lg font-bold text-slate-900 leading-tight">Organic Silk Candle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white rounded-[4rem] shadow-sm mb-32">
        <div className="bg-emerald-50/30 p-10 lg:p-16 rounded-[3.5rem] mb-20">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                The Collection
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                Explore our full range of curated essentials. Filter by name or style to find your perfect match.
              </p>
            </div>
            
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-0 bg-emerald-900/5 rounded-[2rem] scale-95 opacity-0 group-focus-within:scale-100 group-focus-within:opacity-100 transition-all duration-300" />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-800/40" />
              <input
                type="text"
                placeholder="Search the archive..."
                className="relative w-full pl-16 pr-16 py-6 rounded-[2rem] bg-white border border-emerald-100 focus:border-emerald-800/20 focus:ring-0 transition-all outline-none font-medium placeholder:text-slate-400 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shadow-sm cursor-pointer hover:bg-emerald-100 transition-all">
                <SlidersHorizontal className="h-4 w-4 text-emerald-800" />
              </div>
            </div>
          </header>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-emerald-50 border-t-emerald-800 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-800" />
              </div>
            </div>
            <p className="text-slate-500 font-bold mt-6 tracking-widest uppercase text-xs">Finding Your Aura...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-white p-8 rounded-full shadow-xl mb-6">
              <PackageX className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 underline decoration-blue-500/30">End of the line</h3>
            <p className="text-slate-500 font-medium italic">We couldn't find any items matching your search.</p>
          </div>
        )}
      </main>

      {/* Footer minimal */}
      <footer className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-emerald-900 p-2 rounded-lg">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 uppercase">AURA</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 AURA Essentials. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
