import React from "react";
import {
  Cpu,
  Terminal,
  Code,
  Cloud,
  Shield,
  Server,
  Globe,
  BarChart2,
  Briefcase,
  UserCheck,
  MessageSquare,
  Layers,
  Smartphone,
  Database,
  ArrowRight,
} from "lucide-react";

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  const categories = [
    { name: "AI & ML", icon: Cpu },
    { name: "Python", icon: Terminal },
    { name: "Java", icon: Code },
    { name: "Cloud", icon: Cloud },
    { name: "Cyber Security", icon: Shield },
    { name: "DevOps", icon: Server },
    { name: "Web Development", icon: Globe },
    { name: "Data Science", icon: BarChart2 },
    { name: "Placement", icon: Briefcase },
    { name: "Interview Prep", icon: UserCheck },
    { name: "Soft Skills", icon: MessageSquare },
    { name: "React", icon: Layers },
    { name: "Mobile Development", icon: Smartphone },
    { name: "Blockchain", icon: Database },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Top Categories
        </h3>
        <button
          onClick={() => onSelectCategory("All")}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
        >
          View All <ArrowRight className="size-3" />
        </button>
      </div>

      {/* Grid Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const IconComp = cat.icon;

          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(isSelected ? "All" : cat.name)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? "bg-[#091024] text-white border-[#091024] shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <IconComp className={`size-3.5 ${isSelected ? "text-white" : "text-slate-600 dark:text-slate-400"}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
