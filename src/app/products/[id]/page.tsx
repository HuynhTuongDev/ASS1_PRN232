import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { ChevronLeft, Calendar, Banknote } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/currencies";
import DetailActions from "@/components/DetailActions";

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
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-emerald-800 font-bold mb-16 transition-all group tracking-widest text-xs uppercase">
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Quay lại Bộ sưu tập
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Image Section */}
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl shadow-emerald-900/5 border border-slate-100 group">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-100 text-8xl font-black italic">
                AURA
              </div>
            )}
            <div className="absolute top-8 left-8 flex flex-col gap-3">
              <span className="px-6 py-2 bg-white/90 backdrop-blur-md text-emerald-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                {product.category === 'General' ? 'Chung' :
                  product.category === 'Living' ? 'Đời sống' :
                    product.category === 'Wellness' ? 'Sức khỏe' :
                      product.category === 'Aroma' ? 'Hương thơm' :
                        product.category === 'Style' ? 'Phong cách' : 'Khác'}
              </span>
              <span className="px-6 py-2 bg-emerald-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                Hàng Cao Cấp
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-emerald-800"></div>
              <span className="text-emerald-800 text-xs font-black uppercase tracking-[0.2em]">
                Sản phẩm Chính hãng
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
              {product.name}
            </h1>

            <div className="flex items-center gap-12 mb-12 pb-12 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Banknote className="h-3 w-3" /> Giá bán lẻ
                </span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{formatVND(product.price)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Ngày đăng
                </span>
                <span className="text-xl font-bold text-slate-700">
                  {new Date(product.createdAt).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Mô tả sản phẩm</h2>
              <p className="text-slate-500 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {product.description}
              </p>
            </div>

            <DetailActions product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
