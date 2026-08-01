import {
  Globe,
  Users,
  Briefcase,
  Heart,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AlumniCoordinatorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Alumni Cell Coordinator Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Graduate Engagement, Alumni Directory, Job Board, Mentorship Network, Event Announcements, Donations.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ALUMNI COORDINATOR
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Registered Alumni" value="12,450 Network" icon={Globe} />
        <KpiCard label="Active Mentors" value="480 Alumni" icon={Users} tone="success" />
        <KpiCard label="Alumni Job Referrals" value="84 Active Jobs" icon={Briefcase} tone="info" />
        <KpiCard label="Endowment Fund" value="Rs 1.85 Cr" icon={Heart} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Alumni Engagement & Mentorship Programs">
            <div className="space-y-3">
              {[
                { name: "Sarah Jenkins (Google Cloud)", batch: "Batch of 2022", role: "Active Mentor", city: "Mountain View, CA" },
                { name: "Vikram Malhotra (Qualcomm)", batch: "Batch of 2020", role: "Active Mentor", city: "Bengaluru, India" },
                { name: "Deepa Krishnan (Tesla)", batch: "Batch of 2018", role: "Guest Speaker", city: "Austin, TX" },
              ].map((alm) => (
                <div key={alm.name} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{alm.name}</h4>
                    <p className="text-xs text-muted-foreground">{alm.batch} | Location: {alm.city}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {alm.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Coordinator Quick Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Plus className="size-4 mr-2" /> Post Alumni Job / Internship
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Globe className="size-4 mr-2" /> Announce Global Chapter Meet
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
