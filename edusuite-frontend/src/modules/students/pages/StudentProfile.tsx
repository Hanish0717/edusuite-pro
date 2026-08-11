import React, { useState, useEffect } from "react";
import { 
  User, 
  GraduationCap, 
  Clock, 
  CreditCard, 
  BookOpen, 
  Building2, 
  Bus, 
  Briefcase, 
  Brain, 
  FileText, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  Bell,
  Activity
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTimeline } from "../components/timeline/StudentTimeline";
import { StudentDocuments } from "../components/documents/StudentDocuments";
import { StudentConnections } from "../components/connections/StudentConnections";
import { StudentService } from "../services/StudentService";
import type { StudentRecord, StudentDocument, StudentTimelineEvent } from "../types";
import { useStudentPermissions } from "../hooks/useStudentPermissions";
import { toast } from "sonner";

interface StudentProfileProps {
  studentId: string;
}

export function StudentProfile({ studentId }: StudentProfileProps) {
  const { can } = useStudentPermissions();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [timeline, setTimeline] = useState<StudentTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await StudentService.getById(studentId);
      if (data) {
        setStudent(data);
        const docs = await StudentService.getDocuments(data.id);
        const tl = await StudentService.getTimeline(data.id);
        setDocuments(docs);
        setTimeline(tl);
      } else {
        toast.error("Student profile not found in master database");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [studentId]);

  const handleVerifyDoc = async (docId: string, status: "Verified" | "Rejected") => {
    if (student) {
      const success = await StudentService.verifyDocument(student.id, docId, status);
      if (success) {
        toast.success(`Document marked as ${status}`);
        const docs = await StudentService.getDocuments(student.id);
        const tl = await StudentService.getTimeline(student.id);
        setDocuments(docs);
        setTimeline(tl);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
        <div className="size-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        Retrieving student dossier record...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-3">
        <ShieldAlert className="size-10 text-destructive mx-auto" />
        <h4 className="font-bold text-sm">Dossier Missing</h4>
        <p className="text-xs text-muted-foreground">The student ID does not match any register entry.</p>
        <Button asChild size="sm">
          <Link to="/students">Back to Registry</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back to Registry Button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Link to="/students">
            <ArrowLeft className="size-3.5" /> Back to Registry
          </Link>
        </Button>
      </div>

      {/* Dossier Header Info */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-brand-gradient text-white flex items-center justify-center font-bold text-lg shadow-md">
            {student.fullName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{student.fullName}</h2>
              <Badge variant="secondary" className="font-mono text-xs">{student.rollNo}</Badge>
              <Badge 
                className={
                  student.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[0.68rem]"
                }
              >
                {student.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {student.department} Department • {student.academicYear} (Semester {student.semester}) • Section {student.section}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs py-1 px-2.5 bg-primary/5 text-primary border-primary/20">
            CGPA: {student.cgpa}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs py-1 px-2.5 bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
            Attendance: {student.attendancePct}%
          </Badge>
        </div>
      </div>

      {/* Main Tabbed Layout */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto p-1 bg-muted/40 rounded-xl border border-border/60 justify-start gap-1">
          <TabsTrigger value="profile" className="text-xs gap-1.5 px-3 py-1.5"><User className="size-3.5" /> Profile</TabsTrigger>
          <TabsTrigger value="academics" className="text-xs gap-1.5 px-3 py-1.5"><GraduationCap className="size-3.5" /> Academics</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs gap-1.5 px-3 py-1.5"><Activity className="size-3.5" /> Attendance</TabsTrigger>
          <TabsTrigger value="examinations" className="text-xs gap-1.5 px-3 py-1.5"><CheckCircle2 className="size-3.5" /> Exams</TabsTrigger>
          <TabsTrigger value="fees" className="text-xs gap-1.5 px-3 py-1.5"><CreditCard className="size-3.5" /> Fees</TabsTrigger>
          {can("VIEW_CONNECTIONS") && (
            <TabsTrigger value="connections" className="text-xs gap-1.5 px-3 py-1.5"><Building2 className="size-3.5" /> Connections</TabsTrigger>
          )}
          {can("VIEW_DOCUMENTS") && (
            <TabsTrigger value="documents" className="text-xs gap-1.5 px-3 py-1.5"><FileText className="size-3.5" /> Documents</TabsTrigger>
          )}
          {can("VIEW_TIMELINE") && (
            <TabsTrigger value="timeline" className="text-xs gap-1.5 px-3 py-1.5"><Clock className="size-3.5" /> Timeline</TabsTrigger>
          )}
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Contact & Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-0.5">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Email Address</span>
                <p className="text-xs text-foreground font-mono font-medium">{student.email}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-0.5">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Phone Number</span>
                <p className="text-xs text-foreground font-mono font-medium">{student.phone}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-0.5">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Gender</span>
                <p className="text-xs text-foreground font-medium">{student.gender}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-0.5">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Guardian Name</span>
                <p className="text-xs text-foreground font-medium">{student.guardianName}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-0.5">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Guardian Contact Phone</span>
                <p className="text-xs text-foreground font-mono font-medium">{student.guardianPhone}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-0.5">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Registration Date</span>
                <p className="text-xs text-foreground font-mono font-medium">{student.enrollmentDate}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Academics */}
        <TabsContent value="academics">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Academic Records & Regulations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <h4 className="font-bold text-xs">Curriculum Mapping</h4>
                <p className="text-xs text-muted-foreground">Regulation Standard: **R-2023**</p>
                <p className="text-xs text-muted-foreground">Associated Batch Program: **{student.batchCode} B.Tech**</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-1">
                <h4 className="font-bold text-xs">GPA Track standing</h4>
                <p className="text-xs text-muted-foreground">Cumulative Grade Point Average (CGPA): **{student.cgpa} / 10.0**</p>
                <p className="text-xs text-muted-foreground">Honor roll eligibility: **{student.cgpa >= 8.5 ? "Eligible" : "Ineligible"}**</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Attendance */}
        <TabsContent value="attendance">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Attendance Audit Register</h3>
            <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Semester {student.semester} Overall Presence</span>
                <Badge className={student.attendancePct < 75 ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"}>
                  {student.attendancePct}% Present
                </Badge>
              </div>
              <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${student.attendancePct < 75 ? "bg-amber-500" : "bg-emerald-500"}`} 
                  style={{ width: `${student.attendancePct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                * Note: Regulations mandate a minimum of 75% attendance to qualify for semester examinations.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Examinations */}
        <TabsContent value="examinations">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Controller of Examinations Status</h3>
            <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-2">
              <h4 className="font-bold text-xs">Hall Ticket Status</h4>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Hall ticket generated for Semester {student.semester} End Examinations.</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Fees */}
        <TabsContent value="fees">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Tuition Fees Ledgers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Total Fee Amount</span>
                <p className="text-base font-bold font-mono text-foreground">Rs {student.feeAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Total Fees Paid</span>
                <p className="text-base font-bold font-mono text-emerald-600">Rs {student.feePaid.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <span className="text-[0.62rem] text-muted-foreground uppercase font-bold tracking-wider">Outstanding Balance</span>
                <p className="text-base font-bold font-mono text-amber-600">
                  Rs {(student.feeAmount - student.feePaid).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 6: Connections */}
        <TabsContent value="connections">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
              <h3 className="font-bold text-sm text-foreground">Connected Institutional Workspaces</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any workspace card to view the respective department control board.
              </p>
            </div>
            <StudentConnections student={student} />
          </div>
        </TabsContent>

        {/* Tab 7: Documents */}
        <TabsContent value="documents">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Verification Vault Documents</h3>
            <StudentDocuments documents={documents} onVerify={handleVerifyDoc} />
          </div>
        </TabsContent>

        {/* Tab 8: Timeline */}
        <TabsContent value="timeline">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Chronological Audit Milestones</h3>
            <StudentTimeline events={timeline} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const pageMeta = {
  title: "Student Profile",
  breadcrumb: ["Students", "Profile"],
};
