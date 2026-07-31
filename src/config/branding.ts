import markAsset from "@/assets/edusuite-mark.png.asset.json";
import wordmarkAsset from "@/assets/edusuite-wordmark.png.asset.json";

/**
 * Centralised branding configuration.
 *
 * Every surface (navbar, sidebar, auth pages, loading screen, favicon)
 * consumes the brand from here so the product can be white-labelled later
 * without touching any UI component.
 */
export type BrandLogoVariant = "mark" | "wordmark" | "monochrome" | "favicon" | "appIcon";

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  supportEmail: string;
  logos: Record<BrandLogoVariant, string>;
  /** Applied to monochrome usages (e.g. dark sidebars, print). */
  monochromeClassName: string;
}

export const brand: BrandConfig = {
  name: "EduSuite Pro",
  shortName: "EduSuite",
  tagline: "One Login. Many Responsibilities. Department-Level Control.",
  description:
    "AI powered College ERP SaaS platform that digitises admissions, academics, attendance, finance, hostel, transport and placements for every campus.",
  supportEmail: "hello@edusuitepro.com",
  logos: {
    mark: markAsset.url,
    wordmark: wordmarkAsset.url,
    monochrome: markAsset.url,
    favicon: "/favicon.png",
    appIcon: markAsset.url,
  },
  monochromeClassName: "brightness-0 invert",
};
