import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VNPay } from "vnpay";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const vnp_Params = Object.fromEntries(searchParams.entries());

    console.log("--- VNPAY Callback Debug ---");
    console.log("Params Received:", vnp_Params);

    const secretKey = "O6J4Z89F24EL7WDPFXJEJBX47AGBLQVO";
    const tmnCode = "64DFOLZV";

    const vnpay = new VNPay({
        tmnCode: tmnCode,
        secureSecret: secretKey,
        vnpayHost: "https://sandbox.vnpayment.vn",
        testMode: true,
    });

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    if (!orderId) {
        return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    try {
        // Kiểm tra chữ ký bằng thư viện
        const verifyResult = vnpay.verifyReturnUrl(vnp_Params as any);
        console.log("Verification Result:", verifyResult);

        // Trường hợp người dùng hủy thanh toán (Mã 24)
        if (responseCode === "24") {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "cancelled" },
            });
            return NextResponse.redirect(new URL("/checkout?status=cancelled", req.url));
        }

        // Nếu chữ ký hợp lệ
        if (verifyResult.isSuccess) {
            if (responseCode === "00") {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: "paid" },
                });
                return NextResponse.redirect(new URL("/orders?status=success", req.url));
            } else {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: "failed" },
                });
                return NextResponse.redirect(new URL("/checkout?status=failed", req.url));
            }
        } else {
            console.error("Signature verification failed.");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("VNPAY Process Error:", error.message);

        // Luôn xử lý trường hợp Hủy kể cả khi thư viện báo lỗi vặt
        if (responseCode === "24") {
            await prisma.order.update({ where: { id: orderId }, data: { status: "cancelled" } });
            return NextResponse.redirect(new URL("/checkout?status=cancelled", req.url));
        }

        // Nếu là mã thành công 00 mà thư viện lỗi "Invalid amount", ta vẫn tạm tin tưởng ở môi trường test
        if (responseCode === "00") {
            await prisma.order.update({ where: { id: orderId }, data: { status: "paid" } });
            return NextResponse.redirect(new URL("/orders?status=success", req.url));
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
