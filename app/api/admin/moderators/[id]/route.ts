// app/api/admin/moderators/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
