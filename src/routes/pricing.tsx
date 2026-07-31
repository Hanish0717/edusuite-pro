import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — EduSuite Pro College ERP" },
      {
        name: "description",
        content: "Transparent annual pricing for colleges of every size, from single campus to multi-campus groups.",
      },
      { property: "og:title", content: "Pricing — EduSuite Pro College ERP" },
      { property: "og:description", content: "Annual plans that scale with student enrolment." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Starter",
    price: "Rs 29,000",
    text: "Single campus, core operations.",
    features: ["Up to 500 students", "Academics & attendance", "Parent portal", "Email support"],
  },
  {
    name: "Growth",
    price: "Rs 89,000",
    text: "Full academic and finance stack.",
    features: ["Up to 3,000 students", "Exams, finance, LMS", "All role dashboards", "AI assistant", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    text: "Multi-campus groups and universities.",
    features: ["Unlimited students", "Multi-campus control plane", "SSO, audit logs, SLAs", "Dedicated success manager"],
  },
];

const faqs = [
  { q: "Is pricing per student or per campus?", a: "Plans are billed annually per campus, with student bands determining the tier." },
  { q: "Can we start with a few modules?", a: "Yes. Modules can be enabled per department and expanded any time." },
  { q: "Do you help with data migration?", a: "Every paid plan includes guided migration from spreadsheets or your existing ERP." },
  { q: "Is there an implementation fee?", a: "Starter and Growth include onboarding. Enterprise rollouts are scoped per campus." },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-brand-gradient-soft">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pricing that scales with enrolment
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              No per-seat surprises. One annual plan covering staff, students and parents.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="grid gap-5 lg:grid-cols-3">
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
                  <h2 className="font-display text-lg font-bold">{plan.name}</h2>
                  {plan.featured && <Badge className="bg-brand-gradient">Popular</Badge>}
                </div>
                <p className="mt-4 font-display text-3xl font-extrabold">{plan.price}</p>
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
                  variant={plan.featured ? "default" : "outline"}
                  className={plan.featured ? "mt-7 w-full bg-brand-gradient" : "mt-7 w-full"}
                >
                  <Link to="/contact">Talk to sales</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
                <h3 className="font-display text-base font-bold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
