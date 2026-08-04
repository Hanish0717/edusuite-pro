import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  UserCog,
  GraduationCap,
  Users,
  Globe,
  ChevronDown,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CORE_5_LOGIN_ROLES,
  DEPARTMENTS,
  type CoreRoleKey,
  type DepartmentCode,
  type ExternalPersona,
} from "@/config/roles";
import { useRole } from "@/context/role-context";

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

export function LoginPage() {
  const { setRole, setFlags, setDepartment, setExternalPersona } = useRole();
  const navigate = useNavigate();

  // STEP 1: 1ST DROPDOWN — 5 CORE LOGIN ROLES
  const [step1CoreRole, setStep1CoreRole] = useState<CoreRoleKey>("staff");

  // STEP 2: 2ND DROPDOWN — ROLE DESIGNATION / SUB-ROLE (Dependent on Step 1)
  const [step2Designation, setStep2Designation] = useState<string>("hod");

  // STEP 3: 3RD DROPDOWN — BRANCH / DEPARTMENT / FIELD (Dependent on Step 2)
  const [step3Branch, setStep3Branch] = useState<string>("CSE");

  // Get active core role definition
  const activeCoreRoleDef =
    CORE_5_LOGIN_ROLES.find((r) => r.id === step1CoreRole) || CORE_5_LOGIN_ROLES[1];

  // Handler when 1st dropdown changes
  const handleStep1Change = (newCoreRole: CoreRoleKey) => {
    setStep1CoreRole(newCoreRole);
    // Reset Step 2 and Step 3 defaults based on Step 1
    if (newCoreRole === "super-admin") {
      setStep2Designation("global_admin");
      setStep3Branch("All Campuses (Global)");
    } else if (newCoreRole === "staff") {
      setStep2Designation("hod");
      setStep3Branch("CSE");
    } else if (newCoreRole === "student") {
      setStep2Designation("btech");
      setStep3Branch("CSE");
    } else if (newCoreRole === "parent") {
      setStep2Designation("ward_22cs101");
      setStep3Branch("Academic & Marks Overview");
    } else if (newCoreRole === "external-user") {
      setStep2Designation("recruiter");
      setStep3Branch("Google Cloud");
    }
  };

  // Handler when 2nd dropdown changes
  const handleStep2Change = (newDesignation: string) => {
    setStep2Designation(newDesignation);
    // Adjust Step 3 options if needed
    if (step1CoreRole === "external-user") {
      if (newDesignation === "recruiter") setStep3Branch("Google Cloud");
      else if (newDesignation === "vendor") setStep3Branch("Cafeteria & Mess Services");
      else if (newDesignation === "alumni") setStep3Branch("Batch of 2022");
      else if (newDesignation === "applicant") setStep3Branch("B.Tech CSE Admissions");
      else if (newDesignation === "guest_faculty") setStep3Branch("Computer Science Dept");
    }
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Map 3-step dropdown selections into context
    if (step1CoreRole === "super-admin") {
      setRole("super-admin");
      setFlags(["isSystemAdmin", "isPrincipal"]);
      toast.success(`Logged in as Super Admin [${step3Branch}]`);
    } else if (step1CoreRole === "staff") {
      setRole("staff");
      const isExamController = step2Designation === "exam_controller";
      const deptCode = isExamController ? "CSE" : ((step3Branch as DepartmentCode) || "CSE");
      setDepartment(deptCode);

      // Map designation flag
      let flag = "isHod";
      if (step2Designation === "hod") flag = "isHod";
      else if (step2Designation === "dean") flag = "isDean";
      else if (step2Designation === "exam_controller") flag = "isExamController";
      else if (step2Designation === "placement_officer") flag = "isPlacementOfficer";
      else if (step2Designation === "transport_officer") flag = "isTransportOfficer";
      else if (step2Designation === "hostel_warden") flag = "isHostelWarden";
      else if (step2Designation === "finance_officer") flag = "isFinanceOfficer";
      else if (step2Designation === "library_admin") flag = "isLibraryAdmin";
      else if (step2Designation === "hr_manager") flag = "isHRManager";
      else if (step2Designation === "principal") flag = "isPrincipal";
      else if (step2Designation === "vice_principal") flag = "isVicePrincipal";
      else flag = "isMentor";

      setFlags([flag, "isClassAdvisor", "isMentor"]);
      if (isExamController) {
        toast.success("Logged in as Staff: EXAM_CONTROLLER — Global (No Branch Scope)");
      } else {
        toast.success(`Logged in as Staff: ${step2Designation.toUpperCase()} — Branch: ${deptCode}`);
      }
    } else if (step1CoreRole === "student") {
      setRole("student");
      setDepartment((step3Branch as DepartmentCode) || "CSE");
      toast.success(`Logged in as Student (${step2Designation.toUpperCase()} — ${step3Branch})`);
    } else if (step1CoreRole === "parent") {
      setRole("parent");
      toast.success(`Logged in as Parent (${step2Designation}) — View: ${step3Branch}`);
    } else if (step1CoreRole === "external-user") {
      setRole("external-user");
      const persona = (step2Designation as ExternalPersona) || "recruiter";
      setExternalPersona(persona);
      toast.success(`Logged in as External User [${persona.toUpperCase()}] — ${step3Branch}`);
    }

    navigate({ to: "/dashboard" });
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
        <div className="space-y-1.5 p-3.5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
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
                className="w-full h-10 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {step1CoreRole === "staff" && (
                  <>
                    <option value="hod">HOD (Head of Department)</option>
                    <option value="dean">Academic Dean</option>
                    <option value="faculty">Faculty / Teacher (Default)</option>
                    <option value="exam_controller">Exam Controller</option>
                    <option value="placement_officer">Placement Officer</option>
                    <option value="transport_officer">Transport Officer</option>
                    <option value="hostel_warden">Hostel Warden</option>
                    <option value="finance_officer">Finance Officer</option>
                    <option value="library_admin">Library Admin</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="principal">Principal</option>
                    <option value="vice_principal">Vice Principal</option>
                    <option value="lab_incharge">Lab Incharge</option>
                    <option value="naac_coordinator">NAAC / IQAC Coordinator</option>
                  </>
                )}

                {step1CoreRole === "external-user" && (
                  <>
                    <option value="recruiter">Recruiter (Campus Drives)</option>
                    <option value="applicant">Applicant (Pre-Admissions)</option>
                    <option value="alumni">Alumni (Graduate Network)</option>
                    <option value="vendor">Vendor (Suppliers & Services)</option>
                    <option value="guest_faculty">Guest Faculty / Speaker</option>
                  </>
                )}

                {step1CoreRole === "student" && (
                  <>
                    <option value="btech">B.Tech (Undergraduate Eng.)</option>
                    <option value="mtech">M.Tech (Postgraduate Eng.)</option>
                    <option value="mba">MBA (Master of Business Admin)</option>
                  </>
                )}

                {step1CoreRole === "parent" && (
                  <>
                    <option value="ward_22cs101">K. Sai Teja (Roll 22CS101)</option>
                    <option value="ward_22ece044">Priya Sundaram (Roll 22ECE044)</option>
                    <option value="ward_22me089">Anish Kulkarni (Roll 22ME089)</option>
                  </>
                )}

                {step1CoreRole === "super-admin" && (
                  <>
                    <option value="global_admin">Global System & Platform Owner</option>
                    <option value="security_admin">Security & Compliance Officer</option>
                    <option value="audit_admin">Institutional Audit Auditor</option>
                  </>
                )}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* 3RD DROPDOWN: BRANCH / DEPARTMENT / FIELD (Cascading based on 2nd Dropdown) */}
          {step2Designation !== "exam_controller" && (
            <div className="space-y-1.5 pt-2 border-t border-primary/20">
              <Label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                <span>3rd Dropdown: Branch / Department Scope</span>
                <Badge className="bg-brand-gradient text-white font-mono text-[0.65rem]">
                  Step 3
                </Badge>
              </Label>

              <div className="relative">
                <select
                  value={step3Branch}
                  onChange={(e) => setStep3Branch(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  {(step1CoreRole === "staff" || step1CoreRole === "student") && (
                    <>
                      {DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code}>
                          Branch: {d.code} — {d.name}
                        </option>
                      ))}
                    </>
                  )}

                  {step1CoreRole === "external-user" && (
                    <>
                      {step2Designation === "recruiter" && (
                        <>
                          <option value="Google Cloud">Company: Google Cloud</option>
                          <option value="Microsoft India">Company: Microsoft India</option>
                          <option value="Qualcomm">Company: Qualcomm India</option>
                          <option value="Tesla Motors">Company: Tesla Motors</option>
                        </>
                      )}
                      {step2Designation === "vendor" && (
                        <>
                          <option value="Cafeteria & Mess Services">Vendor: Cafeteria & Mess Services</option>
                          <option value="IT Hardware Supplier">Vendor: IT Hardware Supplier</option>
                          <option value="Transport Fleet Service">Vendor: Transport Fleet Service</option>
                          <option value="Lab Equipment Supplier">Vendor: Lab Equipment Supplier</option>
                        </>
                      )}
                      {step2Designation === "alumni" && (
                        <>
                          <option value="Batch of 2022">Batch: Batch of 2022</option>
                          <option value="Batch of 2021">Batch: Batch of 2021</option>
                          <option value="Batch of 2020">Batch: Batch of 2020</option>
                        </>
                      )}
                      {step2Designation === "applicant" && (
                        <>
                          <option value="B.Tech CSE Admissions">Target: B.Tech CSE Admissions</option>
                          <option value="B.Tech ECE Admissions">Target: B.Tech ECE Admissions</option>
                          <option value="MBA Admissions">Target: MBA Admissions</option>
                        </>
                      )}
                      {step2Designation === "guest_faculty" && (
                        <>
                          <option value="Computer Science Dept">Visiting: Computer Science Dept</option>
                          <option value="Electronics Dept">Visiting: Electronics Dept</option>
                        </>
                      )}
                    </>
                  )}

                  {step1CoreRole === "parent" && (
                    <>
                      <option value="Academic & Marks Overview">View: Academic Performance & Marks</option>
                      <option value="Attendance Ledger & Alerts">View: Attendance Ledger & Alerts</option>
                      <option value="Online Fee Payment & Invoices">View: Online Fee Payment & Invoices</option>
                      <option value="Hostel & Transport Status">View: Hostel & Transport Status</option>
                    </>
                  )}

                  {step1CoreRole === "super-admin" && (
                    <>
                      <option value="All Campuses (Global)">Scope: All Campuses & Departments (Global)</option>
                      <option value="Main Campus (Hyderabad)">Scope: Main Campus (Hyderabad)</option>
                      <option value="North Campus (Bengaluru)">Scope: North Campus (Bengaluru)</option>
                    </>
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* WORKFLOW DIAGRAM SUMMARY BADGE */}
        <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Selected Login Resolution:</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="font-mono font-bold text-foreground text-xs">
            {activeCoreRoleDef.title} → {step2Designation.toUpperCase()} → {step2Designation === "exam_controller" ? "GLOBAL" : step3Branch}
          </p>
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
              defaultValue={
                step1CoreRole === "super-admin"
                  ? "superadmin@college.com"
                  : step1CoreRole === "staff"
                  ? "faculty@college.com"
                  : step1CoreRole === "student"
                  ? "student@college.com"
                  : step1CoreRole === "parent"
                  ? "parent@college.com"
                  : "recruiter@college.com"
              }
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
            <Input id="password" type="password" defaultValue="password123" required />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 bg-brand-gradient shadow-glow font-bold gap-2 cursor-pointer">
          Login Now to Dashboard <ArrowRight className="size-4" />
        </Button>
      </form>
    </AuthLayout>
  );
}
