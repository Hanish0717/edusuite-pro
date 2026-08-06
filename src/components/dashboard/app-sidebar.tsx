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
  const { role, flags, department, externalPersona, featureFlags } = useRole();
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
    <Sidebar collapsible="icon" className="border-r border-[#1E3A8A] bg-[#172554] text-[#F5F7FF]">
      <SidebarHeader className="gap-3 px-3 pt-4 pb-2">
        <Link to="/dashboard" className="flex min-w-0 items-center">
          <Logo showName={!collapsed} tone="mono" nameClassName="text-[#F5F7FF]" />
        </Link>
        {!collapsed && (
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2563EB]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu..."
              className="h-9 w-full border border-[#1E3A8A] bg-[#1E3A8A]/40 pl-9 text-xs text-white placeholder:text-[#93C5FD]/70 rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#2563EB] transition-all duration-200"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <SidebarGroup key={section.label} className="py-1">
            <SidebarGroupLabel className="text-[0.68rem] font-semibold uppercase tracking-[2px] text-[#93C5FD] px-2 py-1.5">
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
                            <SidebarMenuButton
                              isActive={isItemActive}
                              tooltip={item.title}
                              className="h-10 px-3 rounded-[14px] text-[#F5F7FF] hover:bg-[#1E3A8A] hover:text-white data-[active=true]:bg-[#2563EB] data-[active=true]:text-white data-[active=true]:font-bold data-[active=true]:shadow-md data-[active=true]:shadow-[#2563EB]/40 transition-all duration-200 cursor-pointer relative overflow-hidden"
                            >
                              {isItemActive && (
                                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-[#DBEAFE]" />
                              )}
                              <div className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${isItemActive ? "bg-[#DBEAFE] text-[#2563EB]" : "text-[#60A5FA]"}`}>
                                <item.icon className="size-4 shrink-0" />
                              </div>
                              <span className="truncate">{item.title}</span>
                              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-[#7F8DB5]" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-200 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <SidebarMenuSub className="ml-4 border-l border-[#1E3A8A] pl-3 space-y-1 my-1">
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
                                      className="text-xs text-[#F5F7FF] hover:bg-[#1E3A8A] hover:text-white data-[active=true]:font-bold data-[active=true]:text-white data-[active=true]:bg-[#2563EB] rounded-[10px] px-3 py-1.5 transition-all duration-200"
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
                        className="h-10 px-3 rounded-[14px] text-[#F5F7FF] hover:bg-[#1E3A8A] hover:text-white data-[active=true]:bg-[#2563EB] data-[active=true]:text-white data-[active=true]:font-bold data-[active=true]:shadow-md data-[active=true]:shadow-[#2563EB]/40 transition-all duration-200 cursor-pointer relative overflow-hidden"
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          {isItemActive && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-[#DBEAFE]" />
                          )}
                          <div className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${isItemActive ? "bg-[#DBEAFE] text-[#2563EB]" : "text-[#60A5FA]"}`}>
                            <item.icon className="size-4 shrink-0" />
                          </div>
                          <span className="truncate">{item.title}</span>
                          {item.badge && !collapsed && (
                            <Badge className="ml-auto h-5 bg-[#2563EB] px-1.5 text-[0.65rem] text-white font-bold rounded-md">
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
    </Sidebar>
  );
}
