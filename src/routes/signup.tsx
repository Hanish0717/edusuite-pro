import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  REGISTRATION_ROLES,
  getDepartments,
  getDesignationsForRole,
  getStrengthOptions,
  registerUser,
} from "@/lib/registrationService";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your campus account — EduSuite Pro" },
      {
        name: "description",
        content: "Start your EduSuite Pro trial and onboard your institution in minutes.",
      },
      { property: "og:title", content: "Create your campus account — EduSuite Pro" },
      {
        property: "og:description",
        content: "Onboard your institution to EduSuite Pro in minutes.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  // Controlled State
  const [role, setRole] = useState<string>("institution_head");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [studentStrength, setStudentStrength] = useState<string>("1000-3000");
  const [department, setDepartment] = useState<string>("CSE");
  const [designation, setDesignation] = useState<string>("principal");
  const [rollNumber, setRollNumber] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");

  // Dynamic Designation options computed based on selected role
  const designationOptions = useMemo(() => {
    return getDesignationsForRole(role);
  }, [role]);

  // Dynamic Department options
  const departmentOptions = useMemo(() => {
    return getDepartments();
  }, []);

  // Dynamic Student strength options
  const strengthOptions = useMemo(() => {
    return getStrengthOptions();
  }, []);

  // Handle Role Change
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const newDesignations = getDesignationsForRole(newRole);
    if (newDesignations.length > 0 && newDesignations[0]?.value) {
      setDesignation(newDesignations[0].value);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = registerUser({
      role,
      firstName,
      lastName,
      email,
      password,
      department,
      designation,
      institutionName,
      studentStrength,
      rollNumber,
      organization,
    });

    if (result.success) {
      toast.success("Registration initiated successfully!");
      navigate({ to: "/verify-email" });
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create your campus account"
      subtitle="Set up your campus workspace and invite departments."
      footer={
        <>
          Already onboarded?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* DYNAMIC ROLE SELECTION */}
        <div className="space-y-2">
          <Label htmlFor="account-role">Account Category / Role</Label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger id="account-role">
              <SelectValue placeholder="Select registration role" />
            </SelectTrigger>
            <SelectContent>
              {REGISTRATION_ROLES.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* NAME FIELDS */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* DYNAMIC DESIGNATION SELECTION */}
        {designationOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="designation">
              {role === "staff"
                ? "Designation / Staff Role"
                : role === "student"
                ? "Academic Program / Level"
                : role === "parent"
                ? "Relationship to Student"
                : role === "external"
                ? "External Persona / Type"
                : "Designation"}
            </Label>
            <Select value={designation} onValueChange={setDesignation}>
              <SelectTrigger id="designation">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {designationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* DYNAMIC DEPARTMENT SELECTION (For Staff & Students) */}
        {(role === "staff" || role === "student") && (
          <div className="space-y-2">
            <Label htmlFor="department">Department / Branch</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* CONDITIONALLY RENDERED FIELDS ACCORDING TO ROLE */}
        {role === "institution_head" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution name</Label>
              <Input
                id="institution"
                placeholder="Sree Institute of Technology"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Student strength</Label>
              <Select value={studentStrength} onValueChange={setStudentStrength}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select strength" />
                </SelectTrigger>
                <SelectContent>
                  {strengthOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {(role === "student" || role === "parent") && (
          <div className="space-y-2">
            <Label htmlFor="roll-number">
              {role === "student" ? "Student Roll / Registration No" : "Ward Student Roll No"}
            </Label>
            <Input
              id="roll-number"
              placeholder="e.g. 22CS101"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>
        )}

        {role === "external" && (
          <div className="space-y-2">
            <Label htmlFor="organization">Company / Organization Name</Label>
            <Input
              id="organization"
              placeholder="e.g. Google / Vendor Inc."
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            />
          </div>
        )}

        {/* WORK EMAIL & PASSWORD */}
        <div className="space-y-2">
          <Label htmlFor="work-email">
            {role === "student" ? "Personal / Student Email" : "Work / Contact Email"}
          </Label>
          <Input
            id="work-email"
            type="email"
            placeholder={
              role === "institution_head"
                ? "principal@college.edu"
                : role === "student"
                ? "student@college.edu"
                : "user@organization.com"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">Password</Label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full bg-brand-gradient shadow-glow">
          Create account
        </Button>
        <p className="text-xs text-muted-foreground">
          By continuing you agree to the EduSuite Pro terms of service and data processing
          agreement.
        </p>
      </form>
    </AuthLayout>
  );
}
