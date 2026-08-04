import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSubject: string;
  onSubjectChange: (val: string) => void;
  selectedSection: string;
  onSectionChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  uniqueSubjects: string[];
  uniqueSections: string[];
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedSection,
  onSectionChange,
  selectedStatus,
  onStatusChange,
  uniqueSubjects,
  uniqueSections,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-muted/40 p-4 rounded-2xl border text-xs">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search assignments by title or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background rounded-xl h-10 text-xs"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
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

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[110px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="Active">Active Only</SelectItem>
            <SelectItem value="Draft">Draft Only</SelectItem>
            <SelectItem value="Closed">Closed Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
