import { useMemo } from "react";
import { Building2, UserCheck, Briefcase, Users, UserPlus, FileCheck2, Award, Rocket, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart, DonutChart } from "@/components/dashboard/charts";
import { DeanHeader } from "./components/DeanHeader";

export function PlacementDeanView() {
  return (
    <div className="space-y-6">
      <DeanHeader
        activeDeanId="placement-dean"
        title="Placement & Corporate Relations Dean Cockpit"
        subtitle="Campus Recruitment Strategy, Corporate Partnerships, Training Programs, Student Placements & CTC Analytics."
        badge="PLACEMENT DEAN"
      />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Companies Visited" value="142 Companies" icon={Building2} tone="purple" />
        <KpiCard label="Active Recruiters" value="48 Recruiters" icon={UserCheck} tone="info" />
        <KpiCard label="Placement Drives" value="64 Drives" icon={Briefcase} tone="success" />
        <KpiCard label="Students Eligible" value="1,850 Students" icon={Users} tone="purple" />
        <KpiCard label="Students Registered" value="1,820 Students" icon={UserPlus} tone="info" />
        <KpiCard label="Students Shortlisted" value="1,420 Students" icon={FileCheck2} tone="warning" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Students Placed" value="1,640 Placed (89.6%)" icon={Award} tone="success" />
        <KpiCard label="Internship Offers" value="420 Offers" icon={Rocket} tone="purple" />
        <KpiCard label="Highest Package" value="₹52.0 LPA (Microsoft)" icon={Award} tone="success" />
        <KpiCard label="Average Package" value="₹12.4 LPA" icon={TrendingUp} tone="info" />
        <KpiCard label="Placement Rate" value="89.6% Overall" icon={CheckCircle2} tone="success" />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Department-wise Placement Volume & Performance" description="Total eligible vs placed students across engineering and management departments.">
          <GroupedBarChart
            data={[
              { dept: "CSE Dept", eligible: 480, placed: 465 },
              { dept: "ECE Dept", eligible: 380, placed: 350 },
              { dept: "ME Dept", eligible: 250, placed: 210 },
              { dept: "EEE Dept", eligible: 220, placed: 195 },
              { dept: "Civil Dept", eligible: 180, placed: 150 },
              { dept: "MBA Dept", eligible: 140, placed: 130 },
              { dept: "AI & DS Dept", eligible: 200, placed: 190 },
            ] as unknown as Record<string, unknown>[]}
            xKey="dept"
            series={[
              { key: "eligible", label: "Eligible Students" },
              { key: "placed", label: "Placed Students" },
            ]}
            height={220}
          />
        </Panel>

        <Panel title="Package Distribution & Salary CTC Breakdown" description="Distribution of placed students across compensation CTC tiers.">
          <DonutChart
            data={[
              { category: "Dream Tier (₹20+ LPA)", percentage: 18.5 },
              { category: "Super Dream (₹12 - ₹20 LPA)", percentage: 34.2 },
              { category: "High Tier (₹8 - ₹12 LPA)", percentage: 29.8 },
              { category: "Standard Tier (₹4.5 - ₹8 LPA)", percentage: 17.5 },
            ] as unknown as Record<string, unknown>[]}
            categoryKey="category"
            valueKey="percentage"
          />
        </Panel>
      </div>

      {/* TIER-1 RECRUITERS MASTER LEDGER */}
      <Panel title="Tier-1 Corporate Recruitment Partners & Drives" description="Master list of empanelled corporate recruiters and current placement drives.">
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Company Name</th>
                <th className="p-3">Industry Domain</th>
                <th className="p-3">HQ Location</th>
                <th className="p-3 font-mono">HR Contact</th>
                <th className="p-3 font-mono font-bold">Package Offered</th>
                <th className="p-3">Eligible Branches</th>
                <th className="p-3 text-right">Job Offers</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" /> Microsoft India
                </td>
                <td className="p-3 font-mono text-muted-foreground">Software & Cloud</td>
                <td className="p-3 font-mono">Hyderabad / Bengaluru</td>
                <td className="p-3 font-mono">Dr. Ananya Rao (HR Director)</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹52.0 LPA</td>
                <td className="p-3 font-mono">CSE, ECE, AI & DS</td>
                <td className="p-3 text-right font-mono font-bold text-primary">18 Offers</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Completed</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" /> TCS (Tata Consultancy Services)
                </td>
                <td className="p-3 font-mono text-muted-foreground">IT Services & Consulting</td>
                <td className="p-3 font-mono">Mumbai / Hyderabad</td>
                <td className="p-3 font-mono">Mr. Rajesh Sharma (Lead HR)</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹7.5 - ₹11.5 LPA</td>
                <td className="p-3 font-mono">All Engineering Branches</td>
                <td className="p-3 text-right font-mono font-bold text-primary">240 Offers</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Completed</Badge>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" /> Deloitte India
                </td>
                <td className="p-3 font-mono text-muted-foreground">Management Consulting</td>
                <td className="p-3 font-mono">Hyderabad / Gurugram</td>
                <td className="p-3 font-mono">Ms. Sneha Reddy (Campus HR)</td>
                <td className="p-3 font-mono font-bold text-emerald-600">₹14.5 LPA</td>
                <td className="p-3 font-mono">CSE, ECE, MBA</td>
                <td className="p-3 text-right font-mono font-bold text-primary">45 Offers</td>
                <td className="p-3 text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">Completed</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
