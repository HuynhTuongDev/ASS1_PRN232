"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/products/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-900" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500 font-bold">Không tìm thấy sản phẩm</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Chỉnh sửa sản phẩm</h1>
                    <p className="text-slate-500 font-medium">Cập nhật thông tin chi tiết cho sản phẩm của bạn.</p>
                </div>

                <ProductForm
                    id={product.id}
                    initialData={{
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        category: product.category,
                        image: product.image
                    }}
                />
            </main>
        </div>
    );
}
