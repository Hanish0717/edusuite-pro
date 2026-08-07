import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CORE_5_LOGIN_ROLES,
  type CoreRoleKey,
} from "@/config/roles";
import { useRole } from "@/context/role-context";
import {
  getDesignationOptionsForCoreRole,
  getScopeOptionsForDesignation,
  getDefaultCredentialsForSelection,
  resolveRoleContextFromSelection,
  DEAN_ROUTE_MAP,
} from "@/lib/authService";
import { StaffDesignationDropdown } from "@/components/auth/staff-designation-dropdown";


export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Cascading 3-Step Role Login — EduSuite Pro" },
      {
        name: "description",
        content: "Cascading 3-step login selector: 1st Core Role -> 2nd Designation -> 3rd Department / Branch.",
      },
    ],
  }),
  component: LoginPage,
});

// Configuration for roles that operate at the institution level (no branch/department required)
const institutionLevelRoles = [
  "Placement Officer",
  "placement_officer",
  "Principal",
  "principal",
  "Director",
  "director",
  "Registrar",
  "registrar",
  "Librarian",
  "library_admin",
  "transport_officer",
  "hostel_warden",
  "finance_officer",
  "hr_manager",
  "vice_principal",
  "exam_controller",
  "Academic Dean",
  "academic_dean",
  "Student Dean",
  "student_dean",
  "IQAC",
  "iqac_dean",
  "IMA",
  "ima_dean",
  "Research & Development",
  "research_dean",
  "Finance Dean",
  "finance_dean",
  "Examination Dean",
  "examination_dean",
  "Placement Dean",
  "placement_dean",
  "dean",
];

