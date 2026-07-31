import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BedDouble,
  Bot,
  Briefcase,
  Bus,
  CalendarCheck,
  CalendarRange,
  FileSpreadsheet,
  GraduationCap,
  Library,
  MessageSquare,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Modules & Features — EduSuite Pro College ERP" },
      {
        name: "description",
        content:
          "Explore every EduSuite Pro module: admissions, academics, attendance, timetable, LMS, exams, finance, hostel, transport, placements and analytics.",
      },
      { property: "og:title", content: "Modules & Features — EduSuite Pro College ERP" },
      { property: "og:description", content: "Sixteen campus modules with role-based access control." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  {
    title: "Academics",
    items: [
      { icon: GraduationCap, title: "Admissions", text: "Enquiries, applications, merit lists and enrolment." },
      { icon: Users, title: "Student Information", text: "360 degree student profiles with documents and history." },
      { icon: UserCog, title: "Faculty & HR", text: "Profiles, workload, leave, payroll and appraisals." },
      { icon: CalendarCheck, title: "Attendance", text: "Period-wise capture, shortage alerts and condonation." },
      { icon: CalendarRange, title: "Timetable", text: "Automatic clash detection and substitution planning." },
      { icon: Library, title: "LMS & Library", text: "Notes, assignments, quizzes, catalogue and circulation." },
    ],
  },
  {
    title: "Examinations",
    items: [
      { icon: FileSpreadsheet, title: "Exam Management", text: "Schedules, seating, hall tickets and invigilation." },
      { icon: BarChart3, title: "Results & Analytics", text: "Internals, SGPA/CGPA, pass percentage and toppers." },
    ],
  },
  {
    title: "Operations",
    items: [
      { icon: Wallet, title: "Finance", text: "Fee plans, online payments, scholarships and receipts." },
      { icon: BedDouble, title: "Hostel", text: "Room allotment, occupancy, mess and warden workflows." },
      { icon: Bus, title: "Transport", text: "Routes, stops, live tracking and transport fees." },
      { icon: Briefcase, title: "Placements", text: "Drives, eligibility, offers and recruiter pipeline." },
      { icon: MessageSquare, title: "Communication", text: "Circulars, SMS, email and push notifications." },
      { icon: ShieldCheck, title: "Access Control", text: "Role, privilege flag and department scope matrix." },
      { icon: Bot, title: "AI Assistant", text: "Natural language insights across every module." },
    ],
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-brand-gradient-soft">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
            <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Every module your campus runs on
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Switch modules on per department, control them with granular RBAC, and roll out at your own pace.
            </p>
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.title} className="mx-auto max-w-7xl px-4 py-14 md:px-6">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">{group.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
