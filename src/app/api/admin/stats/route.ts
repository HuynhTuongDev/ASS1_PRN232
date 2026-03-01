import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.aggregate({
                where: {
                    status: { in: ["paid", "shipped", "delivered"] }
                },
                _sum: { totalAmount: true },
            }),
        ]);

        return NextResponse.json({
            productCount,
            orderCount,
            userCount,
            revenue: totalRevenue._sum.totalAmount || 0,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
