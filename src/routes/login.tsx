import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { roleOrder, roleProfiles, type LoginRole, getDefaultRouteForUser } from "@/config/roles";
import { useRole } from "@/context/role-context";

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
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LoginRole>(role);

  return (
    <AuthLayout
      title="Sign in to your campus"
      subtitle="Use your institution email. Pick a demo role to preview its dashboard."
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
          setRole(selected);
          const defaultRoute = getDefaultRouteForUser(selected, roleProfiles[selected].flags);
          navigate({ to: defaultRoute });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@college.edu"
            defaultValue="demo@edusuitepro.com"
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
          <Input id="password" type="password" defaultValue="demo1234" required />
        </div>

        <div className="space-y-2">
          <Label>Preview as</Label>
          <div className="grid grid-cols-2 gap-2">
            {roleOrder.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelected(item)}
                aria-pressed={selected === item}
                className={
                  selected === item
                    ? "rounded-xl border-2 border-primary bg-primary/5 px-3 py-2 text-left text-sm font-medium"
                    : "rounded-xl border border-border px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent"
                }
              >
                {roleProfiles[item].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" className="w-full bg-brand-gradient shadow-glow">
          Sign in
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
