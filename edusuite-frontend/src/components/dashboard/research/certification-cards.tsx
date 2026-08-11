import { ShieldCheck, Calendar, Key, ExternalLink } from "lucide-react";
import type { CertificationItem } from "./types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CertificationCardsProps {
  certifications: CertificationItem[];
}

export function CertificationCards({ certifications }: CertificationCardsProps) {
  const handleVerify = (cert: CertificationItem) => {
    toast.success("Verifying Credential", {
      description: `Opening certification URL link for: "${cert.name}"`
    });
  };

  if (certifications.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No certifications recorded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Header tag */}
            <div className="flex items-center justify-between gap-3">
              <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase tracking-wider">
                {cert.provider}
              </span>
            </div>

            {/* Certification Title */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                {cert.name}
              </h4>
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 col-span-2">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Completed: <strong className="text-foreground">{cert.completionDate}</strong></span>
              </div>
              {cert.expiryDate && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <Calendar className="size-3.5 text-muted-foreground/75" />
                  <span>Expires: <strong className="text-foreground">{cert.expiryDate}</strong></span>
                </div>
              )}
              {cert.credentialId && (
                <div className="flex items-center gap-1.5 col-span-2 mt-1">
                  <Key className="size-3.5 text-muted-foreground/75" />
                  <span className="truncate">Credential ID: <strong className="text-foreground font-mono">{cert.credentialId}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-4 border-t border-border/30 mt-4">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs font-bold text-primary hover:bg-primary/5 gap-1"
              onClick={() => handleVerify(cert)}
            >
              <ExternalLink className="size-3.5" /> Verify Link
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
