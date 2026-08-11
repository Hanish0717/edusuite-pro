// =============================================================================
// TRANSPORT MODULE V2 MAIN REACT HOOK
// =============================================================================

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { TransportValidator } from "../validators/TransportValidator";
import { TransportEvents } from "../events/TransportEvents";
import { TransportRoute, TransportVehicle, TransportDriver, TransportPass, RouteCreatePayload, BusPassIssuePayload } from "../types";

export function useTransport() {
  const repository = RepositoryFactory.getRepository(true);

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [drivers, setDrivers] = useState<TransportDriver[]>([]);
  const [passes, setPasses] = useState<TransportPass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedRoutes, fetchedVehicles, fetchedDrivers, fetchedPasses] = await Promise.all([
        repository.getRoutes(),
        repository.getVehicles(),
        repository.getDrivers(),
        repository.getPasses(),
      ]);
      setRoutes(fetchedRoutes);
      setVehicles(fetchedVehicles);
      setDrivers(fetchedDrivers);
      setPasses(fetchedPasses);
    } catch (error) {
      toast.error("Failed to load Transport data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoute = async (payload: RouteCreatePayload) => {
    const { isValid, errors } = TransportValidator.validateRoute(payload);
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    try {
      const newRoute = await repository.createRoute(payload);
      setRoutes((prev) => [newRoute, ...prev]);
      TransportEvents.publish("transport:route_created", {
        routeId: newRoute.id,
        routeName: newRoute.routeName,
        busNumber: newRoute.busNumber,
      });
      toast.success("Transit Route created successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create route.");
      return false;
    }
  };

  const handleIssueBusPass = async (payload: BusPassIssuePayload) => {
    const { isValid, errors } = TransportValidator.validateBusPass(payload);
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    try {
      const newPass = await repository.issuePass(payload);
      setPasses((prev) => [newPass, ...prev]);
      TransportEvents.publish("transport:pass_issued", {
        passId: newPass.id,
        userId: payload.userId,
        routeId: payload.routeId,
        validTo: payload.validTo,
      });
      toast.success("Bus Pass issued successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to issue bus pass.");
      return false;
    }
  };

  const filteredRoutes = routes.filter(
    (r) =>
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    routes: filteredRoutes,
    allRoutes: routes,
    vehicles,
    drivers,
    passes,
    loading,
    searchQuery,
    setSearchQuery,
    createRoute: handleCreateRoute,
    issueBusPass: handleIssueBusPass,
    refresh: loadData,
  };
}
