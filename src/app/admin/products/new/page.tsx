import ProductForm from "@/components/ProductForm";

export default function AdminNewProductPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Thêm sản phẩm mới</h1>
                <p className="text-slate-500 font-medium">Điền thông tin chi tiết để thêm sản phẩm vào hệ thống.</p>
            </div>

            <ProductForm />
        </div>
    );
}
