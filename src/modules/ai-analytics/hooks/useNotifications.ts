import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { NotificationsApi } from "../services/notifications.api";
import type { AITriggerNotification } from "../types";

export function useNotifications() {
  const [alerts, setAlerts] = useState<AITriggerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await NotificationsApi.getNotifications();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notification feed.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      const newAlert = await NotificationsApi.triggerManualNotification(
        studentId,
        studentName,
        triggerType,
        channel,
        recipient,
        message
      );
      setAlerts((prev) => [newAlert, ...prev]);
      toast.success(`Dispatched ${triggerType} notification via ${channel}.`);
      return true;
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
