import { brand } from "@/config/branding";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "mark" | "wordmark";
  tone?: "color" | "mono";
  className?: string;
  showName?: boolean;
  nameClassName?: string;
}

export function Logo({
  variant = "mark",
  tone = "color",
  className,
  showName = false,
  nameClassName,
}: LogoProps) {
  const src = variant === "wordmark" ? brand.logos.wordmark : brand.logos.mark;

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <img
        src={src}
        alt={`${brand.name} logo`}
        className={cn(
          "shrink-0 object-contain",
          variant === "wordmark" ? "h-9 w-auto" : "h-9 w-9",
          tone === "mono" && brand.monochromeClassName,
          className,
        )}
      />
      {showName && (
        <span
          className={cn(
            "truncate font-display text-base font-extrabold tracking-tight",
            nameClassName,
          )}
        >
          {brand.name}
        </span>
      )}
    </span>
  );
}
