import React, { useState, useEffect } from "react";
import { Upload, Paperclip, FileText, CheckCircle2, Save, X, Eye, Lock, Clock, Shield, User, Building, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { MockFacultyUser } from "@/services/course-materials-service";


interface UploadMaterialFormProps {
  uniqueSubjects: string[];
  uniqueSections: string[];
  facultyUser?: MockFacultyUser;
  onUploadMaterial: (mat: any) => void;
  onCancel?: () => void;
}

export function UploadMaterialForm({
  uniqueSubjects,
  uniqueSections,
  facultyUser,
  onUploadMaterial,
  onCancel,
}: UploadMaterialFormProps) {
  // Restrict Subject selection to assigned subjects ONLY
  const availableSubjects = facultyUser?.assignedSubjects && facultyUser.assignedSubjects.length > 0
    ? facultyUser.assignedSubjects
    : uniqueSubjects;

  const availableSections = facultyUser?.assignedSections && facultyUser.assignedSections.length > 0
    ? facultyUser.assignedSections
    : uniqueSections;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(availableSubjects[0] || "Operating Systems");
  const [unit, setUnit] = useState("Unit 1");
  const [topic, setTopic] = useState("");
  const [semester, setSemester] = useState(facultyUser?.assignedSemesters[0] || "5");
  const [section, setSection] = useState(availableSections[0] || "CSE-A");
  const [academicYear, setAcademicYear] = useState(facultyUser?.academicYear || "2026-27");
  const [description, setDescription] = useState("");
  const [materialType, setMaterialType] = useState<string>("Lecture Notes");
  const [visibility, setVisibility] = useState<"Visible" | "Scheduled" | "Draft" | "Faculty Only">("Visible");
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowPreview, setAllowPreview] = useState(true);
  const [attachmentName, setAttachmentName] = useState("");

  // Sync state if facultyUser changes
  useEffect(() => {
    if (availableSubjects.length > 0) {
      setSubject(availableSubjects[0]);
    }
  }, [facultyUser?.department]);

  const handleSimulateFileSelect = () => {
    const sampleFiles = ["unit_notes_v1.pdf (3.4 MB)", "lecture_slides.pptx (5.2 MB)", "lab_manual_ex1.pdf (2.1 MB)"];
    const chosen = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setAttachmentName(chosen);
    toast.success("File attached successfully!", {
      description: `Attached: ${chosen}`,
    });
  };

  const handlePublishSubmit = (status: "Visible" | "Draft") => {
    if (!title || !subject) {
      toast.error("Please enter a title and select an assigned subject.");
      return;
    }

    const fileTypeMap: Record<string, "PDF" | "PPT" | "Video" | "DOC" | "ZIP"> = {
      "Lecture Notes": "PDF",
      PPT: "PPT",
      "Lab Manual": "PDF",
      Assignment: "DOC",
      "Question Bank": "PDF",
      "Reference Material": "PDF",
      "Previous Papers": "PDF",
      "Video Lecture": "Video",
    };

    onUploadMaterial({
      title,
      subject,
      code: subject.split(" ").map((w) => w[0]).join("").toUpperCase() + "301",
      section,
      semester,
      academicYear,
      unit,
      topic: topic || title,
      description: description || "Faculty course material.",
      fileType: fileTypeMap[materialType] || "PDF",
      fileSize: attachmentName.includes(" (") ? attachmentName.split(" (")[1]?.replace(")", "") || "2.4 MB" : "2.4 MB",
      visibility: status === "Draft" ? "Draft" : visibility,
      category: materialType,
      allowDownload,
      allowPreview,
    });

    toast.success(status === "Draft" ? "Material Saved as Draft!" : "Material Published & Synced to Student LMS!", {
      description: `${title} is now registered under ${subject}.`,
    });

    // Clear form
    setTitle("");
    setTopic("");
    setDescription("");
    setAttachmentName("");
  };

  return (
    <Card className="p-5 border-primary/30 rounded-2xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground">
            <Upload className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-foreground">Upload Course Material</h3>
            <p className="text-[0.68rem] text-muted-foreground">
              Add new lecture notes, slides, manuals, or question banks for your assigned department subjects
            </p>
          </div>
        </div>

        {/* Automatic Faculty Metadata Badge */}
        {facultyUser && (
          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/5 flex items-center gap-1.5 py-1">
            <User className="size-3 text-primary" /> {facultyUser.name} &middot; {facultyUser.department} Dept
          </Badge>
        )}
      </div>

      {/* Auto-associated Metadata Summary Banner */}
      {facultyUser && (
        <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex flex-wrap items-center justify-between gap-2 text-[0.68rem] font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><Building className="size-3 text-primary" /> Dept: <strong className="text-foreground font-sans">{facultyUser.department} ({facultyUser.program})</strong></span>
          <span className="flex items-center gap-1"><GraduationCap className="size-3 text-primary" /> Sem: <strong className="text-foreground font-sans">{semester}</strong> &middot; Sec: <strong className="text-foreground font-sans">{section}</strong></span>
          <span className="flex items-center gap-1"><Clock className="size-3 text-primary" /> AY: <strong className="text-foreground font-sans">{academicYear}</strong></span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Subject (Restricted ONLY to assigned subjects) */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Assigned Subject *</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-9 rounded-xl border-border/70 font-semibold">
              <SelectValue placeholder="Select Assigned Subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((sub) => (
                <SelectItem key={sub} value={sub} className="font-medium">
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Unit */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Unit</label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="h-9 rounded-xl border-border/70">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unit 1">Unit 1</SelectItem>
              <SelectItem value="Unit 2">Unit 2</SelectItem>
              <SelectItem value="Unit 3">Unit 3</SelectItem>
              <SelectItem value="Unit 4">Unit 4</SelectItem>
              <SelectItem value="Unit 5">Unit 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Topic */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Topic</label>
          <Input
            placeholder="e.g. CPU Scheduling & Semaphores"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-9 rounded-xl border-border/70 text-xs"
          />
        </div>

        {/* Material Type */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Material Type</label>
          <Select value={materialType} onValueChange={setMaterialType}>
            <SelectTrigger className="h-9 rounded-xl border-border/70">
              <SelectValue placeholder="Select Material Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lecture Notes">Lecture Notes</SelectItem>
              <SelectItem value="PPT">PPT Presentation</SelectItem>
              <SelectItem value="Lab Manual">Lab Manual</SelectItem>
              <SelectItem value="Assignment">Assignment</SelectItem>
              <SelectItem value="Question Bank">Question Bank</SelectItem>
              <SelectItem value="Reference Material">Reference Material</SelectItem>
              <SelectItem value="Previous Papers">Previous Papers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Semester */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Semester</label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger className="h-9 rounded-xl border-border/70">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sem 1</SelectItem>
              <SelectItem value="3">Sem 3</SelectItem>
              <SelectItem value="5">Sem 5</SelectItem>
              <SelectItem value="7">Sem 7</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Section */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Section</label>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="h-9 rounded-xl border-border/70">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {uniqueSections.map((sec) => (
                <SelectItem key={sec} value={sec}>
                  {sec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Academic Year */}
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Academic Year</label>
          <Input
            placeholder="2026-27"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="h-9 rounded-xl border-border/70 text-xs"
          />
        </div>
      </div>

      {/* Material Title & Description */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Material Title *</label>
          <Input
            placeholder="e.g. Operating Systems CPU Scheduling & Semaphore Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 rounded-xl border-border/70 text-xs font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem]">Material Description</label>
          <Textarea
            placeholder="Provide a brief summary of the material contents, learning objectives, and instructions for students..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-xl border-border/70 text-xs resize-none"
          />
        </div>
      </div>

      {/* Drag & Drop File Upload Placeholder */}
      <div
        onClick={handleSimulateFileSelect}
        className="p-4 border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl bg-primary/5 text-center cursor-pointer transition-all space-y-1.5"
      >
        <Paperclip className="size-6 text-primary mx-auto" />
        <p className="font-bold text-xs text-foreground">
          {attachmentName ? `Attached: ${attachmentName}` : "Click or drag & drop files here to upload (PDF, PPT, DOC, Video)"}
        </p>
        <span className="text-[0.65rem] text-muted-foreground block font-mono">Maximum file size: 50 MB per file</span>
      </div>

      {/* Visibility & Permissions Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem] block">Student Visibility</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={visibility === "Visible" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisibility("Visible")}
              className="h-8 text-[0.68rem] font-semibold rounded-xl cursor-pointer"
            >
              <Eye className="size-3 mr-1" /> Immediately Visible
            </Button>
            <Button
              type="button"
              variant={visibility === "Scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisibility("Scheduled")}
              className="h-8 text-[0.68rem] font-semibold rounded-xl cursor-pointer"
            >
              <Clock className="size-3 mr-1" /> Schedule Release
            </Button>
            <Button
              type="button"
              variant={visibility === "Draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisibility("Draft")}
              className="h-8 text-[0.68rem] font-semibold rounded-xl cursor-pointer"
            >
              <Lock className="size-3 mr-1" /> Hidden Draft
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground uppercase text-[0.65rem] block">Student Action Permissions</label>
          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-foreground font-semibold text-xs">
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="rounded text-primary focus:ring-primary size-3.5"
              />
              <span>Allow Download</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-foreground font-semibold text-xs">
              <input
                type="checkbox"
                checked={allowPreview}
                onChange={(e) => setAllowPreview(e.target.checked)}
                className="rounded text-primary focus:ring-primary size-3.5"
              />
              <span>Allow Online Preview</span>
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-9 px-4 text-xs font-semibold cursor-pointer">
            <X className="size-3.5 mr-1" /> Cancel
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePublishSubmit("Draft")}
          className="h-9 px-4 text-xs font-semibold cursor-pointer border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
        >
          <Save className="size-3.5 mr-1" /> Save Draft
        </Button>
        <Button
          size="sm"
          onClick={() => handlePublishSubmit("Visible")}
          className="h-9 px-5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
        >
          <CheckCircle2 className="size-3.5 mr-1" /> Publish to Student LMS
        </Button>
      </div>
    </Card>
  );
}
