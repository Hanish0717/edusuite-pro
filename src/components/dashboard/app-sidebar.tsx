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
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, flags, department, externalPersona, featureFlags, profile } = useRole();
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const href = useRouterState({ select: (r) => r.location.href });

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

      <SidebarContent className="px-2 py-2 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <SidebarGroup key={section.label} className="py-1">
            <SidebarGroupLabel className="text-[0.68rem] font-semibold uppercase tracking-[2px] text-[#7F8DB5] px-2 py-1.5">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
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
                      (!href.includes("?module=") && item.url.includes("module=dashboard") && href.endsWith("/dashboard"));
                  } else if (itemCleanPath === "/dashboard" || itemCleanPath === "/") {
                    isItemActive = currentCleanPath === "/dashboard" || currentCleanPath === "/";
                  } else {
                    isItemActive =
                      currentCleanPath === itemCleanPath ||
                      (itemCleanPath !== "/" && itemCleanPath !== "/placement" && currentCleanPath.startsWith(itemCleanPath + "/")) ||
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
                            <SidebarMenuButton
                              isActive={isItemActive}
                              tooltip={item.title}
                             className="h-8 px-3 rounded-[10px] text-[#F5F7FF] hover:bg-[#162B63] hover:text-white data-[active=true]:bg-[#1A285D] data-[active=true]:text-[#4D78FF] data-[active=true]:font-bold data-[active=true]:shadow-md data-[active=true]:shadow-[#4D78FF]/20 transition-all duration-200 cursor-pointer"
                            >
                              <item.icon className="size-5 shrink-0 text-[#4D78FF]" />
                              <span className="truncate">{item.title}</span>
                              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-[#7F8DB5]" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-200 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <SidebarMenuSub className="ml-4 border-l border-[#24356B] pl-3 space-y-1 my-1">
                              {item.children.map((child) => {
                                const childCleanPath = (child.url || "").split("?")[0] || "";
                                const hasSubParam = child.url.includes("?");
                                const isSubActive = hasSubParam
                                  ? href.includes(child.url) || (href.includes("/alumni") && !href.includes("?tab=") && child.url.includes("tab=dashboard"))
                                  : currentCleanPath === childCleanPath || (childCleanPath !== "/" && currentCleanPath.startsWith(childCleanPath));
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
                        className="h-8 px-3 rounded-[10px] text-[#F5F7FF] hover:bg-[#162B63] hover:text-white data-[active=true]:bg-[#1A285D] data-[active=true]:text-[#4D78FF] data-[active=true]:font-bold data-[active=true]:shadow-md data-[active=true]:shadow-[#4D78FF]/20 transition-all duration-200 cursor-pointer"
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
