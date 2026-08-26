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

  // If showName is true, show the full logo (image containing text) to avoid duplicate text
  if (showName) {
    return (
      <span className={cn("flex min-w-0 items-center justify-start py-1", className)}>
        <img
          src={src}
          alt={brand.name}
          className={cn(
            "h-12 w-auto shrink-0 object-contain",
            tone === "mono" && brand.monochromeClassName,
          )}
        />
      </span>
    );
  }

  // Icon-only / Mark (app icon): Blue rounded square with a white icon inside
  return (
    <span
      className={cn(
        "relative overflow-hidden h-9 w-9 shrink-0 rounded-xl flex items-center justify-center bg-primary shadow-sm",
        className,
      )}
    >
      <img
        src={src}
        alt={`${brand.name} mark`}
        className={cn(
          "absolute left-1/2 top-0 h-[54px] w-[81px] -translate-x-1/2 object-contain",
          tone === "mono" && brand.monochromeClassName,
        )}
      />
    </span>
  );
}
