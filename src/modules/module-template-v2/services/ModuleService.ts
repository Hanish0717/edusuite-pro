import { moduleRepository } from "../repositories/RepositoryFactory";
import { ModuleEvents } from "../events/ModuleEvents";
import { ModuleValidator } from "../validators/ModuleValidator";
import type { ModuleRecord, StandardQueryParams, PaginatedResult } from "../types";

export const ModuleService = {
  async getAll(): Promise<ModuleRecord[]> {
    return await moduleRepository.getAll();
  },

  async getById(id: string): Promise<ModuleRecord | null> {
    return await moduleRepository.getById(id);
  },

  async create(data: Partial<ModuleRecord>): Promise<ModuleRecord> {
    const errors = ModuleValidator.validate(data);
    if (errors.length > 0) {
      throw new Error(errors.join(". "));
    }
    const record = await moduleRepository.create(data);
    ModuleEvents.publish(ModuleEvents.CREATED, { id: record.id, code: record.code });
    return record;
  },

  async update(id: string, updates: Partial<ModuleRecord>): Promise<ModuleRecord> {
    const errors = ModuleValidator.validate(updates);
    if (errors.length > 0) {
      throw new Error(errors.join(". "));
    }
    const record = await moduleRepository.update(id, updates);
    ModuleEvents.publish(ModuleEvents.UPDATED, { id, updates });
    return record;
  },

  async delete(id: string): Promise<boolean> {
    const success = await moduleRepository.delete(id);
    if (success) {
      ModuleEvents.publish(ModuleEvents.DELETED, { id });
    }
    return success;
  },

  async search(params: StandardQueryParams): Promise<PaginatedResult<ModuleRecord>> {
    return await moduleRepository.search(params);
  }
};
