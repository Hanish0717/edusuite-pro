// =============================================================================
// HOSTEL MODULE V2 MAIN ENTRY POINT EXPORTS
// =============================================================================

export * from "./types";
export * from "./constants";
export * from "./validators/HostelValidator";
export * from "./events/HostelEvents";
export * from "./repositories/HostelRepository";
export * from "./repositories/RepositoryFactory";
export {
  fetchHostelRooms,
  fetchHostelResidents,
  fetchGatePasses,
  INITIAL_BLOCKS,
  INITIAL_ROOMS,
  ENHANCED_RESIDENTS,
  INITIAL_PASSES,
  INITIAL_GATE_PASS_DETAILS,
  INITIAL_COMPLAINT_DETAILS,
  DEFAULT_SECURITY_METRICS,
  DEFAULT_COMPLAINT_COMPLIANCE,
  DEFAULT_ANALYTICS,
  DEFAULT_HOSTEL_CONFIG,
  DEFAULT_HOSTEL_HEALTH,
  DEFAULT_MAINTENANCE_SUMMARY,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  DEFAULT_STAFF_SUMMARY,
  DEFAULT_POLICY_COMPLIANCE,
  type EnhancedResidentStudent,
  type GatePassDetailItem,
  type HostelComplaintDetailItem,
  type GatePassSecurityMetrics,
  type ComplaintComplianceSummary,
  type ExecutiveHostelAnalyticsData,
  type HostelConfig,
  type HostelHealthStatus,
  type MaintenanceSummary,
  type HostelAlert,
  type HostelActivityLog,
  type HostelStaffSummary,
  type PolicyComplianceStatus,
} from "./HostelService";
export * from "./hooks/useHostel";
export * from "./hooks/useHostelPermissions";

// Legacy component exports maintained for backwards compatibility
export * from "./HostelComponents";

export {
  HostelModuleView as HostelAttendanceView,
  HostelModuleView as HostelMessManagementView,
  HostelModuleView as HostelUserManagementView,
  HostelModuleView as HostelSettingsView,
  HostelModuleView as HostelGuestBillingView,
  HostelModuleView as HostelLeavesSuspensionView,
  HostelModuleView as HostelFeesView,
  HostelModuleView as HostelLogHistoryView,
  HostelModuleView as HostelMaintenanceView,
  HostelModuleView as HostelComplaintsView,
  HostelModuleView as HostelDashboardView,
  HostelModuleView as HostelRoomsView,
  HostelModuleView as HostelOccupantsView,
  HostelModuleView as HostelWardenDeskView,
  HostelModuleView as HostelGatePassesView,
  HostelModuleView as HostelInspectionAuditsView,
  HostelModuleView as HostelInventoryAssetsView,
  HostelModuleView as HostelNoticesView,
  HostelModuleView as HostelOutingLogHistoryView,
  HostelModuleView as HostelDeviceManagementView,
  HostelModuleView as HostelMessFeesView,
  HostelModuleView as HostelResidentsView,
  HostelModuleView as HostelMessMenusView,
  HostelModuleView as HostelMessInventoryView,
  HostelModuleView as HostelBedManagementView,
  HostelModuleView as HostelBlockManagementView,
  HostelModuleView as HostelRoomAllocationsView,
  HostelModuleView as HostelVisitorLogView,
  HostelModuleView as HostelStaffDutyRosterView,
  HostelModuleView as HostelVisitorsView,
  HostelModuleView as HostelBlocksView,
  HostelModuleView as HostelNotificationsView,
  HostelModuleView as HostelOutingApprovalsView,
} from "./HostelComponents";
