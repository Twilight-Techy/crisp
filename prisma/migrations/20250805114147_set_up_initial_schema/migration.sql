-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('RECEIVED', 'UNDER_INVESTIGATION', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."ContentCategory" AS ENUM ('EMERGENCY', 'SAFETY', 'MEDICAL', 'NON_EMERGENCY', 'NIGHT_SAFETY', 'GENERAL');

-- CreateTable
CREATE TABLE "public"."IncidentReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "is_anonymous" BOOLEAN NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'RECEIVED',
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "reporterName" TEXT,
    "reporterEmail" TEXT,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaAttachment" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentReportId" TEXT NOT NULL,

    CONSTRAINT "MediaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimelineUpdate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ReportStatus",
    "incidentReportId" TEXT NOT NULL,

    CONSTRAINT "TimelineUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Alert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "public"."AlertSeverity" NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SafetyTip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" "public"."ContentCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmergencyContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."ContentCategory" NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunityStat" (
    "id" TEXT NOT NULL,
    "totalReports" INTEGER NOT NULL,
    "responseRate" DOUBLE PRECISION NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "crimeReductionPercent" DOUBLE PRECISION NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncidentReport_trackingCode_key" ON "public"."IncidentReport"("trackingCode");

-- AddForeignKey
ALTER TABLE "public"."MediaAttachment" ADD CONSTRAINT "MediaAttachment_incidentReportId_fkey" FOREIGN KEY ("incidentReportId") REFERENCES "public"."IncidentReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimelineUpdate" ADD CONSTRAINT "TimelineUpdate_incidentReportId_fkey" FOREIGN KEY ("incidentReportId") REFERENCES "public"."IncidentReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
