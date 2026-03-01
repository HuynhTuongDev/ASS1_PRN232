import { VNPay, ProductCode, VnpCurrCode, VnpLocale } from "vnpay";

/**
 * Tạo URL thanh toán VNPAY sử dụng thư viện vnpay chính thức
 */
export function createPaymentUrl(orderId: string, amount: number, ipAddr: string) {
    // Sử dụng thông tin từ dự án book-project của bạn để đảm bảo hoạt động
    const tmnCode = "64DFOLZV";
    const secretKey = "O6J4Z89F24EL7WDPFXJEJBX47AGBLQVO";
    const vnpayHost = "https://sandbox.vnpayment.vn";
    const returnUrl = process.env.VNP_RETURNURL || "https://ass-1-prn-232-51al.vercel.app//api/vnpay/callback";

    const vnpay = new VNPay({
        tmnCode: tmnCode,
        secureSecret: secretKey,
        vnpayHost: vnpayHost,
        testMode: true,
    });

    // Tạo URL thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_Locale: VnpLocale.VN,
        vnp_CurrCode: VnpCurrCode.VND,
    });

    console.log("VNPAY Payment URL generated via library:", paymentUrl);
    return paymentUrl;
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}`;
}
