import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, Shield, Bell, Globe, Save } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff/student-dean/settings")({
  head: () => ({ meta: [{ title: "Student Dean Portal Settings — EduSuite Pro" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">SYSTEM SETTINGS</Badge>
            <span className="text-xs text-muted-foreground">• Student Dean Configuration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portal Settings</h1>
          <p className="text-sm text-muted-foreground">Manage profile, security password, notification preferences, language, theme, and read-only role permissions.</p>
        </div>
        <Button onClick={() => setSaved(true)} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
          <Save className="size-3.5" /> {saved ? "Settings Saved ✓" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-1">
          {[
            { id: "profile", label: "Profile Settings", icon: User },
            { id: "security", label: "Password & Security", icon: Lock },
            { id: "notif", label: "Notification Preferences", icon: Bell },
            { id: "theme", label: "Language & Theme", icon: Globe },
            { id: "rbac", label: "Role Permissions (Read Only)", icon: Shield },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                activeSection === s.id ? "bg-primary text-primary-foreground font-bold" : "hover:bg-accent text-muted-foreground"
              }`}
            >
              <s.icon className="size-4" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <Panel title="Profile Settings" description="Update personal and designation details.">
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="font-bold text-muted-foreground">Full Name</label>
                  <Input defaultValue="Prof. Student Dean" className="h-9 text-xs mt-1" />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground">Institutional Email</label>
                  <Input defaultValue="student_dean@edusuite.edu.in" className="h-9 text-xs mt-1" />
                </div>
              </div>
            </Panel>
          )}

          {activeSection === "security" && (
            <Panel title="Password & Security" description="Update account password.">
              <div className="space-y-3 max-w-md text-xs">
                <div>
                  <label className="font-bold text-muted-foreground">Current Password</label>
                  <Input type="password" defaultValue="********" className="h-9 text-xs mt-1" />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground">New Password</label>
                  <Input type="password" placeholder="Enter new password" className="h-9 text-xs mt-1" />
                </div>
              </div>
            </Panel>
          )}

          {activeSection === "rbac" && (
            <Panel title="Role Permissions (Read Only)" description="Assigned RBAC privileges.">
              <div className="space-y-2 text-xs font-bold">
                <div className="p-3 border border-border rounded-xl bg-card flex justify-between">
                  <span>Student Welfare & Grievance Redressal</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600">Full Access</Badge>
                </div>
                <div className="p-3 border border-border rounded-xl bg-card flex justify-between">
                  <span>Scholarships & Freeships Approval</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600">Approval Authority</Badge>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
