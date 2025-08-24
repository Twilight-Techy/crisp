// app/api/admin/reports/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const report = await prisma.incidentReport.findUnique({
            where: { id },
            include: {
                mediaAttachments: true,
                timelineUpdates: true,
            },
        });

        if (!report) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        // Map DB shape to the client-friendly shape the page expects
        const attachments = report.mediaAttachments.map((m) => {
            // derive a friendly "type" from fileType (basic mapping)
            const ft = (m.fileType || "").toLowerCase();
            let type = "file";
            if (ft.includes("image")) type = "image";
            else if (ft.includes("video")) type = "video";
            else if (ft.includes("audio")) type = "audio";

            // derive a simple name from fileUrl
            const parts = m.fileUrl.split("/");
            const name = parts[parts.length - 1] || m.fileUrl;

            return {
                url: m.fileUrl,
                type,
                fileType: m.fileType,
                name,
                uploadedAt: m.uploadedAt,
            };
        });

        const actionsTaken = (report.timelineUpdates || [])
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // oldest -> newest
            .map((t) => ({
                timestamp: t.timestamp,
                // prefer title, fallback to description
                action: t.title || t.description || "",
                // DB does not track actor in TimelineUpdate — show System if none
                by: "System",
            }));

        const payload = {
            id: report.id,
            title: report.title,
            description: report.description,
            type: report.type,
            location: report.location,
            latitude: report.latitude,
            longitude: report.longitude,
            coordinates: report.latitude != null && report.longitude != null
                ? `${Number(report.latitude).toFixed(5)}, ${Number(report.longitude).toFixed(5)}`
                : null,
            status: report.status, // will be one of: RECEIVED | UNDER_INVESTIGATION | RESOLVED
            reportedAt: report.reportedAt,
            resolvedAt: report.resolvedAt,
            reporterName: report.reporterName,
            reporterEmail: report.reporterEmail,
            trackingCode: report.trackingCode,
            attachments,
            actionsTaken,
        };

        return NextResponse.json(payload);
    } catch (err) {
        console.error("GET /api/admin/reports/[id] error:", err);
        return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/reports
 * body: {
 *   id: string,
 *   status?: string,           // UI status or enum (e.g. "pending-review" | "RECEIVED" | "in-progress" | "UNDER_INVESTIGATION" | "resolved" | "RESOLVED" | "closed")
 *   note?: string,
 *   assignedTo?: string,
 *   resolutionDetails?: string
 * }
 *
 * Behaviour:
 * - maps UI status -> DB enum (RECEIVED | UNDER_INVESTIGATION | RESOLVED)
 * - updates IncidentReport.status (and resolvedAt when mapping to RESOLVED)
 * - creates a TimelineUpdate with the note + assignedTo + resolutionDetails
 * - returns { updated, timelineUpdate }
 */
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { id, status, note, assignedTo, resolutionDetails } = body ?? {};

        if (!id) {
            return NextResponse.json({ error: "Missing report id" }, { status: 400 });
        }

        // Map UI statuses to Prisma enum values.
        // Accepts either the UI values or direct enum values.
        const mapToEnum = (s?: string | null) => {
            if (!s) return undefined;
            const lower = s.toString().toLowerCase();
            if (["received", "received".toLowerCase(), "pending-review", "pendingreview"].includes(lower)) return "RECEIVED";
            if (["under_investigation", "under-investigation", "underinvestigation", "in-progress", "inprogress"].includes(lower)) return "UNDER_INVESTIGATION";
            if (["resolved", "closed"].includes(lower)) return "RESOLVED";
            // fallback: if it's already one of enum strings
            if (["RECEIVED", "UNDER_INVESTIGATION", "RESOLVED"].includes(s)) return s;
            return undefined;
        };

        const mappedStatus = mapToEnum(status) as "RECEIVED" | "UNDER_INVESTIGATION" | "RESOLVED" | undefined;

        // Confirm report exists
        const existing = await prisma.incidentReport.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        // Build timeline update description
        const parts: string[] = [];
        if (note) parts.push(`Note: ${note}`);
        if (assignedTo) parts.push(`Assigned to: ${assignedTo}`);
        if (resolutionDetails) parts.push(`Resolution: ${resolutionDetails}`);
        const timelineDescription = parts.join("\n\n") || `Status update${mappedStatus ? ` -> ${mappedStatus}` : ""}`;

        // Create the timeline update first (so we always record an action)
        const timelineUpdate = await prisma.timelineUpdate.create({
            data: {
                title: `Action by admin${mappedStatus ? ` - ${mappedStatus}` : ""}`,
                description: timelineDescription,
                status: mappedStatus ?? undefined,
                incidentReportId: id,
            },
        });

        // Update the incident report status + resolvedAt logic
        const updateData: any = {};
        if (mappedStatus) {
            updateData.status = mappedStatus;
            // If resolved, set resolvedAt now; otherwise clear resolvedAt
            if (mappedStatus === "RESOLVED") {
                updateData.resolvedAt = new Date();
            } else {
                updateData.resolvedAt = null;
            }
        }

        const updated = await prisma.incidentReport.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                status: true,
                resolvedAt: true,
                reportedAt: true,
                trackingCode: true,
            },
        });

        return NextResponse.json({ updated, timelineUpdate });
    } catch (err) {
        console.error("PATCH /api/admin/reports error:", err);
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/reports/[id]
 * Deletes the report with given id and its related mediaAttachments and timelineUpdates.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "Missing report id" }, { status: 400 });
        }

        // Verify exists
        const existing = await prisma.incidentReport.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 });
        }

        // Delete children then parent in a transaction to avoid FK issues
        await prisma.$transaction([
            prisma.mediaAttachment.deleteMany({ where: { incidentReportId: id } }),
            prisma.timelineUpdate.deleteMany({ where: { incidentReportId: id } }),
            prisma.incidentReport.delete({ where: { id } }),
        ]);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/admin/reports/[id] error:", err);
        return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
    }
}