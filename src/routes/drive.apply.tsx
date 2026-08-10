import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  User,
  Phone,
  GraduationCap,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  School,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SHARED_DRIVE_APPLICATION_FORMS,
  saveStudentDriveApplication,
} from "@/lib/shared-assessment-store";

export const Route = createFileRoute("/drive/apply")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search["id"] as string) || "APP-FORM-2026-GGL",
  }),
  head: () => ({
    meta: [
      { title: "Placement Drive Student Application Form — EduSuite Pro" },
      { name: "description", content: "Official student placement drive application registration form." },
    ],
  }),
  component: StudentDriveApplyPage,
});

function StudentDriveApplyPage() {
  const search = Route.useSearch();
  const formId = search.id;

  const targetForm =
    SHARED_DRIVE_APPLICATION_FORMS.find((f) => f.id === formId) ||
    SHARED_DRIVE_APPLICATION_FORMS[0]!;

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("CSE");

  // 10th standard details
  const [tenthSchoolName, setTenthSchoolName] = useState("");
  const [tenthBoard, setTenthBoard] = useState("CBSE");
  const [tenthPercentage, setTenthPercentage] = useState("");
  const [tenthYearOfPassing, setTenthYearOfPassing] = useState("2020");

  // Stream toggle: Intermediate vs Diploma
  const [qualificationStream, setQualificationStream] = useState<"Intermediate" | "Diploma">("Intermediate");

  // Intermediate details
  const [interCollegeName, setInterCollegeName] = useState("");
  const [interBoard, setInterBoard] = useState("State Board (TS BIE)");
  const [interPercentage, setInterPercentage] = useState("");
  const [interYearOfPassing, setInterYearOfPassing] = useState("2022");

  // Diploma details
  const [diplomaCollegeName, setDiplomaCollegeName] = useState("");
  const [diplomaBranch, setDiplomaBranch] = useState("ECE");
  const [diplomaPercentage, setDiplomaPercentage] = useState("");
  const [diplomaYearOfPassing, setDiplomaYearOfPassing] = useState("2023");

  // Upload metadata
  const [resumeFileName, setResumeFileName] = useState("");
  const [passportPhotoName, setPassportPhotoName] = useState("");
  const [passportPhotoPreview, setPassportPhotoPreview] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appRefNo, setAppRefNo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentEmail.includes("@")) {
      toast.error("Please enter a valid official college email ID.");
      return;
    }

    if (!resumeFileName) {
      toast.error("Please upload your PDF resume.");
      return;
    }

    const newId = `APP-REF-${Date.now().toString().slice(-6)}`;
    setAppRefNo(newId);

    saveStudentDriveApplication({
      id: newId,
      formId: targetForm.id,
      driveTitle: targetForm.title,
      companyName: targetForm.company,
      studentName,
      studentEmail,
      phone,
      rollNo,
      department,
      tenthSchoolName,
      tenthBoard,
      tenthPercentage: parseFloat(tenthPercentage) || 90.0,
      tenthYearOfPassing,
      qualificationStream,
      interCollegeName: qualificationStream === "Intermediate" ? interCollegeName : undefined,
      interBoard: qualificationStream === "Intermediate" ? interBoard : undefined,
      interPercentage: qualificationStream === "Intermediate" ? parseFloat(interPercentage) || 90.0 : undefined,
      interYearOfPassing: qualificationStream === "Intermediate" ? interYearOfPassing : undefined,
      diplomaCollegeName: qualificationStream === "Diploma" ? diplomaCollegeName : undefined,
      diplomaBranch: qualificationStream === "Diploma" ? diplomaBranch : undefined,
      diplomaPercentage: qualificationStream === "Diploma" ? parseFloat(diplomaPercentage) || 90.0 : undefined,
      diplomaYearOfPassing: qualificationStream === "Diploma" ? diplomaYearOfPassing : undefined,
      resumeFileName,
      passportPhotoUrl: passportPhotoPreview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      submittedAt: new Date().toLocaleString(),
    });

    setIsSubmitted(true);
    toast.success("Application Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl space-y-6">

        {/* GOOGLE FORM STYLE HEADER BANNER */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-xl border-t-8 border-blue-600">
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-600 text-white font-mono text-xs px-3 py-1">
              OFFICIAL PLACEMENT REGISTRATION FORM
            </Badge>
            <span className="text-xs font-mono text-slate-400">Drive ID: {targetForm.driveId}</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{targetForm.title}</h1>
            <p className="text-sm text-slate-300 font-medium mt-1">
              {targetForm.company} • {targetForm.role} • <strong className="text-emerald-400">{targetForm.ctc}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono space-y-2">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="size-4 text-amber-400" /> Mandatory Registration Instructions:
            </p>
            <p>{targetForm.instructions}</p>
            <p className="text-emerald-400 font-bold">
              ⏳ Application Deadline: {targetForm.deadlineDate}
            </p>
          </div>
        </div>

        {/* SUBMITTED SUCCESS SCREEN */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in">
            <div className="size-20 rounded-full bg-emerald-50 border-4 border-emerald-200 grid place-items-center mx-auto text-emerald-600">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-600 text-white font-mono">APPLICATION VERIFIED & RECORDED</Badge>
              <h2 className="text-2xl font-extrabold text-slate-900">Application Submitted Successfully!</h2>
              <p className="text-xs text-slate-500 font-mono">
                Candidate: <strong>{studentName}</strong> ({rollNo}) • {studentEmail}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-2 text-left">
              <p className="font-bold text-slate-900">📋 Application Reference Details:</p>
              <p>• Application Ref ID: <strong className="text-blue-600">{appRefNo}</strong></p>
              <p>• Stream Chosen: <strong>{qualificationStream}</strong></p>
              <p>• 10th Percentage: <strong>{tenthPercentage}%</strong> ({tenthSchoolName})</p>
              <p>• Resume Uploaded: <strong>{resumeFileName}</strong></p>
              <p>• Verification Status: <strong className="text-emerald-600">Approved for Assessment Eligibility</strong></p>
            </div>

            <p className="text-xs text-slate-500">
              The Recruiter &amp; TPO will verify your details. If eligible, your Assessment link will be dispatched to <strong>{studentEmail}</strong>.
            </p>

            <Button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl h-11 text-xs px-6 cursor-pointer"
            >
              Fill Another Application
            </Button>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-8">

            {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <User className="size-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">1. Student Identity &amp; Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Full Name (As per College Records) *</label>
                  <Input
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. K. Sai Teja"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Official College Email ID *</label>
                  <Input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="e.g. 23341a4229@college.edu.in"
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                  <span className="text-[0.68rem] text-amber-600 font-mono">
                    ⚠️ Must be the email address where you received this drive invitation link.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Phone Number *</label>
                  <Input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">College Roll Number / Hall Ticket *</label>
                  <Input
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 23341A4229"
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Department / Branch *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 border rounded-xl text-xs bg-background"
                  >
                    <option value="CSE">CSE (Computer Science &amp; Engineering)</option>
                    <option value="CSM">CSM (AI &amp; Machine Learning)</option>
                    <option value="CSD">CSD (Data Science)</option>
                    <option value="ECE">ECE (Electronics &amp; Comm Engg)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="EEE">EEE (Electrical &amp; Electronics)</option>
                    <option value="MECH">MECH (Mechanical Engineering)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: 10TH CLASS ACADEMIC DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <School className="size-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">2. 10th Standard (SSC / High School) Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-700">10th School Name *</label>
                  <Input
                    required
                    value={tenthSchoolName}
                    onChange={(e) => setTenthSchoolName(e.target.value)}
                    placeholder="e.g. St. Johns High School, Hyderabad"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">10th Board *</label>
                  <Input
                    required
                    value={tenthBoard}
                    onChange={(e) => setTenthBoard(e.target.value)}
                    placeholder="e.g. CBSE / State Board (SSC) / ICSE"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">10th Aggregate Percentage / CGPA *</label>
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={tenthPercentage}
                    onChange={(e) => setTenthPercentage(e.target.value)}
                    placeholder="e.g. 94.5"
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Year of Passing *</label>
                  <Input
                    required
                    value={tenthYearOfPassing}
                    onChange={(e) => setTenthYearOfPassing(e.target.value)}
                    placeholder="e.g. 2020"
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: INTERMEDIATE VS DIPLOMA TOGGLE & DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">3. Higher Secondary Qualification Stream</h2>
                </div>

                {/* STREAM TOGGLE SWITCH */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQualificationStream("Intermediate")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      qualificationStream === "Intermediate"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Intermediate (12th)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQualificationStream("Diploma")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      qualificationStream === "Diploma"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Diploma (Polytechnic)
                  </button>
                </div>
              </div>

              {qualificationStream === "Intermediate" ? (
                /* INTERMEDIATE FIELDS */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-700">Intermediate Junior College Name *</label>
                    <Input
                      required
                      value={interCollegeName}
                      onChange={(e) => setInterCollegeName(e.target.value)}
                      placeholder="e.g. Narayana Junior College, Madhapur"
                      className="h-10 text-xs rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Intermediate Board *</label>
                    <Input
                      required
                      value={interBoard}
                      onChange={(e) => setInterBoard(e.target.value)}
                      placeholder="e.g. TS BIE / CBSE / ISC"
                      className="h-10 text-xs rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Intermediate Aggregate Percentage *</label>
                    <Input
                      type="number"
                      step="0.1"
                      required
                      value={interPercentage}
                      onChange={(e) => setInterPercentage(e.target.value)}
                      placeholder="e.g. 96.2"
                      className="h-10 text-xs rounded-xl font-mono bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Year of Passing *</label>
                    <Input
                      required
                      value={interYearOfPassing}
                      onChange={(e) => setInterYearOfPassing(e.target.value)}
                      placeholder="e.g. 2022"
                      className="h-10 text-xs rounded-xl font-mono bg-white"
                    />
                  </div>
                </div>
              ) : (
                /* DIPLOMA FIELDS */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-700">Polytechnic College Name *</label>
                    <Input
                      required
                      value={diplomaCollegeName}
                      onChange={(e) => setDiplomaCollegeName(e.target.value)}
                      placeholder="e.g. Govt Polytechnic, Masab Tank, Hyderabad"
                      className="h-10 text-xs rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Diploma Branch / Stream *</label>
                    <Input
                      required
                      value={diplomaBranch}
                      onChange={(e) => setDiplomaBranch(e.target.value)}
                      placeholder="e.g. Computer Engg / ECE / Mechanical"
                      className="h-10 text-xs rounded-xl bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Diploma Percentage / CGPA *</label>
                    <Input
                      type="number"
                      step="0.1"
                      required
                      value={diplomaPercentage}
                      onChange={(e) => setDiplomaPercentage(e.target.value)}
                      placeholder="e.g. 89.5"
                      className="h-10 text-xs rounded-xl font-mono bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Year of Passing *</label>
                    <Input
                      required
                      value={diplomaYearOfPassing}
                      onChange={(e) => setDiplomaYearOfPassing(e.target.value)}
                      placeholder="e.g. 2023"
                      className="h-10 text-xs rounded-xl font-mono bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: DOCUMENT UPLOADS — RESUME & PASSPORT PHOTO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Upload className="size-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">4. Document Uploads (Resume &amp; Passport Photo)</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* RESUME UPLOAD */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="font-semibold text-slate-700 block">Upload PDF Resume *</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center space-y-2 hover:border-blue-400 transition-colors">
                    <FileText className="size-8 text-blue-600 mx-auto" />
                    <p className="text-[0.7rem] text-slate-500">PDF format required (Max 5MB)</p>
                    <Input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setResumeFileName(file.name);
                          toast.success(`Attached resume: ${file.name}`);
                        }
                      }}
                      className="text-xs h-9 cursor-pointer"
                    />
                  </div>
                  {resumeFileName && (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[0.7rem] font-mono flex items-center justify-between">
                      <span className="truncate">✓ {resumeFileName}</span>
                      <Badge className="bg-emerald-600 text-white text-[0.6rem]">Ready</Badge>
                    </div>
                  )}
                </div>

                {/* PASSPORT PHOTO UPLOAD */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <label className="font-semibold text-slate-700 block">Passport Size Photo *</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center space-y-2 hover:border-blue-400 transition-colors">
                    {passportPhotoPreview ? (
                      <img src={passportPhotoPreview} alt="Preview" className="size-16 rounded-full object-cover mx-auto border-2 border-blue-600 shadow-sm" />
                    ) : (
                      <User className="size-8 text-slate-400 mx-auto" />
                    )}
                    <p className="text-[0.7rem] text-slate-500">JPG or PNG (Recent photo)</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPassportPhotoName(file.name);
                          setPassportPhotoPreview(URL.createObjectURL(file));
                          toast.success(`Attached photo: ${file.name}`);
                        }
                      }}
                      className="text-xs h-9 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl h-12 gap-2 shadow-xl cursor-pointer"
            >
              <FileCheck2 className="size-5" /> Submit Placement Drive Application
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
