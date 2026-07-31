import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — EduSuite Pro" },
      { name: "description", content: "Enter the six digit code sent to your institution email to activate your workspace." },
      { property: "og:title", content: "Verify your email — EduSuite Pro" },
      { property: "og:description", content: "Activate your EduSuite Pro workspace." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We sent a six digit code to your institution email address."
      footer={
        <>
          Wrong address?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Change it
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </span>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button asChild className="w-full bg-brand-gradient shadow-glow">
          <Link to="/dashboard">Verify and continue</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Didn't get it? <button className="font-medium text-primary hover:underline">Resend code</button>
        </p>
      </div>
    </AuthLayout>
  );
}
