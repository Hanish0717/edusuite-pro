import React, { useState } from "react";
import { toast } from "sonner";
import { Globe, BookOpen, Share2, Pin, Calendar, User, Search, Award, CheckCircle2 } from "lucide-react";
import { AlumniNewsItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AlumniNewsAnnouncementsViewProps {
  articlesList: AlumniNewsItem[];
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniNewsAnnouncementsView: React.FC<AlumniNewsAnnouncementsViewProps> = ({
  articlesList,
  onOpenMessagingCenter,
}) => {
  const [articles] = useState<AlumniNewsItem[]>(articlesList);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<AlumniNewsItem | null>(null);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  const pinnedArticle = articles.find((a) => a.isPinned) || articles[0];

  const filteredArticles = articles.filter((a) => {
    const matchesCat = activeCategory === "All" || a.category.includes(activeCategory);
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleShareArticle = (title: string) => {
    toast.success(`Copied article link for "${title}"!`, {
      description: "Link copied to clipboard. Ready to share on LinkedIn or Twitter.",
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="News & Institutional Announcements"
        subtitle="Stay updated on university NIRF/NAAC accreditations, research breakthroughs, campus recruitment reports, and alumni success."
        badgeText="Institutional Press & Communications"
        icon={Globe}
        onOpenMessagingCenter={onOpenMessagingCenter}
      />

      {/* FEATURED HERO ANNOUNCEMENT BANNER */}
      {pinnedArticle && (
        <GlassCard className="p-0 overflow-hidden border border-[#2563EB]/40 shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img
                src={pinnedArticle.image}
                alt={pinnedArticle.title}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B44] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0F1B44]" />
              <Badge className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-extrabold font-mono text-xs flex items-center gap-1.5 shadow-md">
                <Pin className="size-3.5" /> PINNED ANNOUNCEMENT
              </Badge>
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4 bg-[#0F1B44] text-white">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-blue-200">
                  <span>📅 {pinnedArticle.publishedDate}</span>
                  <span>•</span>
                  <span>⏱️ {pinnedArticle.readTime}</span>
                </div>

                <Badge variant="outline" className="bg-[#2563EB]/20 text-[#4D78FF] border-[#2563EB] text-xs font-mono">
                  {pinnedArticle.category}
                </Badge>

                <h2 className="text-xl md:text-2xl font-extrabold leading-snug">{pinnedArticle.title}</h2>
                <p className="text-xs md:text-sm text-[#8F9CC3] leading-relaxed line-clamp-3">
                  {pinnedArticle.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => {
                    setSelectedArticle(pinnedArticle);
                    setIsReaderModalOpen(true);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1.5 shadow-md"
                >
                  <BookOpen className="size-4" /> Read Full Announcement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShareArticle(pinnedArticle.title)}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-9 text-xs rounded-xl cursor-pointer gap-1.5"
                >
                  <Share2 className="size-3.5" /> Share
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* CATEGORY SWITCHER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 font-mono text-xs">
          {["All", "Accreditation", "Placement", "Research", "Alumni Success", "University"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`p-2 px-3.5 rounded-xl border font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                  : "bg-card border-[#24356B]/30 hover:border-[#4D78FF]/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search news or announcements..."
        />
      </div>

      {/* NEWS CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <GlassCard key={article.id} className="p-0 overflow-hidden flex flex-col justify-between border border-[#24356B]/30 font-sans">
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="size-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B44] via-transparent to-transparent" />
              <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white font-mono text-[0.65rem]">
                {article.category}
              </Badge>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted-foreground">
                  <span>📅 {article.publishedDate}</span>
                  <span>⏱️ {article.readTime}</span>
                </div>

                <h3 className="font-extrabold text-base text-foreground leading-snug">{article.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{article.summary}</p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[0.65rem] font-mono text-muted-foreground truncate">
                  By {article.author}
                </span>

                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedArticle(article);
                    setIsReaderModalOpen(true);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-8 text-xs rounded-xl cursor-pointer gap-1"
                >
                  Read Article
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <Dialog open={isReaderModalOpen} onOpenChange={setIsReaderModalOpen}>
          <DialogContent className="sm:max-w-2xl rounded-3xl p-6">
            <div className="space-y-4 font-sans text-xs">
              <DialogHeader>
                <div className="space-y-1">
                  <Badge className="bg-[#2563EB] text-white font-mono text-xs">{selectedArticle.category}</Badge>
                  <DialogTitle className="font-extrabold text-lg text-foreground pt-1">{selectedArticle.title}</DialogTitle>
                  <p className="text-xs font-mono text-muted-foreground">
                    Published: {selectedArticle.publishedDate} • By {selectedArticle.author}
                  </p>
                </div>
              </DialogHeader>

              <div className="rounded-2xl overflow-hidden h-52 w-full">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="size-full object-cover" />
              </div>

              <div className="space-y-3 font-sans text-xs text-foreground leading-relaxed">
                <p className="font-bold text-sm text-primary">{selectedArticle.summary}</p>
                <p>{selectedArticle.content}</p>
              </div>

              <DialogFooter className="pt-2 border-t border-border flex justify-between items-center sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleShareArticle(selectedArticle.title)}
                  className="rounded-xl cursor-pointer gap-1 text-xs"
                >
                  <Share2 className="size-3.5" /> Share Article
                </Button>
                <Button onClick={() => setIsReaderModalOpen(false)} className="rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                  Close Article
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
