// api/stats/summary/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const [total, active, resolvedToday] = await Promise.all([
        prisma.incidentReport.count(),
        prisma.incidentReport.count({ where: { status: { not: "RESOLVED" } } }),
        prisma.incidentReport.count({
            where: {
                resolvedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)), // start of today
                },
            },
        }),
    ])

    const avgResponse = "8 min" // You can calculate this if you store timestamps between reported/resolved

    return NextResponse.json({
        totalIncidents: total,
        activeAlerts: active,
        resolvedToday,
        responseTime: avgResponse,
    })
}
