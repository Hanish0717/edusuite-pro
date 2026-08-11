import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import type { SkillsInfo } from "@/data/faculty-mock-data";

interface SkillsSectionProps {
  skills: SkillsInfo;
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const sections = [
    { label: "Technical Skills", items: skills.technicalSkills, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "Programming Languages", items: skills.programmingLanguages, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Research Focus Areas", items: skills.researchAreas, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Certifications", items: skills.certifications, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Software & Design Tools", items: skills.softwareTools, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ];

  return (
    <Panel
      title="Skills & Expertise Matrix"
      description="Validated technology stacks, certifications, and research domains"
      className="h-full border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-5 text-xs">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-2 pb-4 border-b border-border/40 last:border-0 last:pb-0">
            <h4 className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.65rem]">
              {sec.label}
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {sec.items.map((item, itemIdx) => (
                <Badge
                  key={itemIdx}
                  variant="secondary"
                  className={`rounded-lg border font-semibold py-1 px-2.5 ${sec.color}`}
                >
                  {item}
                </Badge>
              ))}
              {sec.items.length === 0 && (
                <span className="text-xs text-muted-foreground italic">No listings recorded.</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
