// app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/reports?type=&status=&search=&since=&limit=&page=
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const type = url.searchParams.get("type") ?? undefined;
        const status = url.searchParams.get("status") ?? undefined;
        const search = url.searchParams.get("search") ?? undefined;
        const since = url.searchParams.get("since") ?? undefined; // e.g. '7days'
        const limit = Number(url.searchParams.get("limit") ?? 50);
        const page = Number(url.searchParams.get("page") ?? 1);

        const where: any = {};

        if (type) {
            // simple contains match (case-insensitive)
            where.type = { contains: type, mode: "insensitive" };
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
                { type: { contains: search, mode: "insensitive" } },
                { reporterName: { contains: search, mode: "insensitive" } },
            ];
        }
        if (since) {
            // naive support: '24hours', '7days', '30days'
            const now = new Date();
            let sinceDate: Date | undefined;
            if (since === "24hours") {
                sinceDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            } else if (since === "7days") {
                sinceDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (since === "30days") {
                sinceDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }
            if (sinceDate) where.reportedAt = { gte: sinceDate };
        }

        const reports = await prisma.incidentReport.findMany({
            where,
            orderBy: { reportedAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                location: true,
                latitude: true,
                longitude: true,
                status: true,
                reportedAt: true,
                resolvedAt: true,
                reporterName: true,
                reporterEmail: true,
                trackingCode: true,
            },
        });

        const total = await prisma.incidentReport.count({ where });

        return NextResponse.json({ reports, total });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
    }
}

// PATCH /api/admin/reports (body { id, status })
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "id and status are required" }, { status: 400 });
        }

        const data: any = { status };

        if (status === "RESOLVED") {
            data.resolvedAt = new Date();
        } else {
            // if toggling away from resolved, clear resolvedAt
            data.resolvedAt = null;
        }

        const updated = await prisma.incidentReport.update({
            where: { id },
            data,
            select: {
                id: true,
                status: true,
                resolvedAt: true,
            },
        });

        return NextResponse.json({ updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}
