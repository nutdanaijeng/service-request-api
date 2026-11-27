-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "service_request" (
    "id" SERIAL NOT NULL,
    "citizen_id" VARCHAR(13) NOT NULL,
    "office_code" VARCHAR(10) NOT NULL,
    "description" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "service_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_request_citizen_id_idx" ON "service_request"("citizen_id");

-- CreateIndex
CREATE INDEX "service_request_office_code_status_created_at_idx" ON "service_request"("office_code", "status", "created_at" DESC);
