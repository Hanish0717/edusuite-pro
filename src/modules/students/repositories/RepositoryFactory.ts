import { MockStudentRepository } from "./MockStudentRepository";
import { SupabaseStudentRepository } from "./SupabaseStudentRepository";
import type { IStudentRepository } from "./StudentRepository";

export type RepositoryProviderType = "mock" | "supabase";

const PROVIDERS: Record<RepositoryProviderType, new () => IStudentRepository> = {
  mock: MockStudentRepository,
  supabase: SupabaseStudentRepository,
};

class StudentRepositoryFactory {
  private activeRepo: IStudentRepository | null = null;

  getRepository(): IStudentRepository {
    if (this.activeRepo) return this.activeRepo;

    // Determine configured provider from settings or env
    let provider: RepositoryProviderType = "mock";

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("EDUSUITE_STUDENT_PROVIDER");
      if (stored === "supabase" || stored === "mock") {
        provider = stored as RepositoryProviderType;
      } else if (
        window.localStorage.getItem("EDUSUITE_USE_SUPABASE") === "true" ||
        (window as any).process?.env?.NEXT_PUBLIC_USE_SUPABASE === "true"
      ) {
        provider = "supabase";
      }
    }

    const RepoClass = PROVIDERS[provider] || MockStudentRepository;
    this.activeRepo = new RepoClass();
    
    console.log(`[RepositoryFactory] Instantiated StudentRepository provider: ${provider}`);
    return this.activeRepo;
  }
}

export const repositoryFactory = new StudentRepositoryFactory();
export const studentRepository = repositoryFactory.getRepository();