function LoginPage() {
  const { setRole, setFlags, setDepartment, setExternalPersona } = useRole();
  const navigate = useNavigate();

  // STEP 1: 1ST DROPDOWN — 5 CORE LOGIN ROLES
  const [step1CoreRole, setStep1CoreRole] = useState<CoreRoleKey>("staff");

  // STEP 2: 2ND DROPDOWN — ROLE DESIGNATION / SUB-ROLE (Dependent on Step 1)
  const [step2Designation, setStep2Designation] = useState<string>("hod");

  // STEP 3: 3RD DROPDOWN — BRANCH / DEPARTMENT / FIELD (Dependent on Step 2)
  const [step3Branch, setStep3Branch] = useState<string>("CSE");

  // Controlled Credentials State
  const initialCreds = getDefaultCredentialsForSelection("staff", "hod");
  const [email, setEmail] = useState<string>(initialCreds.email);
  const [password, setPassword] = useState<string>(initialCreds.password);

  // Dynamic Designation options driven by auth service
  const designationOptions = useMemo(() => {
    return getDesignationOptionsForCoreRole(step1CoreRole);
  }, [step1CoreRole]);

  // Dynamic Scope options driven by auth service
  const scopeOptions = useMemo(() => {
    return getScopeOptionsForDesignation(step1CoreRole, step2Designation);
  }, [step1CoreRole, step2Designation]);

  // Check if current designation is an institution-level role
  const isInstitutionLevel =
    step1CoreRole === "staff" &&
    institutionLevelRoles.some(
      (role) =>
        role.toLowerCase().replace(/_/g, " ") ===
          step2Designation.toLowerCase().replace(/_/g, " ") ||
        step2Designation === role
    );

  // Active core role definition for badge UI
  const activeCoreRoleDef = useMemo(() => {
    return CORE_5_LOGIN_ROLES.find((r) => r.id === step1CoreRole) || CORE_5_LOGIN_ROLES[1];
  }, [step1CoreRole]);

  // Handler when 1st dropdown changes
  const handleStep1Change = (newCoreRole: CoreRoleKey) => {
    setStep1CoreRole(newCoreRole);
    const designations = getDesignationOptionsForCoreRole(newCoreRole);
    const defaultDesignation = designations[0]?.id || "";
    setStep2Designation(defaultDesignation);

    const scopes = getScopeOptionsForDesignation(newCoreRole, defaultDesignation);
    const defaultScope = scopes[0]?.value || "";
    setStep3Branch(defaultScope);

    // Sync mock credentials
    const creds = getDefaultCredentialsForSelection(newCoreRole, defaultDesignation);
    setEmail(creds.email);
    setPassword(creds.password);
  };

  // Handler when 2nd dropdown changes
  const handleStep2Change = (newDesignation: string) => {
    setStep2Designation(newDesignation);
    const scopes = getScopeOptionsForDesignation(step1CoreRole, newDesignation);
    const defaultScope = scopes[0]?.value || "";
    setStep3Branch(defaultScope);

    // Sync mock credentials
    const creds = getDefaultCredentialsForSelection(step1CoreRole, newDesignation);
    setEmail(creds.email);
    setPassword(creds.password);
  };

  // Handler when 3rd dropdown changes
  const handleStep3Change = (newBranch: string) => {
    setStep3Branch(newBranch);
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dynamically resolve role context from mock service
    const resolved = resolveRoleContextFromSelection(step1CoreRole, step2Designation, step3Branch);

    if (resolved.role === "external-user" && resolved.externalPersona === "recruiter") {
      if (email && email.trim()) {
        const emailHandle = email.split("@")[0] || email;
        const formattedName = emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1);
        const comp = email.includes("info")
          ? "Infosys Limited"
          : email.includes("tcs")
          ? "TCS (Tata Consultancy Services)"
          : email.includes("microsoft")
          ? "Microsoft India"
          : email.includes("google")
          ? "Google Cloud"
          : "Corporate HR";

        localStorage.setItem("loggedInRecruiterName", formattedName);
        localStorage.setItem("loggedInRecruiterEmail", email);
        localStorage.setItem("loggedInRecruiterCompany", comp);
      }
    }

    setRole(resolved.role);
    setFlags(resolved.flags);
    if (resolved.department) setDepartment(resolved.department);
    if (resolved.externalPersona) setExternalPersona(resolved.externalPersona);

    if (step1CoreRole === "staff" && DEAN_ROUTE_MAP[step2Designation]) {
      navigate({ to: DEAN_ROUTE_MAP[step2Designation] as any });
    } else {
      const target = resolved.targetRoute || (step2Designation === "admission_desk" ? "/dashboard/admission" : "/dashboard");
      navigate({ to: target });
    }
  };

  return (
    <AuthLayout
      title="Role & Department Cascading Login"
      subtitle="Select 1st Core Role → 2nd Designation → 3rd Branch/Department to directly access your dashboard."
      footer={
        <>
          Need assistance?{" "}
          <Link to="/contact" className="font-medium text-primary hover:underline">
            Contact IT Helpdesk
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleDirectLogin}>
        {/* 1ST DROPDOWN: 5 CORE LOGIN ROLES */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>1st Dropdown: 5 Core Login Roles</span>
            <Badge variant="outline" className="font-mono text-[0.65rem] bg-primary/5">
              Step 1
            </Badge>
          </Label>
          <div className="relative">
            <select
              value={step1CoreRole}
              onChange={(e) => handleStep1Change(e.target.value as CoreRoleKey)}
              aria-label="1st Dropdown: 5 Core Login Roles"
              className="w-full h-11 rounded-xl border-2 border-primary/60 bg-card px-3.5 pr-10 text-sm font-extrabold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none"
            >
              {CORE_5_LOGIN_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.number}. {role.title} — ({role.bulletPoints[0]})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-primary" />
          </div>
        </div>

        {/* 2ND DROPDOWN: RELATED DESIGNATION / SUB-ROLE (Cascading based on 1st Dropdown) */}
        <div className="space-y-1.5 p-3.5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3 transition-all duration-300">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
              <span>2nd Dropdown: Designation / Sub-Role</span>
              <Badge className="bg-primary text-primary-foreground font-mono text-[0.65rem]">
                Step 2
              </Badge>
            </Label>
            <StaffDesignationDropdown
              coreRole={step1CoreRole}
              value={step2Designation}
              options={designationOptions}
              onChange={handleStep2Change}
            />
          </div>

          {/* 3RD DROPDOWN: BRANCH / DEPARTMENT / FIELD (Hidden dynamically for Institution Level Roles) */}
          {!isInstitutionLevel && (
            <div className="space-y-1.5 pt-2 border-t border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                <span>3rd Dropdown: Branch / Department Scope</span>
                <Badge className="bg-brand-gradient text-white font-mono text-[0.65rem]">
                  Step 3
                </Badge>
              </Label>

            <div className="relative">
              <select
                value={step3Branch}
                onChange={(e) => handleStep3Change(e.target.value)}
                aria-label="3rd Dropdown: Branch or Department Scope"
                className="w-full h-10 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {scopeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            </div>
          )}
        </div>


        {/* WORKFLOW DIAGRAM SUMMARY BADGE */}
        <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs space-y-1.5 transition-all duration-300">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Selected Login Resolution:</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="font-mono font-bold text-foreground text-xs leading-snug">
            {isInstitutionLevel ? (
              <div className="space-y-0.5">
                <div>{(activeCoreRoleDef?.title || "STAFF")} → {step2Designation.toUpperCase()}</div>
                <div className="text-muted-foreground font-semibold text-[0.725rem]">Institution Level</div>
              </div>
            ) : (
              <div>
                {(activeCoreRoleDef?.title || "STAFF")} → {step2Designation.toUpperCase()} → {step3Branch}
              </div>
            )}
          </div>
        </div>

        {/* AUTH CREDENTIALS */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <span className="text-[0.68rem] text-muted-foreground font-mono">
                Default: password123
              </span>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 bg-brand-gradient shadow-glow font-bold gap-2 cursor-pointer">
          Login Now to Dashboard <ArrowRight className="size-4" />
        </Button>
      </form>
    </AuthLayout>
  );
}
