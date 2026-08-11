import { Search, Filter, RefreshCw, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  onRefresh: () => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
}: SearchFilterBarProps) {
  const handleExport = () => {
    toast.success("Exporting subjects sheet...", {
      description: "Subject configuration mapping saved to Excel format.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-muted/40 p-4 rounded-2xl border text-xs">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects by name or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background rounded-xl h-10 text-xs"
        />
      </div>

      {/* Select Filters & Actions */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[130px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Course Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="Theory">Theory Only</SelectItem>
            <SelectItem value="Lab">Lab Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[130px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Active Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={onRefresh}
            variant="outline"
            className="size-10 rounded-xl cursor-pointer hover:bg-muted p-0 shrink-0"
          >
            <RefreshCw className="size-4 text-muted-foreground" />
          </Button>
          <Button
            onClick={handleExport}
            className="rounded-xl bg-brand-gradient shadow-glow h-10 px-4 text-xs font-semibold cursor-pointer flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
          >
            <FileSpreadsheet className="size-4" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
}
