// =============================================================================
// HOSTEL MODULE V2 REPOSITORY FACTORY
// =============================================================================

import { HostelRepository } from "./HostelRepository";
import { MockHostelRepository } from "./MockHostelRepository";
import { SupabaseHostelRepository } from "./SupabaseHostelRepository";

export class RepositoryFactory {
  private static instance: HostelRepository | null = null;

  static getRepository(useMock: boolean = true): HostelRepository {
    if (!this.instance) {
      this.instance = useMock ? new MockHostelRepository() : new SupabaseHostelRepository();
    }
    return this.instance;
  }

  static resetRepository(): void {
    this.instance = null;
  }
}
