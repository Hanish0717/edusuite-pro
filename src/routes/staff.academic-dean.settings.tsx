import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, Save, ShieldCheck, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/staff/academic-dean/settings")({
  head: () => ({
    meta: [{ title: "Settings — Academic Dean" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Prof. Anand Kumar");
  const [email, setEmail] = useState("academic_dean@college.com");
  const [officeRoom, setOfficeRoom] = useState("Main Administrative Block, Room 204");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Academic Dean portal preferences saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Academic Dean Portal Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your executive profile details, office location, and notification preferences.
        </p>
      </div>

      <Panel title="Executive Profile Settings" description="Update details visible on academic dossiers and approvals.">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <User className="size-3.5 text-primary" /> Full Name & Title
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" /> Official Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" /> Office Location / Dean Secretariat
            </Label>
            <Input
              value={officeRoom}
              onChange={(e) => setOfficeRoom(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="bg-brand-gradient text-xs cursor-pointer gap-1.5">
              <Save className="size-4" /> Save Portal Settings
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
