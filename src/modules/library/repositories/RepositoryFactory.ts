// =============================================================================
// LIBRARY MODULE V2 REPOSITORY FACTORY
// =============================================================================

import { LibraryRepository } from "./LibraryRepository";
import { MockLibraryRepository } from "./MockLibraryRepository";
import { SupabaseLibraryRepository } from "./SupabaseLibraryRepository";

export class RepositoryFactory {
  private static instance: LibraryRepository | null = null;

  static getRepository(useMock: boolean = true): LibraryRepository {
    if (!this.instance) {
      this.instance = useMock ? new MockLibraryRepository() : new SupabaseLibraryRepository();
    }
    return this.instance;
  }

  static resetRepository(): void {
    this.instance = null;
  }
}
