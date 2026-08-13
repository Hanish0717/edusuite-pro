-- CreateTable: MasterTimetable
CREATE TABLE IF NOT EXISTS "MasterTimetable" (
    "id" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "periodNumber" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "courseId" TEXT,
    "facultyId" TEXT,
    "roomNo" TEXT,
    "isLab" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterTimetable_pkey" PRIMARY KEY ("id")
);

-- Unique Constraint
CREATE UNIQUE INDEX IF NOT EXISTS "MasterTimetable_branch_semester_section_day_periodNumber_key" ON "MasterTimetable"("branch", "semester", "section", "day", "periodNumber");

-- Indexes
CREATE INDEX IF NOT EXISTS "MasterTimetable_facultyId_idx" ON "MasterTimetable"("facultyId");
CREATE INDEX IF NOT EXISTS "MasterTimetable_courseId_idx" ON "MasterTimetable"("courseId");
CREATE INDEX IF NOT EXISTS "MasterTimetable_day_periodNumber_idx" ON "MasterTimetable"("day", "periodNumber");

-- Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'MasterTimetable_courseId_fkey'
    ) THEN
        ALTER TABLE "MasterTimetable" ADD CONSTRAINT "MasterTimetable_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'MasterTimetable_facultyId_fkey'
    ) THEN
        ALTER TABLE "MasterTimetable" ADD CONSTRAINT "MasterTimetable_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
