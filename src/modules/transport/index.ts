// =============================================================================
// TRANSPORT MODULE V2 MAIN ENTRY POINT EXPORTS
// =============================================================================

export * from "./types";
export * from "./constants";
export * from "./validators/TransportValidator";
export * from "./events/TransportEvents";
export * from "./repositories/TransportRepository";
export * from "./repositories/RepositoryFactory";
export {
  INITIAL_ENHANCED_ROUTES,
  INITIAL_ENHANCED_PASSES,
  DEFAULT_TRANSPORT_CONFIG,
  INITIAL_VEHICLE_COMPLIANCE,
  DEFAULT_FLEET_HEALTH,
  DEFAULT_ANALYTICS,
  DEFAULT_POLICY_GOVERNANCE,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  DEFAULT_STAFF_SUMMARY,
  fetchBusRoutes,
  fetchTransportPasses,
  createBusRoute,
  issueTransportPass,
  type EnhancedBusRoute,
  type EnhancedTransportPass,
  type TransportConfig,
  type VehicleComplianceItem,
  type FleetHealthCompliance,
  type ExecutiveTransportAnalyticsData,
  type PolicyGovernanceData,
  type TransportAlert,
  type TransportActivityLog,
  type TransportStaffSummary,
} from "./TransportService";
export * from "./hooks/useTransport";
export * from "./hooks/useTransportPermissions";

// Legacy component exports maintained for backwards compatibility
export * from "./TransportComponents";
