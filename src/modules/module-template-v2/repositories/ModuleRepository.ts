import type { ModuleRecord, StandardQueryParams, PaginatedResult } from "../types";

export interface IModuleRepository {
  getAll(): Promise<ModuleRecord[]>;
  getById(id: string): Promise<ModuleRecord | null>;
  create(data: Partial<ModuleRecord>): Promise<ModuleRecord>;
  update(id: string, updates: Partial<ModuleRecord>): Promise<ModuleRecord>;
  delete(id: string): Promise<boolean>;
  search(params: StandardQueryParams): Promise<PaginatedResult<ModuleRecord>>;
  bulkAction(ids: string[], action: string, payload?: any): Promise<boolean>;
}
