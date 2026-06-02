-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "requestId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role" VARCHAR(20) NOT NULL,
    "userId" UUID,
    "agentId" UUID,
    "shipperId" UUID,
    "adminTokenHash" VARCHAR(64) NOT NULL,
    "approvedAt" TIMESTAMP(6),
    "completedAt" TIMESTAMP(6),
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("requestId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_adminTokenHash_key" ON "PasswordResetRequest"("adminTokenHash");
