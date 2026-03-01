import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status, deliveryPhoto } = body;

        // Kiểm tra xem đơn hàng có đang bị hủy không
        const currentOrder = await prisma.order.findUnique({
            where: { id: orderId },
            select: { status: true },
        });

        if (currentOrder?.status === "cancelled") {
            return NextResponse.json({ error: "Cannot update a cancelled order" }, { status: 400 });
        }

        // SỬ DỤNG RAW SQL ĐỂ TRÁNH LỖI LOCK BINARY TRÊN WINDOWS
        // Sử dụng $executeRaw với tagged template literal (an toàn hơn và tự động handle type)
        try {
            console.log("Đang cập nhật DB cho đơn hàng:", orderId, "với ảnh:", deliveryPhoto);
            await (prisma as any).$executeRaw`
                UPDATE "Order" 
                SET "status" = ${status}, 
                    "deliveryPhoto" = ${deliveryPhoto || null} 
                WHERE "id" = ${orderId}
            `;
            console.log("Cập nhật DB thành công (Raw SQL)");
        } catch (rawError: any) {
            console.error("Lỗi cập nhật Raw SQL:", rawError.message);
            // Fallback cuối cùng nếu Raw SQL vẫn lỗi
            try {
                await (prisma.order as any).update({
                    where: { id: orderId },
                    data: { status, deliveryPhoto: deliveryPhoto || undefined }
                });
            } catch (fallbackError: any) {
                console.error("Tất cả các phương thức cập nhật đều thất bại:", fallbackError.message);
                return NextResponse.json({
                    error: "Không thể lưu vào Database. Lỗi: " + fallbackError.message
                }, { status: 500 });
            }
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
