import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DesignationOption } from "@/lib/authService";

// Dean submenu options – IDs match those in authService
export const DEAN_SUB_OPTIONS: DesignationOption[] = [
  { id: "academic_dean", label: "Academic Dean" },
  { id: "student_dean", label: "Student Dean" },
  { id: "iqac_dean", label: "IQAC Dean" },
  { id: "ima_dean", label: "IMA Dean" },
  { id: "research_dean", label: "Research & Development Dean" },
  { id: "finance_dean", label: "Finance Dean" },
  { id: "examination_dean", label: "Examination Dean" },
  { id: "placement_dean", label: "Placement Dean" },
];

interface StaffDesignationDropdownProps {
  coreRole: string; // e.g., "staff"
  value: string; // currently selected designation id
  options: DesignationOption[]; // full list from authService
  onChange: (newId: string) => void;
}

export function StaffDesignationDropdown({
  coreRole,
  value,
  options,
  onChange,
}: StaffDesignationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deansExpanded, setDeansExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDeanSelected = DEAN_SUB_OPTIONS.some((d) => d.id === value);
  const selectedDean = DEAN_SUB_OPTIONS.find((d) => d.id === value);
  const selectedStandard = options.find((opt) => opt.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = coreRole === "staff"
    ? isDeanSelected
      ? `Deans → ${selectedDean?.label || "Dean"}`
      : selectedStandard?.label || "Select Designation"
    : selectedStandard?.label || "Select Option";

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && isDeanSelected) {
        setDeansExpanded(true);
      }
      return next;
    });
  };

  // Filter HOD, Faculty, Deans, and others for Staff coreRole
  const hodOption = options.find((opt) => opt.id === "hod");
  const facultyOption = options.find((opt) => opt.id === "faculty" || opt.id.startsWith("faculty"));
  const remainingOptions = options.filter(
    (opt) =>
      opt.id !== "hod" &&
      !opt.id.startsWith("faculty") &&
      !DEAN_SUB_OPTIONS.some((d) => d.id === opt.id)
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger – matches native select styling */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        className="w-full h-10 rounded-xl border border-input bg-card px-3 pr-8 text-xs font-bold text-foreground flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
          <div className="p-1.5 space-y-0.5">
            {/* Render HOD first */}
            {hodOption && (
              <button
                key={hodOption.id}
                type="button"
                onClick={() => handleSelect(hodOption.id)}
                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  value === hodOption.id
                    ? "bg-primary text-primary-foreground font-extrabold"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="truncate">{hodOption.label}</span>
                {value === hodOption.id && <Check className="size-3.5 shrink-0" />}
              </button>
            )}

            {/* Render Faculty second */}
            {facultyOption && (
              <button
                key={facultyOption.id}
                type="button"
                onClick={() => handleSelect(facultyOption.id)}
                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  value === facultyOption.id
                    ? "bg-primary text-primary-foreground font-extrabold"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="truncate">{facultyOption.label}</span>
                {value === facultyOption.id && <Check className="size-3.5 shrink-0" />}
              </button>
            )}

            {/* Deans expandable parent (rendered if coreRole is staff) */}
            {coreRole === "staff" && (
              <div className="pt-1 mt-1 border-t border-border/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeansExpanded((prev) => !prev);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span>Deans</span>
                    {isDeanSelected && (
                      <Badge className="bg-primary/10 text-primary font-mono text-[0.60rem] px-1.5 py-0">
                        Selected
                      </Badge>
                    )}
                  </div>
                  {deansExpanded ? (
                    <ChevronDown className="size-4 text-primary shrink-0" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {deansExpanded && (
                  <div className="pl-3 py-1 space-y-0.5 border-l-2 border-primary/30 ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                    {DEAN_SUB_OPTIONS.map((dean) => (
                      <button
                        key={dean.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(dean.id);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
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
            )}

            {/* Remaining options */}
            {remainingOptions.map((opt) => (
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
