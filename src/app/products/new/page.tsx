import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors group">
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Products
        </Link>
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Add New Product</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Fill in the details below to add a new item to your store's inventory.
          </p>
        </div>

        <ProductForm />
      </main>
    </div>
  );
}
