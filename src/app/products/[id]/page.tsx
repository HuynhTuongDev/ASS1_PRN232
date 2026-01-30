import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { ChevronLeft, Edit, Calendar, DollarSign, Bookmark } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-blue-600 font-bold mb-16 transition-all group tracking-widest text-xs uppercase">
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Image Section */}
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl shadow-slate-200 border border-slate-100 group">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-100 text-8xl font-black italic">
                LUXE
              </div>
            )}
            <div className="absolute top-8 left-8">
              <span className="px-6 py-2 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                Premium Grade
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-blue-600"></div>
              <span className="text-blue-600 text-xs font-black uppercase tracking-[0.2em]">
                Verified Product
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-12 mb-12 pb-12 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Retail Price
                </span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Release Date
                </span>
                <span className="text-xl font-bold text-slate-700">
                  {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Product Synopsis</h2>
              <p className="text-slate-500 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {product.description}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-6">
              <Link
                href={`/products/${product.id}/edit`}
                className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
              >
                <Edit className="h-5 w-5" /> Edit Perspective
              </Link>
              <button className="p-5 border border-slate-200 rounded-[1.5rem] text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                <Bookmark className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
