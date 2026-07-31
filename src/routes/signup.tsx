import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your campus account — EduSuite Pro" },
      { name: "description", content: "Start your EduSuite Pro trial and onboard your institution in minutes." },
      { property: "og:title", content: "Create your campus account — EduSuite Pro" },
      { property: "og:description", content: "Onboard your institution to EduSuite Pro in minutes." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Create your institution account"
      subtitle="Set up your campus workspace and invite departments."
      footer={
        <>
          Already onboarded?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({ to: "/verify-email" });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Institution name</Label>
          <Input id="institution" placeholder="Sree Institute of Technology" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="work-email">Work email</Label>
          <Input id="work-email" type="email" placeholder="principal@college.edu" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Student strength</Label>
          <Select defaultValue="1000-3000">
            <SelectTrigger id="size">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-500">Up to 500</SelectItem>
              <SelectItem value="500-1000">500 - 1,000</SelectItem>
              <SelectItem value="1000-3000">1,000 - 3,000</SelectItem>
              <SelectItem value="3000+">3,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Password</Label>
          <Input id="new-password" type="password" required />
        </div>

        <Button type="submit" className="w-full bg-brand-gradient shadow-glow">
          Create account
        </Button>
        <p className="text-xs text-muted-foreground">
          By continuing you agree to the EduSuite Pro terms of service and data processing agreement.
        </p>
      </form>
    </AuthLayout>
  );
}
