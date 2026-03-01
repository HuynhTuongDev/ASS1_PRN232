import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, secret } = body;

        // Simple check to prevent unauthorized use
        if (secret !== "aura-admin-2026") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.update({
            where: { email },
            data: { role: "admin" },
        });

        return NextResponse.json({ message: `User ${email} is now an admin`, user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
