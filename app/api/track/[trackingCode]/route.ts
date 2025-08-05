import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { trackingCode: string } }
) {
    try {
        const { trackingCode } = params

        const report = await prisma.incidentReport.findUnique({
            where: { trackingCode },
            include: {
                timelineUpdates: {
                    orderBy: { timestamp: "asc" },
                },
            },
        })

        if (!report) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 })
        }

        return NextResponse.json(report)
    } catch (error) {
        console.error("Track API Error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
