import type { StudentRecord, StudentDocument, StudentTimelineEvent, StandardQueryParams, PaginatedResult } from "../types";

export interface IStudentRepository {
  getAll(): Promise<StudentRecord[]>;
  getById(id: string): Promise<StudentRecord | null>;
  create(student: Partial<StudentRecord>): Promise<StudentRecord>;
  update(id: string, updates: Partial<StudentRecord>): Promise<StudentRecord>;
  delete(id: string): Promise<boolean>;
  
  // Standardized Query & Search API
  search(params: StandardQueryParams): Promise<PaginatedResult<StudentRecord>>;
  bulkAction(ids: string[], action: string, payload?: any): Promise<boolean>;
  
  // Dossier sub-resources
  getDocuments(studentId: string): Promise<StudentDocument[]>;
  uploadDocument(studentId: string, doc: Partial<StudentDocument>): Promise<StudentDocument>;
  verifyDocument(studentId: string, docId: string, status: "Verified" | "Rejected"): Promise<boolean>;
  
  getTimeline(studentId: string): Promise<StudentTimelineEvent[]>;
  addTimelineEvent(studentId: string, event: Partial<StudentTimelineEvent>): Promise<StudentTimelineEvent>;
}
