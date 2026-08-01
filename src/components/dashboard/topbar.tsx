import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Download, Filter, Moon, Search, Sun, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  roleOrder,
  roleProfiles,
  RESPONSIBILITY_FLAGS,
  EXTERNAL_PERSONAS,
  DEPARTMENTS,
  type LoginRole,
  type ExternalPersona,
  type DepartmentCode,
} from "@/config/roles";
import { useRole } from "@/context/role-context";
import { notifications } from "@/data/mock";

function useCrumbs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, index) => ({
    label: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href: "/" + parts.slice(0, index + 1).join("/"),
    last: index === parts.length - 1,
  }));
}

export function Topbar() {
  const crumbs = useCrumbs();
  const {
    role,
    setRole,
    profile,
    flags,
    setFlags,
    department,
    setDepartment,
    externalPersona,
    setExternalPersona,
  } = useRole();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="shrink-0" />
          <div className="relative hidden min-w-0 md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students, staff, records..." className="h-9 w-72 pl-8" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 flex-wrap">
          {/* Primary 5 Core Login Roles Dropdown */}
          <Select value={role} onValueChange={(v) => setRole(v as LoginRole)}>
            <SelectTrigger className="h-9 w-[160px] font-semibold text-xs border-primary/40 bg-card" aria-label="5 Core Login Roles">
              <SelectValue placeholder="Core Login Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super-admin">1. Super Admin</SelectItem>
              <SelectItem value="staff">2. Staff (Faculty)</SelectItem>
              <SelectItem value="student">3. Student</SelectItem>
              <SelectItem value="parent">4. Parent</SelectItem>
              <SelectItem value="external-user">5. External User</SelectItem>
            </SelectContent>
          </Select>

          {/* Dynamic Sub-Fields Dropdown for Staff */}
          {role === "staff" && (
            <Select value={department || "CSE"} onValueChange={(v) => setDepartment((v || undefined) as DepartmentCode)}>
              <SelectTrigger className="h-9 w-[110px] text-xs font-mono bg-card" aria-label="Department Scope">
                <SelectValue placeholder="Dept" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.code} value={dept.code}>
                    Dept: {dept.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Dynamic Sub-Fields Dropdown for External User */}
          {role === "external-user" && (
            <Select
              value={externalPersona || "recruiter"}
              onValueChange={(v) => setExternalPersona((v || undefined) as ExternalPersona)}
            >
              <SelectTrigger className="h-9 w-[160px] text-xs font-medium bg-card" aria-label="External Persona">
                <SelectValue placeholder="External Persona" />
              </SelectTrigger>
              <SelectContent>
                {EXTERNAL_PERSONAS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    Persona: {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {role === "staff" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 px-3">
                  <SettingsIcon className="size-3.5" /> Privileges ({flags.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <h4 className="font-semibold text-sm mb-2 border-b border-border pb-1">
                  Responsibility Flags
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {RESPONSIBILITY_FLAGS.map((f) => {
                    const active = flags.includes(f.id);
                    return (
                      <div key={f.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`flag-${f.id}`}
                          checked={active}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFlags([...flags, f.id]);
                            } else {
                              setFlags(flags.filter((x) => x !== f.id));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`flag-${f.id}`}
                          className="text-xs cursor-pointer select-none truncate"
                        >
                          {f.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[0.6rem] font-semibold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>Campus updates for {profile.personaName}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-2 px-4 pb-4">
                {notifications.map((n) => (
                  <div
                    key={n.title}
                    className="rounded-xl border border-border bg-card p-3 shadow-card transition-colors hover:bg-accent/40"
                  >
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.meta}</p>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:px-2">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm font-medium lg:inline">
                  {profile.personaName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">{profile.personaName}</p>
                <p className="text-xs font-normal text-muted-foreground">{profile.personaMeta}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-4 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-1.5">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {c.last ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          {profile.flags.slice(0, 2).map((flag) => {
            const label = RESPONSIBILITY_FLAGS.find((f) => f.id === flag)?.label || flag;
            return (
              <Badge
                key={flag}
                variant="secondary"
                className="hidden text-[0.65rem] sm:inline-flex"
              >
                {label}
              </Badge>
            );
          })}
        </div>
      </div>
    </header>
  );
}
