import { createFileRoute } from "@tanstack/react-router";
import { User, Shield, Mail, Phone, Calendar, Building } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { RESPONSIBILITY_FLAGS } from "@/config/roles";

export const Route = createFileRoute("/faculty/profile")({
  head: () => ({
    meta: [{ title: "My Profile — EduSuite Pro" }],
  }),
  component: FacultyProfilePage,
});

function FacultyProfilePage() {
  const { profile } = useRole();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Staff Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal credentials, departments, and active RBAC privilege flags.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="border border-border rounded-2xl bg-card p-6 text-center space-y-4 shadow-sm h-fit">
          <div className="size-20 rounded-full bg-primary/10 text-primary font-bold font-display text-2xl grid place-items-center mx-auto">
            {profile.initials}
          </div>
          <div>
            <h3 className="font-bold text-base">{profile.personaName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{profile.personaMeta}</p>
          </div>
          <Badge className="bg-primary/10 text-primary w-fit uppercase mx-auto">{profile.id}</Badge>
        </div>

        {/* Details Panel */}
        <div className="md:col-span-2 space-y-6">
          <Panel title="Personal Details" description="Verified academic credentials">
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Employee ID</span>
                <span className="font-semibold font-mono">EMP-80412</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Email</span>
                <span className="font-semibold">ravi.kumar@college.edu</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Phone</span>
                <span className="font-semibold">+91 94812 04812</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Department</span>
                <span className="font-semibold">Computer Science & Engineering (CSE)</span>
              </div>
            </div>
          </Panel>

          <Panel
            title="Assigned Roles & Responsibility Flags"
            description="Dynamic matrix composition flags"
          >
            <div className="flex flex-wrap gap-2">
              {profile.flags.map((flag) => {
                const label = RESPONSIBILITY_FLAGS.find((f) => f.id === flag)?.label || flag;
                return (
                  <Badge
                    key={flag}
                    variant="secondary"
                    className="rounded-lg bg-primary/5 text-primary border border-primary/10 flex items-center gap-1.5 py-1 px-2.5 text-xs font-semibold"
                  >
                    <Shield className="size-3.5" />
                    {label}
                  </Badge>
                );
              })}
              {profile.flags.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  No responsibility flags currently assigned. Contact super admin.
                </span>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
