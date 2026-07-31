import * as React from "react";
import { UploadCloud, File, Image, CheckCircle2, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface UploadProps {
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  onFilesSelect?: (files: File[]) => void;
  className?: string;
}

export function Upload({
  multiple = false,
  accept = "*",
  maxSizeMB = 10,
  onFilesSelect,
  className,
}: UploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = (newFile: UploadedFile) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress: 100, status: "completed" } : f)),
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress: current } : f)),
        );
      }
    }, 150);
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const fileList = Array.from(selectedFiles);

    const validFiles: File[] = [];
    const formattedFiles: UploadedFile[] = [];

    fileList.forEach((f) => {
      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        formattedFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: f.name,
          size: formatSize(f.size),
          type: f.type,
          progress: 0,
          status: "error",
        });
      } else {
        validFiles.push(f);
        const newUploaded: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: f.name,
          size: formatSize(f.size),
          type: f.type,
          progress: 0,
          status: "uploading",
        };
        formattedFiles.push(newUploaded);
        simulateUpload(newUploaded);
      }
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...formattedFiles]);
    } else {
      setFiles(formattedFiles);
    }

    if (onFilesSelect && validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragOver(true);
    } else if (e.type === "dragleave") {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 bg-card hover:bg-accent/10 hover:border-primary/50",
          isDragOver && "border-primary bg-primary/5 scale-[1.01] shadow-glow",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              <span className="text-primary hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports documents, images (up to {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2 border border-border rounded-2xl p-3 bg-muted/20 max-h-60 overflow-y-auto">
          {files.map((file) => {
            const isImage = file.type.startsWith("image/");
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
              >
                <div className="grid size-9 place-items-center rounded-lg bg-background border text-muted-foreground shrink-0">
                  {isImage ? <Image className="size-4.5" /> : <File className="size-4.5" />}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <p className="font-semibold truncate max-w-[200px]" title={file.name}>
                      {file.name}
                    </p>
                    <span className="text-muted-foreground shrink-0">{file.size}</span>
                  </div>

                  {file.status === "uploading" && (
                    <div className="flex items-center gap-2">
                      <Progress value={file.progress} className="h-1.5 flex-1" />
                      <span className="text-[0.65rem] font-medium text-primary shrink-0 w-8 text-right">
                        {file.progress}%
                      </span>
                    </div>
                  )}

                  {file.status === "completed" && (
                    <div className="flex items-center gap-1 text-[0.65rem] font-semibold text-emerald-600 dark:text-emerald-550">
                      <CheckCircle2 className="size-3.5" />
                      <span>Upload completed</span>
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="flex items-center gap-1 text-[0.65rem] font-semibold text-destructive">
                      <AlertTriangle className="size-3.5" />
                      <span>File size exceeds limit ({maxSizeMB}MB)</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(file.id)}
                  className="size-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 grid place-items-center"
                >
                  <X className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
