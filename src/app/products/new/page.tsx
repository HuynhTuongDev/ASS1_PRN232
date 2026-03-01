"use client";

import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NewProductPage() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-emerald-800 font-medium mb-8 transition-colors group">
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Quay lại trang sản phẩm
        </Link>

        <div className="mb-12 text-center pt-8">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Thêm sản phẩm mới</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Điền thông tin chi tiết bên dưới để thêm sản phẩm mới vào danh mục của bạn.
          </p>
        </div>

        <ProductForm />
      </main>
    </div>
  );
}
