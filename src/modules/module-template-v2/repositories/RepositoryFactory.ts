import { MockModuleRepository } from "./MockModuleRepository";
import { SupabaseModuleRepository } from "./SupabaseModuleRepository";
import type { IModuleRepository } from "./ModuleRepository";

export type RepositoryProviderType = "mock" | "supabase";

const PROVIDERS: Record<RepositoryProviderType, new () => IModuleRepository> = {
  mock: MockModuleRepository,
  supabase: SupabaseModuleRepository,
};

class ModuleRepositoryFactory {
  private activeRepo: IModuleRepository | null = null;

  getRepository(): IModuleRepository {
    if (this.activeRepo) return this.activeRepo;

    let provider: RepositoryProviderType = "mock";
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("EDUSUITE_MODULE_PROVIDER");
      if (stored === "supabase" || stored === "mock") {
        provider = stored as RepositoryProviderType;
      }
    }

    const RepoClass = PROVIDERS[provider] || MockModuleRepository;
    this.activeRepo = new RepoClass();
    return this.activeRepo;
  }
}

export const repositoryFactory = new ModuleRepositoryFactory();
export const moduleRepository = repositoryFactory.getRepository();
