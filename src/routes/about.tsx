import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { brand } from "@/config/branding";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EduSuite Pro — Campus Software Team" },
      {
        name: "description",
        content:
          "EduSuite Pro builds AI powered ERP software for colleges, helping campuses run academics, finance and student services on one platform.",
      },
      { property: "og:title", content: "About EduSuite Pro" },
      {
        property: "og:description",
        content: "The team building AI powered ERP software for colleges.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "Built for departments",
    text: "Every workflow respects department scopes, so HODs stay in control of their own data.",
  },
  {
    title: "Adoption first",
    text: "Interfaces are designed for clerks and faculty, not just administrators.",
  },
  {
    title: "Compliance ready",
    text: "Reports are structured for NAAC, NBA and AICTE submissions out of the box.",
  },
];

const timeline = [
  {
    year: "2021",
    text: "Started as an attendance and internals tool for a single engineering college.",
  },
  { year: "2023", text: "Expanded into finance, hostel and transport with multi-campus support." },
  {
    year: "2025",
    text: "Launched the AI assistant and role-based dashboards across 120 campuses.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-brand-gradient-soft">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              We build the operating system for campuses
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{brand.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-card"
              >
                <h2 className="font-display text-base font-bold">{value.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{value.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">Our journey</h2>
            <ol className="mt-8 space-y-6 border-l border-border pl-6">
              {timeline.map((item) => (
                <li key={item.year} className="relative">
                  <span className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-brand-gradient" />
                  <p className="font-display text-sm font-bold">{item.year}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
