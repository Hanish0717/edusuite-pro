import React from "react";
import { Link } from "@tanstack/react-router";
import { 
  Building2, 
  Bus, 
  BookOpen, 
  CreditCard, 
  Briefcase, 
  GraduationCap, 
  ExternalLink 
} from "lucide-react";
import type { StudentRecord } from "../../types";

interface StudentConnectionsProps {
  student: StudentRecord;
}

export function StudentConnections({ student }: StudentConnectionsProps) {
  const connections = [
    {
      name: "Hostel Management",
      desc: student.hostelResident ? `Assigned Room: ${student.hostelRoom}` : "Non-Resident Student",
      status: student.hostelResident ? "Active Room Allotment" : "No Room Allotted",
      active: student.hostelResident,
      icon: Building2,
      url: "/hostel/dashboard",
    },
    {
      name: "Transport & Fleet",
      desc: student.transportUser ? `Route: ${student.transportRoute}` : "No Route Mapping",
      status: student.transportUser ? "Active Fleet User" : "Private Transport",
      active: student.transportUser,
      icon: Bus,
      url: "/transport/dashboard",
    },
    {
      name: "Library Ledger",
      desc: "Books issued: 2 active",
      status: "Active Library Card",
      active: true,
      icon: BookOpen,
      url: "/library/dashboard",
    },
    {
      name: "Finance & Fees",
      desc: `Total Due: Rs ${(student.feeAmount - student.feePaid).toLocaleString()}`,
      status: student.feeStatus === "Paid" ? "All Fees Cleared" : "Outstanding Dues",
      active: student.feeStatus !== "Paid",
      icon: CreditCard,
      url: "/finance/dashboard",
    },
    {
      name: "Placements Cell",
      desc: student.placementEligible ? `Standing: ${student.placementStatus || "Eligible"}` : "Ineligible / Below GPA Guard",
      status: student.placementEligible ? "Active ATS Profile" : "Profiles Blocked",
      active: student.placementEligible,
      icon: Briefcase,
      url: "/placement/dashboard",
    },
    {
      name: "LMS Portal",
      desc: "LMS courses: 6 registered",
      status: "Active Portal Account",
      active: true,
      icon: GraduationCap,
      url: "/lms",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.name}
            to={c.url}
            className="group block p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/10 transition-all duration-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${c.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Icon className="size-4" />
              </div>
              <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                {c.name}
              </h4>
              <p className="text-[0.68rem] text-muted-foreground mt-0.5">{c.desc}</p>
            </div>

            <div className="flex items-center gap-1.5 pt-1.5 border-t border-border/40 mt-1">
              <span className={`text-[0.62rem] font-bold px-1.5 py-0.5 rounded ${c.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                {c.status}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
