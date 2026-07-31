import { createFileRoute } from "@tanstack/react-router";
import { User, Shield, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [{ title: "Student Profile — EduSuite Pro" }],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { profile } = useRole();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Student Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal records, registration courses, and contact logs.
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
          <Panel title="Personal Details" description="Verified student enrollment details">
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Roll Number</span>
                <span className="font-semibold font-mono">22CS101</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Email</span>
                <span className="font-semibold">sai.teja@student.college.edu</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Phone</span>
                <span className="font-semibold">+91 98765 43210</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Department</span>
                <span className="font-semibold">Computer Science & Engineering (CSE)</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Current Semester</span>
                <span className="font-semibold">Semester V (3rd Year)</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Batch Code</span>
                <span className="font-semibold">2022-2026 B.Tech</span>
              </div>
            </div>
          </Panel>

          <Panel
            title="Associated Parent Contact"
            description="Primary contact for communications and fees"
          >
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block">Parent Name</span>
                <span className="font-semibold">S. Anitha</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Parent Phone</span>
                <span className="font-semibold">+91 99887 76655</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
