-- CreateTable
CREATE TABLE IF NOT EXISTS "CurriculumScheme" (
    "id" TEXT NOT NULL,
    "regulationCode" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "effectiveBatch" TEXT NOT NULL,
    "totalCredits" DOUBLE PRECISION NOT NULL,
    "coreTheoryCredits" DOUBLE PRECISION NOT NULL,
    "labCredits" DOUBLE PRECISION NOT NULL,
    "electiveCredits" DOUBLE PRECISION NOT NULL,
    "projectCredits" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumScheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "CurriculumScheme_regulationCode_key" ON "CurriculumScheme"("regulationCode");
