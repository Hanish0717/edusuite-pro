import { IAttendanceRepository, MockAttendanceRepository, SupabaseAttendanceRepository } from "./attendance.repository";
import { IRiskRepository, MockRiskRepository, SupabaseRiskRepository } from "./risk.repository";
import { IChatbotRepository, MockChatbotRepository, SupabaseChatbotRepository } from "./chatbot.repository";
import { INotificationsRepository, MockNotificationsRepository, SupabaseNotificationsRepository } from "./notifications.repository";
import { IReportsRepository, MockReportsRepository, SupabaseReportsRepository } from "./reports.repository";

export type ImplementationDriver = "mock" | "supabase";

const ACTIVE_DRIVER: ImplementationDriver = "mock";

export class RepositoryFactory {
  static getAttendance(): IAttendanceRepository {
    return ACTIVE_DRIVER === "mock"
      ? new MockAttendanceRepository()
      : new SupabaseAttendanceRepository();
  }

  static getRisk(): IRiskRepository {
    return ACTIVE_DRIVER === "mock"
      ? new MockRiskRepository()
      : new SupabaseRiskRepository();
  }

  static getChatbot(): IChatbotRepository {
    return ACTIVE_DRIVER === "mock"
      ? new MockChatbotRepository()
      : new SupabaseChatbotRepository();
  }

  static getNotifications(): INotificationsRepository {
    return ACTIVE_DRIVER === "mock"
      ? new MockNotificationsRepository()
      : new SupabaseNotificationsRepository();
  }

  static getReports(): IReportsRepository {
    return ACTIVE_DRIVER === "mock"
      ? new MockReportsRepository()
      : new SupabaseReportsRepository();
  }
}
export default RepositoryFactory;
