import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Bot,
  Bus,
  CalendarCheck,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Library,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import heroImage from "@/assets/hero-dashboard.jpg";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/branding";
import { roleList } from "@/config/roles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduSuite Pro — AI College ERP for Modern Campuses" },
      {
        name: "description",
        content:
          "EduSuite Pro unifies admissions, academics, attendance, exams, finance, hostel, transport and placements in one role-based AI powered college ERP.",
      },
      { property: "og:title", content: "EduSuite Pro — AI College ERP for Modern Campuses" },
      {
        property: "og:description",
        content:
          "One login, many responsibilities. Role-based dashboards for admins, faculty, students, parents and HODs.",
      },
    ],
  }),
  component: Landing,
});

const modules = [
  { icon: GraduationCap, title: "Admissions & Academics", text: "Enquiry to enrolment, curriculum, courses and department structures." },
  { icon: CalendarCheck, title: "Attendance & Timetable", text: "Biometric-ready attendance, period planning and clash-free timetables." },
  { icon: FileSpreadsheet, title: "Examinations & Results", text: "Internals, hall tickets, valuation, revaluation and result publishing." },
  { icon: Wallet, title: "Finance & Fees", text: "Fee plans, online collection, scholarships, refunds and payroll." },
  { icon: Library, title: "Library & LMS", text: "Catalogue, circulation, digital notes, assignments and quizzes." },
  { icon: BedDouble, title: "Hostel & Rooms", text: "Allotment, occupancy, mess billing and warden workflows." },
  { icon: Bus, title: "Transport", text: "Routes, stops, live tracking and per-student transport billing." },
  { icon: BarChart3, title: "Reports & Analytics", text: "NAAC/NBA ready reporting with department level drilldowns." },
];

const highlights = [
  { icon: ShieldCheck, title: "Granular RBAC", text: "Five login roles with privilege flags and department scopes, mapped to every module action." },
  { icon: Bot, title: "AI Assistant", text: "Ask for attendance risks, fee defaulters or result trends in plain language." },
  { icon: Users, title: "Multi-campus", text: "Run several institutes with isolated data and a single control plane." },
];

const plans = [
  {
    name: "Starter",
    price: "Rs 29k",
    period: "/ year",
    text: "For single-campus colleges getting started with digital operations.",
    features: ["Up to 500 students", "Core academics & attendance", "Parent portal", "Email support"],
  },
  {
    name: "Growth",
    price: "Rs 89k",
    period: "/ year",
    text: "For growing institutions that need exams, finance and analytics.",
    features: ["Up to 3,000 students", "Exams, finance & LMS", "Role-based dashboards", "AI assistant", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    text: "For multi-campus groups with compliance and integration needs.",
    features: ["Unlimited students", "Multi-campus control plane", "SSO & audit logs", "Dedicated success manager"],
  },
];

const testimonials = [
  { quote: "Attendance disputes dropped to near zero and parents finally stopped calling the office every week.", name: "Dr. Meera Rao", role: "Principal, Sree Institute of Technology" },
  { quote: "Our HODs plan faculty load and internals in one screen. Result publishing went from days to hours.", name: "Prof. Anand Kumar", role: "Dean Academics, Vignan Group" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-brand-gradient-soft" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
            <div className="min-w-0">
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="size-3.5" /> AI powered campus operations
              </Badge>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                The complete ERP for <span className="text-brand-gradient">modern colleges</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{brand.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-brand-gradient shadow-glow">
                  <Link to="/dashboard">
                    Explore dashboards <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Book a demo</Link>
                </Button>
              </div>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6">
                {[
                  { k: "Campuses", v: "120+" },
                  { k: "Students managed", v: "480k" },
                  { k: "Uptime", v: "99.9%" },
                ].map((stat) => (
                  <div key={stat.k}>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{stat.k}</dt>
                    <dd className="font-display text-2xl font-extrabold">{stat.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0">
              <img
                src={heroImage}
                alt="EduSuite Pro role-based dashboard preview"
                width={1408}
                height={1008}
                className="w-full rounded-3xl border border-border/60 shadow-card"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/40 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Every campus workflow, in one platform
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Sixteen production modules built for Indian higher education, ready to switch on per department.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((mod) => (
                <div key={mod.title} className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <mod.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold">{mod.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{mod.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            One login. Many responsibilities.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Each role sees a purpose-built dashboard scoped to their department and privileges.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {roleList.map((role) => (
              <Link
                key={role.id}
                to="/dashboard"
                className="group rounded-2xl border border-border/70 bg-card p-5 shadow-card transition-transform hover:-translate-y-1"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
                  <role.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{role.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{role.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View dashboard <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/40 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Simple pricing that scales with enrolment
            </h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={
                    plan.featured
                      ? "rounded-3xl border-2 border-primary bg-card p-7 shadow-glow"
                      : "rounded-3xl border border-border/70 bg-card p-7 shadow-card"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                    {plan.featured && <Badge className="bg-brand-gradient">Popular</Badge>}
                  </div>
                  <p className="mt-4 font-display text-3xl font-extrabold">
                    {plan.price}
                    <span className="text-base font-medium text-muted-foreground">{plan.period}</span>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{plan.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={plan.featured ? "mt-7 w-full bg-brand-gradient" : "mt-7 w-full"}
                    variant={plan.featured ? "default" : "outline"}
                  >
                    <Link to="/contact">Talk to sales</Link>
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {testimonials.map((item) => (
                <figure key={item.name} className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
                  <blockquote className="text-sm leading-relaxed">"{item.quote}"</blockquote>
                  <figcaption className="mt-4 text-sm font-medium">
                    {item.name}
                    <span className="block text-xs font-normal text-muted-foreground">{item.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="rounded-3xl bg-brand-deep px-6 py-14 text-center text-brand-deep-foreground md:px-12">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to digitise your campus?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-deep-foreground/70">
              Go live in weeks with guided data migration, staff training and department-level rollout.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-brand-gradient shadow-glow">
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent">
                <Link to="/contact">Contact sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
