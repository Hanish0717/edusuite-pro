import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DEMO_USERS, getDefaultRouteForUser, type DemoUser } from "@/config/roles";
import { useRole } from "@/context/role-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — EduSuite Pro" },
      {
        name: "description",
        content: "Sign in to EduSuite Pro to access your role-based campus dashboard.",
      },
      { property: "og:title", content: "Sign in — EduSuite Pro" },
      { property: "og:description", content: "Access your role-based campus dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { setRole, setFlags, setDepartment, setExternalPersona } = useRole();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<DemoUser>(
    (DEMO_USERS.find((u) => u.id === "super-admin") || DEMO_USERS[0]) as DemoUser
  );
  const [email, setEmail] = useState(selectedUser.email);
  const [password, setPassword] = useState("demo1234");

  const handleSelectUser = (userId: string) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setEmail(user.email);
    }
  };

  const categories = [
    "Core Roles",
    "Academic Roles",
    "Administrative Officers",
    "External Personas",
  ] as const;

  return (
    <AuthLayout
      title="Sign in to your campus"
      subtitle="Use your institution email. Pick a demo user persona to preview their customized flow."
      footer={
        <>
          New institution?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          // Configure context for selected demo user
          setRole(selectedUser.role);
          setFlags(selectedUser.flags);
          setDepartment(selectedUser.department);
          setExternalPersona(selectedUser.externalPersona);

          const defaultRoute = getDefaultRouteForUser(selectedUser.role, selectedUser.flags);
          navigate({ to: defaultRoute });
        }}
      >
        <div className="space-y-2">
          <Label>Select Demo Persona</Label>
          <Select value={selectedUser.id} onValueChange={handleSelectUser}>
            <SelectTrigger className="w-full h-11 border-border">
              <SelectValue placeholder="Choose a user profile" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {categories.map((category) => (
                <SelectGroup key={category}>
                  <SelectLabel className="text-primary font-bold text-xs uppercase tracking-wider bg-muted/30 px-2 py-1 my-1">
                    {category}
                  </SelectLabel>
                  {DEMO_USERS.filter((u) => u.category === category).map((user) => (
                    <SelectItem key={user.id} value={user.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded bg-primary/10 text-primary text-[0.65rem] font-bold shrink-0">
                          {user.avatarInitials}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-sm">{user.title}</span>
                          <span className="text-[0.7rem] text-muted-foreground truncate max-w-[200px]">
                            {user.name} ({user.email})
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" className="w-full bg-brand-gradient shadow-glow h-10 text-sm font-semibold">
          Sign in as {selectedUser.name}
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button type="button" variant="outline" className="w-full">
          Continue with institution SSO
        </Button>
      </form>
    </AuthLayout>
  );
}
