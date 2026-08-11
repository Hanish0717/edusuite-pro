import type { IModuleRepository } from "./ModuleRepository";
import type { ModuleRecord, StandardQueryParams, PaginatedResult } from "../types";

export class MockModuleRepository implements IModuleRepository {
  private records: ModuleRecord[] = [
    { id: "REC-1", code: "MOD-A", name: "Sample Record A", status: "Active", createdAt: "2026-08-01" },
    { id: "REC-2", code: "MOD-B", name: "Sample Record B", status: "Active", createdAt: "2026-08-02" },
  ];

  async getAll(): Promise<ModuleRecord[]> {
    return this.records;
  }

  async getById(id: string): Promise<ModuleRecord | null> {
    return this.records.find((r) => r.id === id || r.code === id) || null;
  }

  async create(data: Partial<ModuleRecord>): Promise<ModuleRecord> {
    const newRecord: ModuleRecord = {
      id: `REC-${Math.floor(100 + Math.random() * 900)}`,
      code: data.code || `CODE-${Math.floor(10 + Math.random() * 90)}`,
      name: data.name || "Unnamed Record",
      status: data.status || "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.records.push(newRecord);
    return newRecord;
  }

  async update(id: string, updates: Partial<ModuleRecord>): Promise<ModuleRecord> {
    const idx = this.records.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Record not found");
    const updated = { ...this.records[idx], ...updates } as ModuleRecord;
    this.records[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const len = this.records.length;
    this.records = this.records.filter((r) => r.id !== id);
    return this.records.length < len;
  }

  async search(params: StandardQueryParams): Promise<PaginatedResult<ModuleRecord>> {
    let result = [...this.records];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
    }
    const total = result.length;
    const page = params.pagination?.page || 1;
    const limit = params.pagination?.limit || 10;
    const paginated = result.slice((page - 1) * limit, page * limit);
    return { data: paginated, total, page, limit };
  }

  async bulkAction(ids: string[], action: string, payload?: any): Promise<boolean> {
    if (action === "delete") {
      this.records = this.records.filter((r) => !ids.includes(r.id));
      return true;
    }
    return false;
  }
}
