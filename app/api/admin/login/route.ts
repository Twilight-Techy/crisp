// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { email, password } = body ?? {};

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // find admin by email
        const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
        if (!admin) {
            // do not reveal whether email exists
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const match = await bcrypt.compare(String(password), admin.passwordHash);
        if (!match) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // create a short session token (stateless demo token)
        // NOTE: for production you should issue a signed JWT or set a secure HttpOnly cookie.
        const token = randomUUID();

        // Optionally: persist token in DB / session store. For now we return it to client.
        const payload = {
            token,
            admin: {
                id: admin.id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
            },
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (err) {
        console.error("POST /api/admin/login error:", err);
        return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
    }
}
