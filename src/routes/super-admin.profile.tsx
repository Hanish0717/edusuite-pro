import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building,
  Key,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Settings,
  Activity,
  Award,
  Globe,
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RESPONSIBILITY_FLAGS } from "@/config/roles";

export const Route = createFileRoute("/super-admin/profile")({
  head: () => ({
    meta: [{ title: "Super Admin Profile — EduSuite Pro" }],
  }),
  component: SuperAdminProfilePage,
});

function SuperAdminProfilePage() {
  const { profile } = useRole();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Super Admin Executive Profile</h2>
          <p className="text-sm text-muted-foreground">
            System governance credentials, institutional security privileges, and platform audit dossier.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="rounded-xl gap-2 text-xs font-semibold">
          <Link to="/super-admin/settings">
            <Settings className="size-3.5" /> System Settings
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Avatar & Executive Card */}
        <div className="border border-border rounded-2xl bg-card p-6 text-center space-y-4 shadow-sm h-fit">
          <div className="size-24 rounded-full bg-brand-gradient text-white font-extrabold font-display text-3xl grid place-items-center mx-auto shadow-glow">
            {profile.initials || "SA"}
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{profile.personaName || "Super Administrator"}</h3>
            <p className="text-xs text-primary font-semibold mt-0.5">{profile.personaMeta || "Vice Chancellor / Executive Portal"}</p>
            <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              Root System Governance
            </Badge>
          </div>

          <div className="border-t border-border pt-4 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="size-4 text-primary shrink-0" />
              <span className="font-mono truncate">{profile.email || "superadmin@edusuite.edu.in"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Building className="size-4 text-primary shrink-0" />
              <span>Office of the Vice Chancellor</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Globe className="size-4 text-primary shrink-0" />
              <span>Main Institutional Campus</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="size-4 text-primary shrink-0" />
              <span>System Administrator since 2022</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Credentials & Active Privileges */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: System Permissions & Governance */}
          <div className="border border-border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" /> Active System Governance Privileges
              </h3>
              <Badge variant="outline" className="font-mono text-xs">Unrestricted Root Scope</Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> Module Access Control
                </p>
                <p className="text-[0.68rem] text-muted-foreground">Full CRUD permissions across all 16 ERP modules</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> Financial Audit & Treasury
                </p>
                <p className="text-[0.68rem] text-muted-foreground">Full approval authority for budget & vouchers</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> NAAC & IQAC Quality Control
                </p>
                <p className="text-[0.68rem] text-muted-foreground">Final sign-off on AQAR & NBA accreditation</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> User Role Management
                </p>
                <p className="text-[0.68rem] text-muted-foreground">Grant/revoke staff responsibility flags & permissions</p>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Authentication Dossier */}
          <div className="border border-border rounded-2xl bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Lock className="size-4 text-primary" /> System Security & Audit Log
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-600">2FA Verified</Badge>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                <span className="text-muted-foreground">Authentication Method</span>
                <span className="font-mono font-semibold text-foreground">OAuth 2.0 / Enterprise SSO</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                <span className="text-muted-foreground">Last Login Timestamp</span>
                <span className="font-mono font-semibold text-foreground">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                <span className="text-muted-foreground">Active Session IP</span>
                <span className="font-mono font-semibold text-foreground">192.168.1.102 (Campus Secure Gateway)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
