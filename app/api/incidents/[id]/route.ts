// api/incidents/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params

    const incident = await prisma.incidentReport.findUnique({
        where: { id },
        include: {
            mediaAttachments: true,
            timelineUpdates: {
                orderBy: { timestamp: "desc" },
            },
        },
    })

    if (!incident) {
        return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json({ incident })
}
