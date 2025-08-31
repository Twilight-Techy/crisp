// app/api/incidents/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    // parse filters
    const types = searchParams.getAll('type')        // e.g. ?type=Theft&type=Vandalism
    const status = searchParams.get('status')    // e.g. RECEIVED / UNDER_INVESTIGATION / RESOLVED
    const since = searchParams.get('since')          // e.g. '7days', '24hours'

    // build where clause
    const where: any = {}
    if (types.length > 0) {
      // assume frontend sends canonical type strings matching DB (e.g. "Theft", "Vandalism")
        where.type = { in: types }
    }
    if (since) {
        let date = new Date()
        switch (since) {
            case '24hours':
                date.setDate(date.getDate() - 1)
                break
            case '7days':
                date.setDate(date.getDate() - 7)
                break
            case '30days':
                date.setMonth(date.getMonth() - 1)
                break
            case '90days':
                date.setMonth(date.getMonth() - 3)
                break
            // custom: don't add filter
        }
        where.reportedAt = { gte: date }
    }
    if (status && status !== 'all') {
        where.status = status
    }

    const incidents = await prisma.incidentReport.findMany({
        where,
      orderBy: { reportedAt: "desc" },
      select: {
          id: true,
          latitude: true,
          longitude: true,
          type: true,
          status: true,
          location: true,
          reportedAt: true,
          resolvedAt: true,
      },
  })

    return NextResponse.json({ incidents })
}
