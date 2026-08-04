import { Mail, Phone, MapPin, Heart, ShieldAlert, User, Calendar, Award } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { PersonalInfo } from "@/data/faculty-mock-data";

interface PersonalInfoCardProps {
  personalInfo: PersonalInfo;
}

export function PersonalInfoCard({ personalInfo }: PersonalInfoCardProps) {
  const fields = [
    { label: "Full Name", value: personalInfo.fullName, icon: User },
    { label: "Gender", value: personalInfo.gender, icon: User },
    { label: "Date of Birth", value: personalInfo.dob, icon: Calendar },
    { label: "Blood Group", value: personalInfo.bloodGroup, icon: Heart },
    { label: "Nationality", value: personalInfo.nationality, icon: Award },
    { label: "Marital Status", value: personalInfo.maritalStatus, icon: Heart },
    { label: "Mobile Number", value: personalInfo.phone, icon: Phone },
    { label: "Email", value: personalInfo.email, icon: Mail },
    { label: "Emergency Contact", value: personalInfo.emergencyContact, icon: ShieldAlert },
  ];

  return (
    <Panel
      title="Personal Information"
      description="Private contact and biometric credentials"
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
        
        {/* Full span address */}
        <div className="sm:col-span-2 flex items-start gap-3 p-3 rounded-xl bg-muted/30">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.6rem]">Residential Address</p>
            <p className="mt-0.5 font-bold leading-normal text-foreground">{personalInfo.address}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
