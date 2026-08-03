import { Briefcase, Building2, UserCog, Calendar, Clock, Award, ShieldAlert } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { ProfessionalInfo } from "@/data/faculty-mock-data";

interface ProfessionalInfoCardProps {
  professionalInfo: ProfessionalInfo;
}

export function ProfessionalInfoCard({ professionalInfo }: ProfessionalInfoCardProps) {
  const fields = [
    { label: "Employee ID", value: professionalInfo.employeeId, icon: Briefcase },
    { label: "Department", value: professionalInfo.department, icon: Building2 },
    { label: "Designation", value: professionalInfo.designation, icon: UserCog },
    { label: "Employment Type", value: professionalInfo.employmentType, icon: Briefcase },
    { label: "Joining Date", value: professionalInfo.joiningDate, icon: Calendar },
    { label: "Reporting HOD", value: professionalInfo.reportingHod, icon: ShieldAlert },
    { label: "Teaching Experience", value: `${professionalInfo.experienceYears} Years`, icon: Clock },
    { label: "Highest Qualification", value: professionalInfo.qualification, icon: Award },
  ];

  return (
    <Panel
      title="Professional Credentials"
      description="Official institutional roles and reporting lines"
      className="h-full border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2 text-xs">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <field.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.6rem]">{field.label}</p>
              <p className="mt-0.5 font-bold leading-normal text-foreground break-words">{field.value}</p>
            </div>
          </div>
        ))}
        
        {/* Full span specialization */}
        <div className="sm:col-span-2 flex items-start gap-3 p-3 rounded-xl bg-muted/30">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Award className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.6rem]">Specializations & Research Expertise</p>
            <p className="mt-0.5 font-bold leading-normal text-foreground">{professionalInfo.specialization}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
