import {
  Globe,
  Briefcase,
  Users,
  Heart,
  Calendar,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AlumniDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Alumni Network & Graduate Portal
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Alumni Network, Job Referrals, Student Mentorship, Chapter Reunions, Endowment Fund.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ALUMNI PORTAL
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Alumni Network" value="12,450 Alumni" icon={Globe} />
        <KpiCard label="Students Mentored" value="12 Students" icon={Users} tone="success" />
        <KpiCard label="Job Openings Posted" value="4 Active Jobs" icon={Briefcase} tone="info" />
        <KpiCard label="Contributions Made" value="Rs 50,000" icon={Heart} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Upcoming Alumni Events & Reunions">
            <div className="space-y-3">
              {[
                { event: "Annual Grand Alumni Reunion 2026", location: "Main Campus Auditorium", date: "Dec 18, 2026", status: "RSVP Open" },
                { event: "US Bay Area Alumni Chapter Meet", location: "San Francisco, CA", date: "Sep 24, 2026", status: "RSVP Open" },
                { event: "Bengaluru Tech Alumni Networking Dinner", location: "Indiranagar, Bengaluru", date: "Aug 15, 2026", status: "Confirmed" },
              ].map((ev) => (
                <div key={ev.event} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{ev.event}</h4>
                    <p className="text-xs text-muted-foreground">Venue: {ev.location} | Date: {ev.date}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-mono">
                    {ev.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Alumni Member Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Briefcase className="size-4 mr-2" /> Post Job Referral for Juniors
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Heart className="size-4 mr-2" /> Contribute to Campus Endowment
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
