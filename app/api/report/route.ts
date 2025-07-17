import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()

        const data = {
            incidentType: formData.get("incidentType") as string,
            location: formData.get("location") as string,
            address: formData.get("address") as string,
            description: formData.get("description") as string,
            dateTime: formData.get("dateTime") as string,
            anonymous: formData.get("anonymous") === "true",
            contactMethod: formData.get("contactMethod") as string,
            contactInfo: formData.get("contactInfo") as string,
            evidence: formData.getAll("evidence") as File[], // You may handle file saving separately
        }

        // You can store this in a DB like Firestore, PostgreSQL, or Supabase
        const trackingCode = "CRISP-" + uuidv4().split("-")[0].toUpperCase()

        // TODO: Save `data` and `trackingCode` to your DB or external service here

        return NextResponse.json({ success: true, trackingCode })
    } catch (error) {
        console.error("Error submitting report:", error)
        return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 })
    }
}
