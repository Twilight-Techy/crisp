import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()

      const type = formData.get("incidentType") as string
      const location = formData.get("location") as string
      const description = formData.get("description") as string
      const isAnonymous = formData.get("anonymous") === "true"
      const reporterName = isAnonymous ? null : (formData.get("contactMethod") === "name" ? formData.get("contactInfo")?.toString() : null)
      const reporterEmail = isAnonymous ? null : (formData.get("contactMethod") === "email" ? formData.get("contactInfo")?.toString() : null)
      const address = formData.get("address") as string
      const dateTime = formData.get("dateTime") as string
      const evidence = formData.getAll("evidence") as File[]

      // Extract lat/lng from form or use dummy placeholder
      const latitude = parseFloat(formData.get("latitude") as string) || 0
      const longitude = parseFloat(formData.get("longitude") as string) || 0

      const trackingCode = "CRISP-" + uuidv4().split("-")[0].toUpperCase()

      // Create report entry
      const report = await prisma.incidentReport.create({
          data: {
              title: type,
              description,
              type,
              location: address || location,
              latitude,
              longitude,
              isAnonymous,
              trackingCode,
              reporterName,
              reporterEmail,
              reportedAt: new Date(dateTime),
          },
      })

      // Upload media files to Vercel Blob and store references
      const uploadPromises = evidence.map(async (file) => {
          const blob = await put(`evidence/${uuidv4()}-${file.name}`, file, {
              access: "public",
          })

          return prisma.mediaAttachment.create({
              data: {
                  fileUrl: blob.url,
                  fileType: file.type,
                  incidentReportId: report.id,
              },
          })
      })

      await Promise.all(uploadPromises)

      return NextResponse.json({ success: true, trackingCode })
  } catch (error) {
      console.error("Error submitting report:", error)
      return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 })
  }
}
