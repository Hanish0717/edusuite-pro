export const APPROVAL_ENDPOINTS = {
  list: "/approvals",
  detail: (id: string) => `/approvals/${id}`,
  approve: (id: string) => `/approvals/${id}/approve`,
  reject: (id: string) => `/approvals/${id}/reject`,
  return: (id: string) => `/approvals/${id}/return`,
  bulk: "/approvals/bulk",
  analytics: "/analytics/approvals",
  reports: "/reports/approvals",
} as const;
