-- CreateTable
CREATE TABLE "SubjectAllocation" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "weeklyHours" INTEGER NOT NULL DEFAULT 3,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubjectAllocation_department_idx" ON "SubjectAllocation"("department");

-- CreateIndex
CREATE INDEX "SubjectAllocation_facultyId_idx" ON "SubjectAllocation"("facultyId");

-- CreateIndex
CREATE INDEX "SubjectAllocation_courseId_idx" ON "SubjectAllocation"("courseId");

-- CreateIndex
CREATE INDEX "SubjectAllocation_academicYear_idx" ON "SubjectAllocation"("academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectAllocation_courseId_semester_section_academicYear_key" ON "SubjectAllocation"("courseId", "semester", "section", "academicYear");

-- AddForeignKey
ALTER TABLE "SubjectAllocation" ADD CONSTRAINT "SubjectAllocation_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAllocation" ADD CONSTRAINT "SubjectAllocation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
