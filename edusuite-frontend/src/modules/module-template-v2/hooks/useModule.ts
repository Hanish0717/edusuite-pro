import { useState, useEffect } from "react";
import { ModuleService } from "../services/ModuleService";
import type { ModuleRecord, ModuleFilters } from "../types";
import { toast } from "sonner";

export function useModule() {
  const [records, setRecords] = useState<ModuleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ModuleFilters>({ search: "", status: "" });

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await ModuleService.getAll();
      setRecords(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return {
    records,
    loading,
    filters,
    setFilters,
    refresh: loadRecords,
    createRecord: async (data: Partial<ModuleRecord>) => {
      try {
        await ModuleService.create(data);
        toast.success("Record created successfully");
        loadRecords();
      } catch (e: any) {
        toast.error(e.message || "Failed to create record");
      }
    },
    updateRecord: async (id: string, updates: Partial<ModuleRecord>) => {
      try {
        await ModuleService.update(id, updates);
        toast.success("Record updated successfully");
        loadRecords();
      } catch (e: any) {
        toast.error(e.message || "Failed to update record");
      }
    },
    deleteRecord: async (id: string) => {
      try {
        await ModuleService.delete(id);
        toast.success("Record deleted successfully");
        loadRecords();
      } catch (e: any) {
        toast.error(e.message || "Failed to delete record");
      }
    }
  };
}
