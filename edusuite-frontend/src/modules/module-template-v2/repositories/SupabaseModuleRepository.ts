import type { IModuleRepository } from "./ModuleRepository";
import type { ModuleRecord, StandardQueryParams, PaginatedResult } from "../types";

export class SupabaseModuleRepository implements IModuleRepository {
  async getAll(): Promise<ModuleRecord[]> {
    console.warn("SupabaseModuleRepository: getAll not implemented");
    return [];
  }

  async getById(id: string): Promise<ModuleRecord | null> {
    console.warn("SupabaseModuleRepository: getById not implemented");
    return null;
  }

  async create(data: Partial<ModuleRecord>): Promise<ModuleRecord> {
    console.warn("SupabaseModuleRepository: create not implemented");
    return {} as ModuleRecord;
  }

  async update(id: string, updates: Partial<ModuleRecord>): Promise<ModuleRecord> {
    console.warn("SupabaseModuleRepository: update not implemented");
    return {} as ModuleRecord;
  }

  async delete(id: string): Promise<boolean> {
    console.warn("SupabaseModuleRepository: delete not implemented");
    return false;
  }

  async search(params: StandardQueryParams): Promise<PaginatedResult<ModuleRecord>> {
    console.warn("SupabaseModuleRepository: search not implemented");
    return { data: [], total: 0, page: 1, limit: 10 };
  }

  async bulkAction(ids: string[], action: string, payload?: any): Promise<boolean> {
    console.warn("SupabaseModuleRepository: bulkAction not implemented");
    return false;
  }
}
