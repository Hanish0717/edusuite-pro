-- CreateTable: Department
CREATE TABLE IF NOT EXISTS "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hodName" TEXT,
    "accreditation" TEXT DEFAULT 'NBA & NAAC A+',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Course
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CurriculumScheme
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Faculty
CREATE TABLE IF NOT EXISTS "Faculty" (
    "id" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'faculty',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Student
CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "department" TEXT,
    "semester" INTEGER,
    "section" TEXT,
    "year" INTEGER,
    "studentType" TEXT DEFAULT 'regular',
    "cgpa" DOUBLE PRECISION,
    "creditsEarned" INTEGER,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- Create Indexes & Unique Constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Department_name_key" ON "Department"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Department_code_key" ON "Department"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "Course_code_key" ON "Course"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "CurriculumScheme_regulationCode_key" ON "CurriculumScheme"("regulationCode");
CREATE UNIQUE INDEX IF NOT EXISTS "Faculty_rollNumber_key" ON "Faculty"("rollNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Faculty_email_key" ON "Faculty"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_rollNumber_key" ON "Student"("rollNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_email_key" ON "Student"("email");
