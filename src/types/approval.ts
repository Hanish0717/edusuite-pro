export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type WorkflowDomainCategory = 
  | "Academic"
  | "Human Resources"
  | "Finance"
  | "Administration"
  | "Student Services";

export type WorkflowStatus = "Pending" | "Escalated" | "Completed" | "Rejected" | "High Priority" | "Cancelled";

export type StepStatus = "completed" | "active" | "pending" | "rejected" | "escalated";

export interface WorkflowStep {
  id: string;
  role: string;
  label: string;
  flagRequired?: string;
  status: StepStatus;
  actor?: string;
  actorRole?: string;
  timestamp?: string;
  notes?: string;
  slaHours?: number;
}

export interface EscalationRecord {
  id: string;
  level: number;
  fromRole: string;
  toRole: string;
  reason: string;
  timestamp: string;
  triggeredBy: string;
}

export interface DelegationRecord {
  id: string;
  delegatorRole: string;
  delegatorName: string;
  delegateeRole: string;
  delegateeName: string;
  validFrom: string;
  validUntil: string;
  status: "Active" | "Expired" | "Revoked";
  scope: string;
  createdDate: string;
}

export interface AuditLogEntry {
  id: string;
  workflowId: string;
  workflowTitle: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  previousState?: string;
  currentState?: string;
  reason?: string;
  isOverride?: boolean;
  isDelegated?: boolean;
  escalationLevel?: number;
  riskLevel: RiskLevel;
}

export interface EmergencyOverrideRecord {
  overriddenBy: string;
  actorRole: string;
  actionType: "Emergency Approve" | "Force Reject" | "Force Reassign" | "Cancel Workflow";
  reason: string;
  timestamp: string;
  ipAddress: string;
  device: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  category: string;
  domainCategory: WorkflowDomainCategory;
  diagram: string;
  description: string;
  requestor: string;
  requestorRole: string;
  department: string;
  dateSubmitted: string;
  submittedAt: string;
  stepStartedAt: string;
  slaHours: number;
  currentStepIndex: number;
  riskLevel: RiskLevel;
  status: WorkflowStatus;
  isEscalated: boolean;
  escalationCount: number;
  steps: WorkflowStep[];
  escalationHistory: EscalationRecord[];
  auditLogs: AuditLogEntry[];
  overrideDetails?: EmergencyOverrideRecord;
}

export interface SlaInfo {
  status: "Green" | "Yellow" | "Red";
  hoursRemaining: number;
  hoursElapsed: number;
  percentElapsed: number;
  isOverdue: boolean;
  displayText: string;
}

export interface WorkflowTemplateStage {
  id: string;
  role: string;
  label: string;
  flagRequired?: string;
  slaHours: number;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  category: string;
  domainCategory: WorkflowDomainCategory;
  riskLevel: RiskLevel;
  defaultSlaHours: number;
  version: string;
  description: string;
  stages: WorkflowTemplateStage[];
}
