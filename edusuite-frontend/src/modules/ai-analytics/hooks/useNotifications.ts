import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories";
import type { AITriggerNotification } from "../types";

export function useNotifications() {
  const [alerts, setAlerts] = useState<AITriggerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificationsRepository = useMemo(() => RepositoryFactory.getNotifications(), []);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationsRepository.getNotifications();
      if (res.success) {
        setAlerts(res.data);
      } else {
        setError(res.error || "Failed to fetch notification feed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch notification feed.");
    } finally {
      setLoading(false);
    }
  }, [notificationsRepository]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const dispatchCustomAlert = async (
    studentId: string,
    studentName: string,
    triggerType: AITriggerNotification["triggerType"],
    channel: AITriggerNotification["channel"],
    recipient: AITriggerNotification["recipient"],
    message: string
  ) => {
    try {
      const res = await notificationsRepository.triggerManualNotification(
        studentId,
        studentName,
        triggerType,
        channel,
        recipient,
        message
      );
      if (res.success) {
        setAlerts((prev) => [res.data, ...prev]);
        toast.success(`Dispatched ${triggerType} notification via ${channel}.`);
        return true;
      } else {
        toast.error(res.error || "Failed to trigger alert.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger alert.");
      return false;
    }
  };

  return {
    alerts,
    loading,
    error,
    dispatchCustomAlert,
    refetch: fetchNotifications,
  };
}
export default useNotifications;
