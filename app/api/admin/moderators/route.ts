// app/api/admin/moderators/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const {
            fullName,
            email,
            password,
            role,
            contactNumber,
            assignedArea,
        } = body ?? {};

        // Basic validation
        if (!fullName || !email || !password || !role) {
            return NextResponse.json({ error: "fullName, email, password and role are required" }, { status: 400 });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        // very small email sanity check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        // check uniqueness
        const existing = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // map UI role strings to enum values (accept both lower-case UI and enum names)
        const mapRole = (r: string) => {
            const s = String(r).toLowerCase();
            if (s === "moderator" || s === "moderator") return "MODERATOR";
            if (s === "admin" || s === "administrator") return "ADMIN";
            if (s === "analyst") return "ANALYST";
            // default
            return "MODERATOR";
        };

        const roleEnum = mapRole(role) as "MODERATOR" | "ADMIN" | "ANALYST";

        const created = await prisma.admin.create({
            data: {
                fullName: fullName.trim(),
                email: normalizedEmail,
                passwordHash,
                role: roleEnum,
                contactNumber: contactNumber ? String(contactNumber).trim() : undefined,
                assignedArea: assignedArea ? String(assignedArea).trim() : undefined,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                contactNumber: true,
                assignedArea: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ admin: created }, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/admin/moderators error:", err);

        // Prisma unique constraint code P2002 might be thrown if migration out of sync,
        // but we handled uniqueness earlier. Still return safe error.
        return NextResponse.json({ error: "Failed to create moderator" }, { status: 500 });
    }
}

/**
 * GET /api/admin/moderators?search=&limit=&page=
 * - search: matches fullName, email, assignedArea, role (case-insensitive contains)
 * - limit, page: optional pagination
 *
 * Returns: { moderators: [...], total }
 */
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get("search") ?? undefined;
        const limit = Number(url.searchParams.get("limit") ?? 50);
        const page = Number(url.searchParams.get("page") ?? 1);

        const where: any = {};

        if (search) {
            const s = String(search).trim();
            where.OR = [
                { fullName: { contains: s, mode: "insensitive" } },
                { email: { contains: s, mode: "insensitive" } },
                { assignedArea: { contains: s, mode: "insensitive" } },
                // match role as contains (also support direct enum name)
                { role: { contains: s, mode: "insensitive" } },
            ];
        }

        const [moderators, total] = await Promise.all([
            prisma.admin.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    contactNumber: true,
                    assignedArea: true,
                    createdAt: true,
                },
            }),
            prisma.admin.count({ where }),
        ]);

        return NextResponse.json({ moderators, total });
    } catch (err) {
        console.error("GET /api/admin/moderators error:", err);
        return NextResponse.json({ error: "Failed to list moderators" }, { status: 500 });
    }
}