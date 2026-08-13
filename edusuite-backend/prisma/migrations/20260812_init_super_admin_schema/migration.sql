-- AlterTable
ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Active';

-- CreateTable
CREATE TABLE IF NOT EXISTS "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hodName" TEXT,
    "accreditation" TEXT DEFAULT 'NBA & NAAC A+',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "targetEntity" TEXT,
    "targetId" TEXT,
    "ipAddress" TEXT DEFAULT '127.0.0.1',
    "status" TEXT NOT NULL DEFAULT 'Success',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "RolePermission" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isSystemAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "isDean" BOOLEAN NOT NULL DEFAULT false,
    "isHod" BOOLEAN NOT NULL DEFAULT false,
    "isFaculty" BOOLEAN NOT NULL DEFAULT false,
    "isFinance" BOOLEAN NOT NULL DEFAULT false,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "canExportData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "DelegationRule" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "delegatedRole" TEXT NOT NULL,
    "assignedPerson" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active Delegation',
    "permissions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DelegationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "RolePermission_role_key" ON "RolePermission"("role");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DelegationRule_ruleId_key" ON "DelegationRule"("ruleId");
