import { FileText, Award, Users, Book, Briefcase, TrendingUp } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { ResearchPublicationsInfo } from "@/data/faculty-mock-data";

interface ResearchCardProps {
  researchInfo: ResearchPublicationsInfo;
}

export function ResearchCard({ researchInfo }: ResearchCardProps) {
  const cards = [
    { label: "Journal Publications", value: researchInfo.journalPublications, icon: FileText, desc: "Peer-reviewed international journals", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "Conference Papers", value: researchInfo.conferencePapers, icon: TrendingUp, desc: "IEEE and Springer conferences", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Patents Filed/Granted", value: researchInfo.patents, icon: Award, desc: "Intellectual property filings", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Books & Book Chapters", value: researchInfo.books, icon: Book, desc: "Reference books published", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { label: "Research Projects", value: researchInfo.researchProjects, icon: Briefcase, desc: "Sponsored research & funding", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Workshops Conducted", value: researchInfo.workshopsConducted, icon: Users, desc: "FDPs & student workshops led", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  ];

  return (
    <Panel
      title="Research & Publications"
      description="Scholarly contributions, intellectual properties, and academic events"
      className="h-full border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col p-4 rounded-2xl border bg-muted/20 hover:shadow-sm transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className={`grid size-9 place-items-center rounded-xl border ${card.color}`}>
                <card.icon className="size-4.5" />
              </span>
              <span className="text-2xl font-black tracking-tight">{card.value}</span>
            </div>
            <div className="mt-4">
              <h5 className="font-bold text-sm leading-snug">{card.label}</h5>
              <p className="text-[0.65rem] text-muted-foreground mt-0.5 leading-normal">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
