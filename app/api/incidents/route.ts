import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const url = new URL(request.url)
    const types = url.searchParams.getAll("type")       // ?type=theft&type=assault
    const severity = url.searchParams.get("severity")    // high|medium|low
    const since = url.searchParams.get("since")         // e.g. '7days'

    // Build a Prisma filter:
    const where: any = {}
    if (types.length) where.type = { in: types }
    if (severity && severity !== "all") where.status = severity.toUpperCase()
    if (since) {
        const days = parseInt(since.replace("days", ""), 10)
        where.reportedAt = { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    }

    const incidents = await prisma.incidentReport.findMany({
        where,
        select: {
            id: true,
            trackingCode: true,
            type: true,
            location: true,
            latitude: true,
            longitude: true,
            status: true,
            reportedAt: true,
        },
    })

    return NextResponse.json({ incidents })
}
