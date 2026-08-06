import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigationForUser } from "@/config/navigation";
import { useRole } from "@/context/role-context";

export function AppSidebar() {
  const { isOpen, setOpen } = useSidebar();
  const { role, flags, department, externalPersona, featureFlags } = useRole();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navigation = navigationForUser(
    {
      role,
      flags,
      department,
      externalPersona,
      featureFlags,
    },
    currentPath
  );

  return (
    <Sidebar open={isOpen} setOpen={setOpen}>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-4 py-3">
          <Logo className="h-8 w-8" />
          <span className="font-semibold text-lg">EduSuite</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section, idx) => (
          <SidebarGroup key={idx} className="space-y-1">
            {section.label && (
              <SidebarGroupLabel className="px-4 py-2 text-sm font-medium text-muted-foreground">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = currentPath === item.url || currentPath.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary/10 text-primary font-semibold"
                        )}
                      >
                        {item.icon && <item.icon className="size-4" />}
                        {item.title}
                        {item.children && <span className="ml-auto text-xs opacity-70">▶</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
