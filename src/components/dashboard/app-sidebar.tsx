import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Library,
  BookOpen,
  ClipboardCheck,
  Activity,
  CreditCard,
  Users,
  FileText,
  Wallet,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  LayoutGrid,
  Bus,
  Building2,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
  Utensils,
  Bookmark,
  ShoppingCart,
  Boxes,
  Armchair,
  QrCode,
  ShieldCheck,
  Layers,
  RefreshCw,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigationForUser } from "@/config/navigation";
import { useRole } from "@/context/role-context";
import { useLibrarianTab, type LibrarianTab } from "@/context/librarian-context";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, flags, department, externalPersona, featureFlags, profile, setRole } = useRole();
  const { activeTab, setActiveTab } = useLibrarianTab();
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const href = useRouterState({ select: (r) => r.location.href });
  const navigate = useNavigate();

  const isLibrarian =
    role === "librarian" ||
    (role === "staff" && flags.includes("isLibraryAdmin")) ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/librarian") ||
    pathname.startsWith("/dashboard/librarian");

  const isTransport =
    role === "transport" ||
    (role === "staff" && flags.includes("isTransportOfficer")) ||
    pathname.startsWith("/transport");

  const isHostel =
    (role as string) === "hostel" ||
    (role === "staff" && flags.includes("isHostelWarden")) ||
    pathname.startsWith("/hostel");

  const librarianSections: {
    label: string;
    items: { id: LibrarianTab; label: string; icon: any; url: string }[];
  }[] = [
    {
      label: "OVERVIEW & SEARCH",
      items: [
        { id: "overview", label: "Library Overview", icon: Library, url: "/librarian" },
        { id: "search", label: "Global Search", icon: Search, url: "/librarian/search" },
      ],
    },
    {
      label: "CATALOG & CIRCULATION",
      items: [
        { id: "catalog", label: "Catalog Management", icon: Layers, url: "/librarian/catalog" },
        { id: "books", label: "Book Management", icon: BookOpen, url: "/librarian/books" },
        { id: "issue", label: "Issue Books", icon: ClipboardCheck, url: "/librarian/issue-books" },
        { id: "return", label: "Return Books", icon: Activity, url: "/librarian/return-books" },
        { id: "circulation", label: "Circulation & Renewals", icon: RefreshCw, url: "/librarian/circulation" },
      ],
    },
    {
      label: "PROCUREMENT & INVENTORY",
      items: [
        { id: "acquisition", label: "Acquisition", icon: ShoppingCart, url: "/librarian/acquisition" },
        { id: "inventory", label: "Inventory & Audit", icon: Boxes, url: "/librarian/inventory" },
      ],
    },
    {
      label: "FACILITIES & ENTRY",
      items: [
        { id: "entry", label: "Gate & Entry Log", icon: QrCode, url: "/librarian/entry" },
      ],
    },
    {
      label: "MEMBERS & SERVICES",
      items: [
        { id: "members", label: "Members", icon: Users, url: "/librarian/members" },
        { id: "id-cards", label: "ID Card Generation", icon: CreditCard, url: "/librarian/id-cards" },
        { id: "digital", label: "Digital Library", icon: FileText, url: "/librarian/digital" },
        { id: "fines", label: "Fines & Payments", icon: Wallet, url: "/librarian/fines" },
      ],
    },
    {
      label: "SYSTEM & AUDIT",
      items: [
        { id: "reports", label: "Reports & Analytics", icon: TrendingUp, url: "/librarian/reports" },
        { id: "notifications", label: "Notifications", icon: Bell, url: "/librarian/notifications" },
        { id: "audit-logs", label: "Audit Logs", icon: ShieldCheck, url: "/librarian/audit-logs" },
        { id: "settings", label: "Settings & Rules", icon: Settings, url: "/librarian/settings" },
      ],
    },
  ];

  const handleLogout = () => {
    setRole("super-admin");
    navigate({ to: "/login" });
  };

  const filteredLibrarianSections = librarianSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  if (isLibrarian) {
    return (
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader className="gap-2 px-3 pt-3 pb-1">
          <Link to="/librarian" className="flex min-w-0 items-center">
            <Logo showName={!collapsed} tone="mono" nameClassName="text-sidebar-foreground" />
          </Link>
          {!collapsed && (
            <div className="relative mt-0.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu..."
                className="h-8 border-sidebar-border bg-sidebar-accent/50 pl-8 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:ring-sidebar-ring rounded-lg"
              />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {filteredLibrarianSections.map((section) => (
            <SidebarGroup key={section.label} className="py-1 px-1">
              <SidebarGroupLabel className="h-5 px-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sidebar-foreground/50 mb-0.5">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {section.items.map((item) => {
                    const active = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          size="sm"
                          tooltip={item.label}
                          className="h-8 text-xs font-medium rounded-lg px-2.5 transition-colors"
                        >
                          <Link to={item.url} className="flex items-center gap-2.5">
                            <Icon className="size-3.5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2">
          <div className={cn("flex items-center gap-2.5 px-1 py-1", collapsed && "justify-center")}>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {profile.initials}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-sidebar-foreground">
                  {profile.personaName}
                </p>
                <p className="truncate text-[0.68rem] text-sidebar-foreground/60">{profile.label}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-sidebar-foreground/60 hover:text-red-400 cursor-pointer p-1 transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  if (isHostel) {
    const hostelNavItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        url: "/hostel/dashboard",
        isActive:
          pathname === "/hostel" ||
          pathname === "/hostel/" ||
          pathname === "/hostel/dashboard",
      },
      {
        id: "hostel",
        label: "Hostel",
        icon: Building2,
        url: "/hostel/rooms",
        isGroup: true,
        isActive:
          pathname.startsWith("/hostel/attendance") ||
          pathname.startsWith("/hostel/visitors") ||
          pathname.startsWith("/hostel/complaints") ||
          pathname.startsWith("/hostel/mess-menus") ||
          pathname.startsWith("/hostel/mess-fees") ||
          pathname.startsWith("/hostel/rooms"),
        children: [
          { label: "Attendance", url: "/hostel/attendance", icon: CalendarCheck },
          { label: "Visitors", url: "/hostel/visitors", icon: ClipboardList },
          { label: "Complaints", url: "/hostel/complaints", icon: MessageSquare },
          { label: "Mess Menus", url: "/hostel/mess-menus", icon: Utensils },
          { label: "Mess Fees", url: "/hostel/mess-fees", icon: Wallet },
        ],
      },
      {
        id: "residents",
        label: "Residents",
        icon: Users,
        url: "/hostel/students",
        isActive: pathname === "/hostel/students" || pathname === "/hostel/residents",
      },
      {
        id: "fees",
        label: "Fees",
        icon: Wallet,
        url: "/hostel/fees",
        isActive: pathname === "/hostel/fees",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        url: "/hostel/notifications",
        isActive: pathname === "/hostel/notifications",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        url: "/hostel/settings",
        isActive: pathname === "/hostel/settings",
      },
    ];

    const filteredHostelItems = hostelNavItems.filter((item) =>
      item.label.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader className="gap-2 px-3 pt-3 pb-1">
          <Link to="/hostel/dashboard" className="flex min-w-0 items-center">
            <Logo showName={!collapsed} tone="mono" nameClassName="text-sidebar-foreground" />
          </Link>
          {!collapsed && (
            <div className="relative mt-0.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu..."
                className="h-8 border-sidebar-border bg-sidebar-accent/50 pl-8 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:ring-sidebar-ring rounded-lg"
              />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-3 py-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="px-2 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-sidebar-foreground/50 uppercase">
              MENU
            </p>
          )}
          <SidebarMenu className="gap-1">
            {filteredHostelItems.map((item) => {
              const Icon = item.icon;
              if (item.isGroup && !collapsed) {
                return (
                  <Collapsible key={item.id} defaultOpen={item.isActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={item.isActive}
                          tooltip={item.label}
                          className={cn(
                            "h-10 text-sm font-medium rounded-xl px-3.5 transition-all duration-200 w-full flex items-center justify-between",
                            item.isActive
                              ? "bg-gradient-to-r from-[#00b4d8] via-[#0096c7] to-[#023e8a] text-white font-semibold shadow-md hover:text-white"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                item.isActive ? "text-white" : "text-sidebar-foreground/60"
                              )}
                            />
                            <span className="truncate text-sm">{item.label}</span>
                          </div>
                          <ChevronDown className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180 opacity-70" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-4 space-y-0.5 my-1">
                          {item.children?.map((child) => {
                            const SubIcon = child.icon;
                            const isSubActive = pathname === child.url;
                            return (
                              <SidebarMenuSubItem key={child.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                  className={cn(
                                    "text-xs font-medium rounded-lg px-2.5 py-1.5 flex items-center gap-2.5 transition-colors",
                                    isSubActive
                                      ? "font-semibold text-sidebar-foreground bg-sidebar-accent/60"
                                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                                  )}
                                >
                                  <Link to={child.url} className="flex items-center gap-2.5 w-full">
                                    <SubIcon className="size-3.5 shrink-0 opacity-70" />
                                    <span>{child.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.label}
                    className={cn(
                      "h-10 text-sm font-medium rounded-xl px-3.5 transition-all duration-200",
                      item.isActive
                        ? "bg-gradient-to-r from-[#00b4d8] via-[#0096c7] to-[#023e8a] text-white font-semibold shadow-md hover:text-white"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 w-full">
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          item.isActive ? "text-white" : "text-sidebar-foreground/60"
                        )}
                      />
                      {!collapsed && <span className="truncate flex-1 text-sm">{item.label}</span>}
                      {!collapsed && item.isActive && (
                        <span className="size-2 rounded-full bg-white shrink-0 shadow-sm" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3 px-1 py-1", collapsed && "justify-center")}>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm">
              {profile.initials || "HW"}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-sidebar-foreground">
                  {profile.personaName || "Rajesh Sharma"}
                </p>
                <p className="truncate text-[11px] text-sidebar-foreground/70">
                  {profile.label || "Hostel Warden"}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-sidebar-foreground/60 hover:text-red-400 cursor-pointer p-1 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  if (isTransport) {
    const transportNavItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        url: "/transport/dashboard",
        isActive:
          pathname === "/transport" ||
          pathname === "/transport/" ||
          pathname === "/transport/dashboard",
      },
      {
        id: "transport",
        label: "Transport",
        icon: Bus,
        url: "/transport/buses",
        isActive: pathname === "/transport/buses" || pathname === "/transport/routes",
      },
      {
        id: "passengers",
        label: "Passengers",
        icon: Users,
        url: "/transport/passengers",
        isActive: pathname === "/transport/passengers",
      },
      {
        id: "fees",
        label: "Fee Collection",
        icon: Wallet,
        url: "/transport/fees",
        isActive: pathname === "/transport/fees" || pathname === "/transport/fee-collection",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        url: "/transport/notifications",
        isActive: pathname === "/transport/notifications",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        url: "/transport/settings",
        isActive: pathname === "/transport/settings",
      },
    ];

    return (
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader className="gap-2 px-3 pt-3 pb-1">
          <Link to="/transport/dashboard" className="flex min-w-0 items-center">
            <Logo showName={!collapsed} tone="mono" nameClassName="text-sidebar-foreground" />
          </Link>
          {!collapsed && (
            <div className="relative mt-0.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu..."
                className="h-8 border-sidebar-border bg-sidebar-accent/50 pl-8 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:ring-sidebar-ring rounded-lg"
              />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-3 py-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="px-2 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-sidebar-foreground/50 uppercase">
              MENU
            </p>
          )}
          <SidebarMenu className="gap-1">
            {transportNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.label}
                    className={cn(
                      "h-10 text-sm font-medium rounded-xl px-3.5 transition-all duration-200",
                      item.isActive
                        ? "bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] to-[#06b6d4] text-white font-semibold shadow-md hover:text-white"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 w-full">
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          item.isActive ? "text-white" : "text-sidebar-foreground/60",
                        )}
                      />
                      {!collapsed && <span className="truncate flex-1 text-sm">{item.label}</span>}
                      {!collapsed && item.isActive && (
                        <span className="size-2 rounded-full bg-white shrink-0 shadow-sm" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3 px-1 py-1", collapsed && "justify-center")}>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              {profile.initials || "TM"}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-sidebar-foreground">
                  {profile.personaName || "Gurpreet Singh"}
                </p>
                <p className="truncate text-[11px] text-sidebar-foreground/70">
                  {profile.label || "Transport Manager"}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-sidebar-foreground/60 hover:text-red-400 cursor-pointer p-1 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  // Standard Sidebar for other roles
  const sections = navigationForUser({ role, flags, department, externalPersona, featureFlags })
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon" className="border-r border-[#24356B] bg-[#0F1B44] text-[#F5F7FF]">
      <SidebarHeader className="gap-3 px-3 pt-4 pb-2">
        <Link to="/dashboard" className="flex min-w-0 items-center">
          <Logo showName={!collapsed} tone="mono" nameClassName="text-[#F5F7FF]" />
        </Link>
        {!collapsed && (
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#4D78FF]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu..."
              className="h-9 w-full border border-[#24356B] bg-[#16234F] pl-9 text-xs text-white placeholder:text-[#8F9CC3] rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#4D78FF] transition-all duration-200"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <SidebarGroup key={section.label} className="py-1">
            <SidebarGroupLabel className="text-[0.68rem] font-semibold uppercase tracking-[2px] text-[#7F8DB5] px-2 py-1.5">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const currentCleanPath = pathname.split("?")[0];
                  const hasQueryParam = item.url.includes("?");
                  let isItemActive = false;

                  if (hasQueryParam) {
                    isItemActive =
                      href.includes(item.url) ||
                      (!href.includes("?module=") && item.url.includes("module=dashboard"));
                  } else {
                    const itemCleanPath = item.url.split("?")[0];
                    const isChildActive =
                      item.children?.some(
                        (child) => child.url.split("?")[0] === currentCleanPath
                      ) ?? false;
                    isItemActive = currentCleanPath === itemCleanPath || isChildActive;
                  }

                  if (item.children && !collapsed) {
                    return (
                      <Collapsible
                        key={item.title}
                        defaultOpen={isItemActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isItemActive}
                              tooltip={item.title}
                              className="h-10 px-3 rounded-[14px] text-[#F5F7FF] hover:bg-[#162B63] hover:text-white data-[active=true]:bg-[#1A285D] data-[active=true]:text-[#4D78FF] data-[active=true]:font-bold data-[active=true]:shadow-md data-[active=true]:shadow-[#4D78FF]/20 transition-all duration-200 cursor-pointer"
                            >
                              <item.icon className="size-5 shrink-0 text-[#4D78FF]" />
                              <span className="truncate">{item.title}</span>
                              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-[#7F8DB5]" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-200 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <SidebarMenuSub className="ml-4 border-l border-[#24356B] pl-3 space-y-1 my-1">
                              {item.children.map((child) => {
                                const childCleanPath = child.url.split("?")[0];
                                const hasSubParam = child.url.includes("?");
                                const isSubActive = hasSubParam
                                  ? href.includes(child.url) || (href.includes("/alumni") && !href.includes("?tab=") && child.url.includes("tab=dashboard"))
                                  : currentCleanPath === childCleanPath;
                                return (
                                  <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className="text-xs text-[#F5F7FF] hover:bg-[#162B63] hover:text-white data-[active=true]:font-bold data-[active=true]:text-[#4D78FF] data-[active=true]:bg-[#1A285D] rounded-[10px] px-3 py-1.5 transition-all duration-200"
                                    >
                                      <Link to={child.url}>{child.title}</Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isItemActive}
                        tooltip={item.title}
                        className="h-10 px-3 rounded-[14px] text-[#F5F7FF] hover:bg-[#162B63] hover:text-white data-[active=true]:bg-[#1A285D] data-[active=true]:text-[#4D78FF] data-[active=true]:font-bold data-[active=true]:shadow-md data-[active=true]:shadow-[#4D78FF]/20 transition-all duration-200 cursor-pointer"
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="size-5 shrink-0 text-[#4D78FF]" />
                          <span className="truncate">{item.title}</span>
                          {item.badge && !collapsed && (
                            <Badge className="ml-auto h-5 bg-[#4D78FF] px-1.5 text-[0.65rem] text-white font-bold rounded-md">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-[#24356B] bg-[#13204C] p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#4D78FF] text-xs font-bold text-white ring-2 ring-[#4D78FF]/30 shadow-xs">
            {profile.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {profile.personaName}
              </p>
              <p className="truncate text-[11px] text-[#8F9CC3] font-mono">
                {role === "student" ? "Roll No: 22CS101" : profile.label}
              </p>
              {role === "student" && (
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-emerald-400 font-medium font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
