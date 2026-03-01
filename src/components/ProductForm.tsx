"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, Image as ImageIcon, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProductFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
  };
  id?: number;
}

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";

export default function ProductForm({ initialData, id }: ProductFormProps) {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const { showToast } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    image: initialData?.image || "",
    category: initialData?.category || "General",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?redirect=" + (id ? `/admin/products/edit/${id}` : "/admin/products/new"));
      } else if (role !== "admin") {
        router.push("/");
      }
    }
  }, [user, role, authLoading, router, id]);

  if (authLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-900" /></div>;
  if (!user || role !== "admin") return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: data.publicUrl });
      showToast("Tải ảnh lên thành công", "success");
    } catch (error: any) {
      console.error('Lỗi khi tải ảnh lên:', error);
      showToast(`Lỗi khi tải ảnh lên: ${error.message || 'Lỗi không xác định'}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Đã xảy ra lỗi");

      showToast(id ? "Cập nhật sản phẩm thành công" : "Tạo sản phẩm thành công", "success");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast("Lỗi khi lưu sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100">
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Tên sản phẩm</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium placeholder:text-slate-300"
            placeholder="VD: Áo thun cao cấp"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Mô tả</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none font-medium placeholder:text-slate-300"
            placeholder="Mô tả về chất liệu, phong cách..."
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Danh mục</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700"
          >
            <option value="General">Chung</option>
            <option value="Living">Đời sống</option>
            <option value="Wellness">Sức khỏe</option>
            <option value="Aroma">Hương thơm</option>
            <option value="Style">Phong cách</option>
            <option value="Other">Khác</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Giá (VND)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
              <input
                type="number"
                step="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-10 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-bold placeholder:text-slate-300"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Hình ảnh sản phẩm</label>
            <div className="space-y-4">
              {formData.image ? (
                <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-slate-100 group border border-slate-200 shadow-inner">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image load error:", formData.image);
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="p-4 bg-white text-red-600 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
                      title="Remove Image"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-[1.5rem] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                >
                  {uploading ? (
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                  ) : (
                    <>
                      <div className="p-4 bg-slate-50 rounded-full group-hover:bg-white group-hover:shadow-lg transition-all">
                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-blue-600">Thả tệp hoặc Nhấp để chọn</span>
                    </>
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <ImageIcon className="h-4 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium placeholder:text-slate-300"
                  placeholder="Hoặc dán URL hình ảnh..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <>
            {id ? "Xác nhận thay đổi" : "Tạo sản phẩm ngay"}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}
