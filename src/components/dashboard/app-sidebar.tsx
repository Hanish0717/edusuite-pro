import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";

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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigationForUser } from "@/config/navigation";
import { useRole } from "@/context/role-context";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, flags, department, externalPersona, featureFlags, profile } = useRole();
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const href = useRouterState({ select: (r) => r.location.href });

  const sections = navigationForUser({ role, flags, department, externalPersona, featureFlags }, pathname)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon" className="border-r border-[#172242] bg-[#0A1128] text-white">
      <SidebarHeader className="gap-3 px-3 pt-4 pb-2 bg-[#0A1128]">
        <Link to="/dashboard" className="flex min-w-0 items-center">
          <Logo showName={!collapsed} tone="mono" nameClassName="text-white font-extrabold text-base" />
        </Link>
        {!collapsed && (
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7C88A5]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu..."
              className="h-8 w-full border border-[#172242] bg-[#121B3B] pl-9 text-xs text-white placeholder:text-[#7C88A5] rounded-md focus-visible:ring-1 focus-visible:ring-white/20 transition-all duration-150"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 bg-[#0A1128] no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <SidebarGroup key={section.label} className="py-1 px-1">
            {!collapsed && (
              <div className="text-[14px] font-medium text-[#7C88A5] tracking-normal px-3 mt-5 mb-1.5">
                {section.label}
              </div>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {section.items.map((item) => {
                  const currentCleanPath = (pathname || "").split("?")[0] || "";
                  const hasQueryParam = item.url.includes("?");
                  const itemCleanPath = (item.url || "").split("?")[0] || "";
                  const itemSlug = itemCleanPath.replace(/^\//, "").split("/")[0] || "";
                  let isItemActive = false;

                  const isChildActive =
                    item.children?.some((child) => {
                      const childPath = (child.url || "").split("?")[0] || "";
                      return currentCleanPath === childPath || (childPath !== "/" && currentCleanPath.startsWith(childPath));
                    }) ?? false;

                  if (hasQueryParam) {
                    isItemActive =
                      href.includes(item.url) ||
                      (!href.includes("?module=") && item.url.includes("module=dashboard"));
                  } else if (itemCleanPath === "/dashboard" || itemCleanPath === "/") {
                    isItemActive = currentCleanPath === "/dashboard" || currentCleanPath === "/";
                  } else {
                    isItemActive =
                      currentCleanPath === itemCleanPath ||
                      (itemCleanPath !== "/" && currentCleanPath.startsWith(itemCleanPath)) ||
                      (itemSlug !== "" && currentCleanPath.includes(`/${itemSlug}`)) ||
                      isChildActive;
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
                            <button
                              type="button"
                              className={cn(
                                "flex w-full items-center gap-3.5 px-3 py-1.5 text-[15px] font-normal leading-[24px] text-white bg-transparent hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer border-0 shadow-none outline-none focus:outline-none rounded-none",
                                isItemActive && "bg-white/[0.07] text-white"
                              )}
                            >
                              <item.icon className="size-5 shrink-0 text-white stroke-[1.75]" />
                              <span className="truncate">{item.title}</span>
                              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-[#7C88A5]" />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-150 ease-in-out">
                            <div className="ml-4 border-l border-[#172242] pl-2 space-y-0.5 my-1">
                              {item.children.map((child) => {
                                const childCleanPath = (child.url || "").split("?")[0] || "";
                                const hasSubParam = child.url.includes("?");
                                const isSubActive = hasSubParam
                                  ? href.includes(child.url) || (href.includes("/alumni") && !href.includes("?tab=") && child.url.includes("tab=dashboard"))
                                  : currentCleanPath === childCleanPath || (childCleanPath !== "/" && currentCleanPath.startsWith(childCleanPath));
                                return (
                                  <Link
                                    key={child.title}
                                    to={child.url}
                                    className={cn(
                                      "flex w-full items-center px-3 py-1.5 text-[14px] font-normal leading-[24px] text-white bg-transparent hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer border-0 shadow-none outline-none rounded-none",
                                      isSubActive && "bg-white/[0.07] text-white"
                                    )}
                                  >
                                    <span className="truncate">{child.title}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex w-full items-center gap-3.5 px-3 py-1.5 text-[15px] font-normal leading-[24px] text-white bg-transparent hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer border-0 shadow-none outline-none rounded-none",
                          isItemActive && "bg-white/[0.07] text-white"
                        )}
                      >
                        <item.icon className="size-5 shrink-0 text-white stroke-[1.75]" />
                        <span className="truncate">{item.title}</span>
                        {item.badge && !collapsed && (
                          <Badge className="ml-auto h-5 bg-white/20 px-1.5 text-[0.65rem] text-white font-medium rounded border-0">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-[#172242] bg-[#0A1128] p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/20 text-xs font-medium text-white ring-2 ring-white/20 shadow-xs">
            {profile.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {profile.personaName}
              </p>
              <p className="truncate text-[11px] text-[#7C88A5] font-mono">
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
