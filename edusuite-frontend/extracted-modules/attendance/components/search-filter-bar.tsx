import { Search, RefreshCw, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSubject: string;
  onSubjectChange: (val: string) => void;
  selectedSection: string;
  onSectionChange: (val: string) => void;
  uniqueSubjects: string[];
  uniqueSections: string[];
  onRefresh: () => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedSection,
  onSectionChange,
  uniqueSubjects,
  uniqueSections,
  onRefresh,
}: SearchFilterBarProps) {
  const handleExport = () => {
    toast.success("Exporting register data...", {
      description: "Excel workbook download started.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-muted/40 p-4 rounded-2xl border text-xs">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search student by name or roll number..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background rounded-xl h-10 text-xs"
        />
      </div>

      {/* Select Filters and Action buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-[130px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Subjects</SelectItem>
            {uniqueSubjects.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSection} onValueChange={onSectionChange}>
          <SelectTrigger className="w-full sm:w-[110px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Sections</SelectItem>
            {uniqueSections.map((sec) => (
              <SelectItem key={sec} value={sec}>
                {sec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={onRefresh}
          variant="outline"
          className="rounded-xl cursor-pointer hover:bg-muted text-xs h-10 w-[42px] px-0 flex justify-center items-center"
        >
          <RefreshCw className="size-4 text-muted-foreground" />
        </Button>
        
        <Button
          onClick={handleExport}
          className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-10 px-3.5 flex items-center gap-1.5 font-bold"
        >
          <FileSpreadsheet className="size-4" /> Export Excel
        </Button>
      </div>
    </div>
  );
}
