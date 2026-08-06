import { useState, useRef, useEffect } from "react"; import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DesignationOption } from "@/lib/authService";

// Dean submenu options – IDs must match those in authService
const DEAN_SUB_OPTIONS: DesignationOption[] = [
  { id: "academic_dean", label: "Academic Dean" },
  { id: "student_dean", label: "Student Dean" },
  { id: "iqac_dean", label: "IQAC" },
  { id: "ima_dean", label: "IMA" },
  { id: "research_dean", label: "Research & Development" },
  { id: "finance_dean", label: "Finance Dean" },
  { id: "examination_dean", label: "Examination Dean" },
  { id: "placement_dean", label: "Placement Dean" },
];

// Mapping dean IDs to their route paths for navigation
const DEAN_ROUTE_MAP: Record<string, string> = {
  academic_dean: "/staff/academic-dean",
  student_dean: "/staff/student-dean",
  iqac_dean: "/staff/iqac",
  ima_dean: "/staff/ima",
  research_dean: "/staff/research-development",
  finance_dean: "/staff/finance-dean",
  examination_dean: "/staff/examination-dean",
  placement_dean: "/staff/placement-dean",
};

interface StaffDesignationDropdownProps {
  coreRole: string; // e.g., "staff"
  value: string; // currently selected designation id
  options: DesignationOption[]; // full list from authService
  onChange: (newId: string) => void; // same handler used previously
}

export function StaffDesignationDropdown({
  coreRole,
  value,
  options,
  onChange,
}: StaffDesignationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deansExpanded, setDeansExpanded] = useState(false); console.log("isOpen:", isOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setDeansExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isDeanSelected = DEAN_SUB_OPTIONS.some((d) => d.id === value);
  const selectedDean = DEAN_SUB_OPTIONS.find((d) => d.id === value);
  const selectedStandard = options.find((opt) => opt.id === value);

  const displayLabel = coreRole === "staff"
    ? isDeanSelected
      ? `Deans → ${selectedDean?.label || "Dean"}`
      : selectedStandard?.label || "Select Designation"
    : selectedStandard?.label || "Select Option";

  const navigate = useNavigate();
  const handleSelect = (id: string) => {
    onChange(id);
    // Navigate to the corresponding dean dashboard if route exists
    const route = DEAN_ROUTE_MAP[id];
    if (route) {
      navigate({ to: route });
    }
    setIsOpen(false);
    setDeansExpanded(false);
  };


  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger – matches native select styling */}
      <button
          type="button"
          onClick={() => { console.log("Button Clicked"); setIsOpen(prev => !prev); }}
          aria-expanded={isOpen}
          className="w-full h-10 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary"
        >
        <span className="truncate flex items-center gap-1.5">
          
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          className={`size-4 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`}
        />
      </button>

      {/* Dropdown menu – always opens downward */}
      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 w-full z-50 bg-card border border-primary/40 rounded-xl shadow-2xl max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-1 space-y-0.5">
            {/* Render HOD first if present */}
            {options
              .filter((opt) => opt.id === "hod")
              .map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    value === opt.id
                      ? "bg-primary text-primary-foreground font-extrabold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.id && <Check className="size-3.5 shrink-0" />}
                </button>
              ))}

            {/* Deans expandable parent */}
            <div className="pt-1 mt-1 border-t border-border/80">
              <button
                type="button"
                onClick={() => setDeansExpanded((prev) => !prev)}
                className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center gap-1.5"><span>Deans</span></div>
                {deansExpanded ? (
                  <ChevronDown className="size-4 text-primary" />
                ) : (
                  <ChevronRight className="size-4 text-primary" />
                )}
              </button>

              {deansExpanded && (
                <div className="pl-3 py-1 space-y-0.5 border-l-2 border-primary/30 ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                  {DEAN_SUB_OPTIONS.map((dean) => (
                    <button
                      key={dean.id}
                      type="button"
                      onClick={() => handleSelect(dean.id)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        value === dean.id
                          ? "bg-primary text-primary-foreground font-extrabold"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <span className="truncate">{dean.label}</span>
                      {value === dean.id && <Check className="size-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Render remaining non‑dean, non‑HOD options */}
            {options
              .filter(
                (opt) =>
                  !DEAN_SUB_OPTIONS.some((d) => d.id === opt.id) && opt.id !== "hod"
              )
              .map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    value === opt.id
                      ? "bg-primary text-primary-foreground font-extrabold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.id && <Check className="size-3.5 shrink-0" />}
                </button>
              ))}

            
          </div>
        </div>
      )}
    </div>
  );
}
