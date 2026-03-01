import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, email, name } = body;

        if (!userId || !email) {
            return NextResponse.json({ error: "Missing information" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            // Check if email already exists with different ID (unlikely but safe)
            const existingEmail = await prisma.user.findUnique({ where: { email } });
            if (existingEmail) {
                user = await prisma.user.update({
                    where: { email },
                    data: { id: userId, name }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        id: userId,
                        email,
                        name,
                        role: "user", // Default role
                    },
                });
            }
        } else if (user.name !== name) {
            user = await prisma.user.update({
                where: { id: userId },
                data: { name },
            });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Auth sync error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
