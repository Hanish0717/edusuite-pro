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
} from "@/lib/authService";
import api from "@/lib/api";

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
  "academic_dean",
  "student_dean",
  "iqac_dean",
  "ima_dean",
  "research_dean",
  "finance_dean",
  "examination_dean",
  "placement_dean",
  "dean",
];

const DEAN_ROUTE_MAP: Record<string, string> = {
  academic_dean: "/staff/academic-dean",
  student_dean: "/staff/student-dean",
  iqac_dean: "/staff/iqac",
  ima_dean: "/staff/ima",
  research_dean: "/staff/research-development",
  finance_dean: "/staff/finance-dean",
  examination_dean: "/staff/examination-dean",
  placement_dean: "/staff/placement-dean",
  dean: "/dean/dashboard",
};

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

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Authenticating login credentials...");

    try {
      if (step1CoreRole === "student") {
        const studentRes = await fetch("http://localhost:5000/api/student/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, password: password }),
        });
        const studentData = await studentRes.json();

        if (studentRes.ok && studentData.token) {
          localStorage.setItem("token", studentData.token);
          localStorage.setItem("cms_token", studentData.token);
          localStorage.setItem("student_token", studentData.token);

          setRole("student");
          setFlags(["student_portal", "hostel_student"]);
          if (studentData.student?.department) {
            setDepartment(studentData.student.department as any);
          }

          toast.dismiss(loadingToast);
          toast.success(`Welcome to Student Portal, ${studentData.student?.name || "Student"}!`);

          // Open Student Portal in new tab per specification
          try {
            const newTab = window.open("/student/dashboard", "_blank");
            if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
              navigate({ to: "/student/dashboard" });
            } else {
              navigate({ to: "/student/dashboard" });
            }
          } catch {
            navigate({ to: "/student/dashboard" });
          }
          return;
        } else {
          toast.dismiss(loadingToast);
          toast.error(studentData.error || "Student authentication failed.");
          return;
        }
      }

      const response = await api.post("/api/auth/login", {
        email: email,
        password: password,
      });

      if (response.status !== 200 || !response.data) {
        toast.dismiss(loadingToast);
        toast.error(response.data?.error || "Login failed. Please verify credentials or ensure the database is running.");
        return;
      }

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("cms_token", token);

      // Dynamically resolve role context from mock service to get navigation flags
      const resolved = resolveRoleContextFromSelection(step1CoreRole, step2Designation, step3Branch);

      setRole(resolved.role);
      setFlags(resolved.flags);
      if (user.department) {
        setDepartment(user.department as any);
      } else if (resolved.department) {
        setDepartment(resolved.department);
      }
      if (resolved.externalPersona) setExternalPersona(resolved.externalPersona);

      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${user.name}!`);

      if (step1CoreRole === "staff" && DEAN_ROUTE_MAP[step2Designation]) {
        navigate({ to: DEAN_ROUTE_MAP[step2Designation] as any });
      } else {
        const target = resolved.targetRoute || (step2Designation === "admission_desk" ? "/dashboard/admission" : "/dashboard");
        navigate({ to: target });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to establish server connection. Is the backend running?");
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
            <div className="relative">
              <select
                value={step2Designation}
                onChange={(e) => handleStep2Change(e.target.value)}
                aria-label="2nd Dropdown: Designation / Sub-Role"
                className="w-full h-10 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {designationOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
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
              Email / Student ID / Roll Number
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="e.g. vishnu@vignan_student.edu.in, 23341A4219, or Vishnu"
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
