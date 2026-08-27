import { brand } from "@/config/branding";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "mark" | "wordmark";
  tone?: "color" | "mono" | "white";
  className?: string;
  showName?: boolean;
  nameClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  animated?: boolean;
}

export function Logo({
  variant = "mark",
  tone = "color",
  className,
  showName = false,
  nameClassName,
  size = "md",
  animated = false,
}: LogoProps) {
  const src = variant === "wordmark" ? brand.logos.wordmark : brand.logos.mark;

  const sizeClasses = {
    sm: "h-9 md:h-10",
    md: "h-12 md:h-14",
    lg: "h-16 md:h-18",
    xl: "h-28 md:h-32",
    "2xl": "h-36 md:h-44",
    "3xl": "h-44 md:h-52",
  };

  const markSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
    "2xl": "h-32 w-32",
    "3xl": "h-40 w-40",
  };

  const isWhite = tone === "mono" || tone === "white";

  if (showName) {
    return (
      <span
        className={cn(
          "inline-flex min-w-0 items-center justify-start py-1 transition-transform duration-300 hover:scale-105",
          animated && "animate-logo-float",
          className,
        )}
      >
        <img
          src={src}
          alt={brand.name}
          className={cn(
            "w-auto shrink-0 object-contain transition-all duration-300",
            sizeClasses[size],
            isWhite && "brightness-0 invert",
          )}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "shrink-0 rounded-xl flex items-center justify-center bg-transparent transition-all duration-300 hover:scale-105",
        markSizeClasses[size],
        animated && "animate-logo-float",
        className,
      )}
    >
      <img
        src={src}
        alt={`${brand.name} mark`}
        className={cn(
          "h-full w-full object-contain transition-all duration-300",
          isWhite && "brightness-0 invert",
        )}
      />
    </span>
  );
}
