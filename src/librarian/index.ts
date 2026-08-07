// =============================================================================
// LIBRARIAN ERP MODULE — MASTER BARREL EXPORT
// Single centralized access point for all Librarian components, store, context, & types.
// =============================================================================

export * from "./types";
export * from "./services";
export * from "./store";
export * from "./context";

// Views & Dashboards
export { LibrarianDashboard } from "./components/dashboard";
export { LibraryModuleView } from "./components/basic-views";
export {
  CatalogManagementView,
  AcquisitionModuleView,
  InventoryModuleView,
  ReadingHallView,
  LibraryEntryView,
  ReservationManagementView,
  GlobalLibrarySearchView,
  AuditLogsView,
  CirculationEnhancementsView,
  EnhancedFineManagementView,
  EnhancedReportsView,
  EnhancedNotificationsView,
  EnhancedSettingsView,
  EnhancedIDCardManagementView,
} from "./components/enterprise-views";
