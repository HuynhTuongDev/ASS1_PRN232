import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import prisma from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-blue-600 font-bold mb-12 transition-all group tracking-widest text-xs uppercase">
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        
        <div className="mb-16 text-center lg:text-left">
          <span className="inline-block py-2 px-4 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Admin Management
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Edit <span className="text-blue-600">Product.</span></h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Refining the details for <span className="text-slate-900 font-bold">"{product.name}"</span> to maintain collection excellence.
          </p>
        </div>

        <ProductForm 
          initialData={{
            ...product,
            image: product.image ?? undefined
          }} 
          id={id} 
        />
      </main>
    </div>
  );
}
