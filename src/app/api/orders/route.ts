import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createPaymentUrl } from "@/lib/vnpay";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, totalAmount, userId, email, name } = body;

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email,
                    name,
                },
            });
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount,
                status: "pending", // Initial status for VNPAY
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        const ipAddr = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const paymentUrl = createPaymentUrl(order.id, totalAmount, ipAddr);

        return NextResponse.json({ order, paymentUrl }, { status: 201 });
    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // This would typically involve getting the user's ID from the session
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
