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
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      <aside className="relative hidden overflow-hidden bg-brand-deep px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10">
          <Link to="/" className="group inline-flex items-center">
            <Logo
              tone="color"
              showName
              size="2xl"
              animated
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="relative z-10 my-auto py-8">
          <h2 className="max-w-md font-display text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
            {brand.tagline}
          </h2>
          <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-white/90 font-normal">
            {brand.description}
          </p>
          <ul className="mt-8 space-y-4 text-sm md:text-base text-white font-medium">
            {["Role based dashboards", "Department level scopes", "AI campus assistant"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-2.5 rounded-full bg-white animate-pulse" />
                  <span className="text-white">{item}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/70 font-medium">
          &copy; {new Date().getFullYear()} {brand.name}
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 md:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/" className="group inline-flex">
              <Logo tone="color" showName size="xl" animated />
            </Link>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
