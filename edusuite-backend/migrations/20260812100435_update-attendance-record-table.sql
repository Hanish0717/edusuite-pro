-- AlterTable: AttendanceRecord
ALTER TABLE "AttendanceRecord" ADD COLUMN IF NOT EXISTS "periodNumber" INTEGER DEFAULT 1;
ALTER TABLE "AttendanceRecord" ADD COLUMN IF NOT EXISTS "timetableId" TEXT;
ALTER TABLE "AttendanceRecord" ADD COLUMN IF NOT EXISTS "courseId" TEXT;
ALTER TABLE "AttendanceRecord" ADD COLUMN IF NOT EXISTS "remarks" TEXT;

-- Drop Old Unique Constraint if exists
ALTER TABLE "AttendanceRecord" DROP CONSTRAINT IF EXISTS "AttendanceRecord_userId_date_key";

-- Create New Unique Index
CREATE UNIQUE INDEX IF NOT EXISTS "AttendanceRecord_userId_date_periodNumber_key" ON "AttendanceRecord"("userId", "date", "periodNumber");

-- Create Indexes
CREATE INDEX IF NOT EXISTS "AttendanceRecord_userId_idx" ON "AttendanceRecord"("userId");
CREATE INDEX IF NOT EXISTS "AttendanceRecord_date_idx" ON "AttendanceRecord"("date");
CREATE INDEX IF NOT EXISTS "AttendanceRecord_timetableId_idx" ON "AttendanceRecord"("timetableId");

-- Add Foreign Key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AttendanceRecord_timetableId_fkey'
    ) THEN
        ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "MasterTimetable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
