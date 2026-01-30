import Link from "next/link";
import { Leaf, PlusCircle, Home, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-emerald-900/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-800 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-emerald-900/10">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">
                AURA<span className="text-emerald-800">.</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-10">
            <Link href="/" className="text-slate-500 hover:text-emerald-800 font-semibold transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
              Collection
            </Link>
            <Link 
              href="/products/new" 
              className="bg-emerald-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-emerald-950 transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2 group active:scale-95"
            >
              <PlusCircle className="h-4 w-4 text-emerald-300 group-hover:rotate-90 transition-transform duration-300" />
              New Product
            </Link>
          </div>

          <div className="flex sm:hidden">
            <Link href="/products/new" className="p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <PlusCircle className="h-6 w-6 text-emerald-800" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
