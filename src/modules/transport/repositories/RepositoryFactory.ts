// =============================================================================
// TRANSPORT MODULE V2 REPOSITORY FACTORY
// =============================================================================

import { TransportRepository } from "./TransportRepository";
import { MockTransportRepository } from "./MockTransportRepository";
import { SupabaseTransportRepository } from "./SupabaseTransportRepository";

export class RepositoryFactory {
  private static instance: TransportRepository | null = null;

  static getRepository(useMock: boolean = true): TransportRepository {
    if (!this.instance) {
      this.instance = useMock ? new MockTransportRepository() : new SupabaseTransportRepository();
    }
    return this.instance;
  }

  static resetRepository(): void {
    this.instance = null;
  }
}
