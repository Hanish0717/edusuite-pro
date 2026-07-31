import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { brand } from "@/config/branding";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-deep px-12 py-14 text-brand-deep-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/">
          <Logo tone="mono" showName nameClassName="text-brand-deep-foreground" />
        </Link>
        <div>
          <h2 className="max-w-md font-display text-4xl font-extrabold leading-tight">{brand.tagline}</h2>
          <p className="mt-5 max-w-md text-sm text-brand-deep-foreground/70">{brand.description}</p>
          <ul className="mt-8 space-y-3 text-sm text-brand-deep-foreground/80">
            {["Role based dashboards", "Department level scopes", "AI campus assistant"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-brand-deep-foreground/50">
          &copy; {new Date().getFullYear()} {brand.name}
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-14 md:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Link to="/">
              <Logo showName />
            </Link>
          </div>
          <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
