import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";

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
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="gap-3 px-3 pt-4">
        <Link to="/dashboard" className="flex min-w-0 items-center">
          <Logo showName={!collapsed} tone="mono" nameClassName="text-sidebar-foreground" />
        </Link>
        {!collapsed && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-sidebar-foreground/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu..."
              className="h-9 border-sidebar-border bg-sidebar-accent/50 pl-8 text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:ring-sidebar-ring"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1">
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[0.68rem] uppercase tracking-[0.14em] text-sidebar-foreground/50">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
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
                              className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold transition-all duration-200"
                            >
                              <item.icon className="size-4 shrink-0 text-primary/80" />
                              <span className="truncate">{item.title}</span>
                              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90 text-sidebar-foreground/50" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-200 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <SidebarMenuSub className="ml-3.5 border-l border-primary/20 pl-2.5 space-y-0.5 my-1">
                              {item.children.map((child) => {
                                const childCleanPath = child.url.split("?")[0];
                                const isSubActive = currentCleanPath === childCleanPath;
                                return (
                                  <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className="text-xs data-[active=true]:font-bold data-[active=true]:text-primary data-[active=true]:bg-primary/5 rounded-lg px-2 py-1"
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
                        className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold transition-all duration-200"
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="size-4 shrink-0 text-primary/80" />
                          <span className="truncate">{item.title}</span>
                          {item.badge && !collapsed && (
                            <Badge className="ml-auto h-5 bg-sidebar-primary px-1.5 text-[0.65rem] text-sidebar-primary-foreground">
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

      <SidebarFooter className="border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3 px-1 py-2", collapsed && "justify-center")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {profile.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-sidebar-foreground">
                {profile.personaName}
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/60 font-mono">
                {role === "student" ? "Roll No: 22CS101" : profile.label}
              </p>
              {role === "student" && (
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-500 font-medium font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
