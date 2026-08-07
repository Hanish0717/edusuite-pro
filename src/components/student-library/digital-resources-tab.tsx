import React, { useState } from "react";
import { DigitalResourceItem } from "./types";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Globe, 
  ExternalLink, 
  Eye, 
  Bookmark, 
  Share2, 
  Download, 
  Layers, 
  Award, 
  Laptop, 
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DigitalResourcesTabProps {
  resources: DigitalResourceItem[];
  onPreviewResource: (res: DigitalResourceItem) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  "E-Books": BookOpen,
  "Courseware": Layers,
  "Digital Library": Globe,
  "Dictionary": FileText,
  "Journals": FileText,
  "Lecture Videos": Video,
  "Open ETD": Award,
  "Useful Links": ExternalLink,
  "Virtual Labs": Laptop,
  "Previous Question Papers": FileText,
  "IEEE Papers": Award,
  "NPTEL Courses": Video,
  "Research Publications": Globe,
};

export function DigitalResourcesTab({ resources, onPreviewResource }: DigitalResourcesTabProps) {
  const [search, setSearch] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const categories = [
    "E-Books",
    "Courseware",
    "Digital Library",
    "Dictionary",
    "Journals",
    "Lecture Videos",
    "Open ETD",
    "Useful Links",
    "Virtual Labs",
    "Previous Question Papers",
    "IEEE Papers",
    "NPTEL Courses",
    "Research Publications",
  ] as const;

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const next = !prev[id];
      toast.success(next ? `Bookmarked "${title}"` : `Removed bookmark for "${title}"`);
      return { ...prev, [id]: next };
    });
  };

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    toast.info(`Resource link for "${title}" copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SEARCH */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" /> Digital Repository & Learning Resources ({resources.length})
            </h3>
            <p className="text-xs text-slate-500">
              CampX style categorized digital library index with instant full-text previews.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 150+ digital resources..."
              className="pl-9 h-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      {/* ACCORDION CATEGORIES */}
      <Accordion type="single" collapsible defaultValue="E-Books" className="space-y-3">
        {categories.map((catName) => {
          const categoryItems = resources.filter(
            (r) =>
              r.category === catName &&
              (search ? r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()) : true)
          );

          const CategoryIcon = CATEGORY_ICONS[catName] || FileText;

          return (
            <AccordionItem
              key={catName}
              value={catName}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      {catName}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {categoryItems.length} resources available
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-4 pt-2">
                {categoryItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[9px] font-mono text-amber-600 border-amber-200">
                              {res.department}
                            </Badge>
                            <span className="text-[10px] font-mono text-slate-400">
                              {res.fileFormat} • {res.fileSize}
                            </span>
                          </div>

                          <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                            {res.title}
                          </h5>

                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {res.description}
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>Subject: {res.subject}</span>
                            <span className="text-emerald-600 font-bold">{res.downloadsCount} downloads</span>
                          </div>
                        </div>

                        {/* BUTTONS: OPEN, PREVIEW, BOOKMARK, SHARE */}
                        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <Button
                            onClick={() => {
                              window.open(res.url, "_blank");
                              toast.info(`Opening ${res.title}...`);
                            }}
                            size="sm"
                            className="rounded-lg text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold h-7 px-1 gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Open
                          </Button>

                          <Button
                            onClick={() => onPreviewResource(res)}
                            size="sm"
                            variant="outline"
                            className="rounded-lg text-[10px] font-semibold h-7 px-1 gap-1"
                          >
                            <Eye className="h-3 w-3 text-purple-600" /> Preview
                          </Button>

                          <Button
                            onClick={() => toggleBookmark(res.id, res.title)}
                            size="sm"
                            variant="outline"
                            className={`rounded-lg text-[10px] font-semibold h-7 px-1 ${
                              bookmarkedIds[res.id] ? "bg-amber-50 text-amber-600 border-amber-300" : ""
                            }`}
                          >
                            <Bookmark className={`h-3 w-3 ${bookmarkedIds[res.id] ? "fill-amber-500" : ""}`} />
                          </Button>

                          <Button
                            onClick={() => handleShare(res.title)}
                            size="sm"
                            variant="outline"
                            className="rounded-lg text-[10px] font-semibold h-7 px-1"
                          >
                            <Share2 className="h-3 w-3 text-slate-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    No resources matching query in this category.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
