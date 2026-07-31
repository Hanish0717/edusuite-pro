import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brand } from "@/config/branding";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EduSuite Pro — Book a Campus Demo" },
      {
        name: "description",
        content: "Talk to the EduSuite Pro team about a guided demo, migration plan and rollout timeline for your college.",
      },
      { property: "og:title", content: "Contact EduSuite Pro" },
      { property: "og:description", content: "Book a guided demo for your campus." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Book a campus demo</h1>
          <p className="mt-4 text-muted-foreground">
            Tell us about your institution and we will tailor the walkthrough to your departments.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-4" />
              </span>
              {brand.supportEmail}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-4" />
              </span>
              +91 90000 12345
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-4" />
              </span>
              Hyderabad, Telangana, India
            </li>
          </ul>
        </div>

        <form
          className="min-w-0 rounded-3xl border border-border/70 bg-card p-7 shadow-card"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Work email</Label>
              <Input id="contact-email" type="email" required />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="college">Institution</Label>
            <Input id="college" required />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="message">What would you like to see?</Label>
            <Textarea id="message" rows={5} placeholder="Attendance, exams and fee collection for 1,800 students." />
          </div>
          <Button type="submit" className="mt-6 w-full bg-brand-gradient shadow-glow">
            Request demo
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
