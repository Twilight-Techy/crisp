// app/api/admin/moderators/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin/moderators/:id
 * PATCH /api/admin/moderators/:id
 * DELETE /api/admin/moderators/:id  (kept for completeness)
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const admin = await prisma.admin.findUnique({
            where: { id },
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

        if (!admin) {
            return NextResponse.json({ error: "Moderator not found" }, { status: 404 });
        }

        return NextResponse.json({ admin });
    } catch (err) {
        console.error("GET /api/admin/moderators/[id] error:", err);
        return NextResponse.json({ error: "Failed to fetch moderator" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const body = await req.json().catch(() => ({}));
        const {
            fullName,
            email,
            role,
            contactNumber,
            assignedArea,
            password, // optional
        } = body ?? {};

        // basic validation
        if (!fullName && !email && !role && !contactNumber && !assignedArea && !password) {
            return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
        }

        const updateData: any = {};

        if (fullName) updateData.fullName = String(fullName).trim();
        if (contactNumber !== undefined) updateData.contactNumber = contactNumber ? String(contactNumber).trim() : null;
        if (assignedArea !== undefined) updateData.assignedArea = assignedArea ? String(assignedArea).trim() : null;

        // map UI role -> enum
        if (role) {
            const r = String(role).toLowerCase();
            if (r === "administrator" || r === "admin") updateData.role = "ADMIN";
            else if (r === "analyst") updateData.role = "ANALYST";
            else updateData.role = "MODERATOR";
        }

        // handle email change and uniqueness
        if (email) {
            const normalized = String(email).trim().toLowerCase();
            const existing = await prisma.admin.findUnique({ where: { email: normalized } });
            if (existing && existing.id !== id) {
                return NextResponse.json({ error: "Email already in use" }, { status: 409 });
            }
            updateData.email = normalized;
        }

        // handle password (optional)
        if (password) {
            if (String(password).length < 6) {
                return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
            }
            const hash = await bcrypt.hash(String(password), 10);
            updateData.passwordHash = hash;
        }

        const updated = await prisma.admin.update({
            where: { id },
            data: updateData,
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

        return NextResponse.json({ admin: updated });
    } catch (err: any) {
        console.error("PATCH /api/admin/moderators/[id] error:", err);
        // prisma unique constraint or other DB error
        return NextResponse.json({ error: "Failed to update moderator" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "Missing moderator id" }, { status: 400 });
        }

        // ensure moderator exists
        const existing = await prisma.admin.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Moderator not found" }, { status: 404 });
        }

        // delete
        await prisma.admin.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/admin/moderators/[id] error:", err);
        return NextResponse.json({ error: "Failed to delete moderator" }, { status: 500 });
    }
}
