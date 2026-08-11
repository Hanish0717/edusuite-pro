// =============================================================================
// LIBRARY MODULE V2 MAIN ENTRY POINT EXPORTS
// =============================================================================

export * from "./types";
export * from "./constants";
export * from "./validators/LibraryValidator";
export * from "./events/LibraryEvents";
export * from "./repositories/LibraryRepository";
export * from "./repositories/RepositoryFactory";
export * from "./LibraryService";
export * from "./hooks/useLibrary";
export * from "./hooks/useLibraryPermissions";

// Legacy component exports maintained for backwards compatibility
export * from "./LibraryComponents";
export * from "./EnterpriseLibraryComponents";
export * from "./LibraryStore";
