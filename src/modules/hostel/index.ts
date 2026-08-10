// =============================================================================
// HOSTEL MODULE V2 MAIN ENTRY POINT EXPORTS
// =============================================================================

export * from "./types";
export * from "./constants";
export * from "./validators/HostelValidator";
export * from "./events/HostelEvents";
export * from "./repositories/HostelRepository";
export * from "./repositories/RepositoryFactory";
export * from "./HostelService";
export * from "./hooks/useHostel";
export * from "./hooks/useHostelPermissions";

// Legacy component exports maintained for backwards compatibility
export * from "./HostelComponents";
