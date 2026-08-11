import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Eye, CheckCircle2, History, Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface DocumentsTabProps {
  student: StudentProfileData;
  onPreviewDocument: (doc: any) => void;
}

export function DocumentsTab({ student, onPreviewDocument }: DocumentsTabProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", "Identity", "Academic", "Transfer", "Financial", "Institutional", "Photo"];

  const filteredDocs = student.documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    toast.info("Select PDF or Image file to upload new document to student repository...");
  };

  return (
    <div className="space-y-6">
      
      {/* TOOLBAR */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Digital Document Repository
            </h3>
            <p className="text-xs text-slate-500">Verified academic certificates, identity cards, & transfer records</p>
          </div>

          <Button onClick={handleUpload} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm shadow-blue-500/20">
            <Upload className="h-3.5 w-3.5" /> Upload Document
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search documents by name or filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-100 dark:border-blue-900/40">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.fileName}</span>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px] border-emerald-500/20">
                {doc.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Size: <strong>{doc.fileSize}</strong></span>
              <span>Date: <strong>{doc.uploadDate}</strong></span>
              <span className="font-mono text-blue-600 font-bold">{doc.version}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                onClick={() => onPreviewDocument(doc)}
                size="sm"
                variant="outline"
                className="rounded-xl text-xs h-8 gap-1 border-slate-200 dark:border-slate-700"
              >
                <Eye className="h-3.5 w-3.5 text-blue-600" /> Preview
              </Button>
              <Button
                onClick={() => alert(`Downloading ${doc.fileName}...`)}
                size="sm"
                variant="outline"
                className="rounded-xl text-xs h-8 gap-1 border-slate-200 dark:border-slate-700"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
