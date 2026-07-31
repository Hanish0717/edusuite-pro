import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — EduSuite Pro" },
      { name: "description", content: "Request a secure password reset link for your EduSuite Pro account." },
      { property: "og:title", content: "Reset your password — EduSuite Pro" },
      { property: "og:description", content: "Request a secure password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We will email a secure reset link to your institution address."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input id="reset-email" type="email" placeholder="you@college.edu" required />
        </div>
        <Button type="submit" className="w-full bg-brand-gradient shadow-glow">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
