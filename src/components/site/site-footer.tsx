import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/branding";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" as const },
      { label: "Pricing", to: "/pricing" as const },
      { label: "Dashboards", to: "/dashboard" as const },
      { label: "About", to: "/about" as const },
    ],
  },
  {
    title: "Modules",
    links: [
      { label: "Admissions", to: "/features" as const },
      { label: "Attendance", to: "/features" as const },
      { label: "Examinations", to: "/features" as const },
      { label: "Placements", to: "/features" as const },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", to: "/contact" as const },
      { label: "Sign in", to: "/login" as const },
      { label: "Reset password", to: "/forgot-password" as const },
      { label: "Verify email", to: "/verify-email" as const },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-deep text-brand-deep-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.4fr]">
        <div className="min-w-0">
          <Logo tone="mono" showName nameClassName="text-brand-deep-foreground" />
          <p className="mt-4 max-w-xs text-sm text-brand-deep-foreground/70">{brand.description}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="min-w-0">
            <p className="font-display text-sm font-bold">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-brand-deep-foreground/70 transition-colors hover:text-brand-deep-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="min-w-0">
          <p className="font-display text-sm font-bold">Stay in the loop</p>
          <p className="mt-4 text-sm text-brand-deep-foreground/70">
            Product updates, campus automation playbooks and AI releases.
          </p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Work email"
              aria-label="Work email"
              className="border-white/15 bg-white/10 text-brand-deep-foreground placeholder:text-brand-deep-foreground/50"
            />
            <Button type="submit" className="shrink-0 bg-brand-gradient">
              Join
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-brand-deep-foreground/60 md:px-6">
        &copy; {new Date().getFullYear()} {brand.name}. {brand.tagline}
      </div>
    </footer>
  );
}
