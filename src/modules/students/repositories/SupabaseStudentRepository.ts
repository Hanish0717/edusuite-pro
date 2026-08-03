import type { IStudentRepository } from "./StudentRepository";
import type { StudentRecord, StudentDocument, StudentTimelineEvent } from "../types";

export class SupabaseStudentRepository implements IStudentRepository {
  async getAll(): Promise<StudentRecord[]> {
    // future integration: return supabase.from('students').select('*')
    console.warn("SupabaseStudentRepository: getAll not fully implemented, falling back to mock behavior in production");
    return [];
  }

  async getById(id: string): Promise<StudentRecord | null> {
    console.warn("SupabaseStudentRepository: getById not implemented");
    return null;
  }

  async create(student: Partial<StudentRecord>): Promise<StudentRecord> {
    console.warn("SupabaseStudentRepository: create not implemented");
    return {} as StudentRecord;
  }

  async update(id: string, updates: Partial<StudentRecord>): Promise<StudentRecord> {
    console.warn("SupabaseStudentRepository: update not implemented");
    return {} as StudentRecord;
  }

  async delete(id: string): Promise<boolean> {
    console.warn("SupabaseStudentRepository: delete not implemented");
    return false;
  }

  async getDocuments(studentId: string): Promise<StudentDocument[]> {
    return [];
  }

  async uploadDocument(studentId: string, doc: Partial<StudentDocument>): Promise<StudentDocument> {
    return {} as StudentDocument;
  }

  async verifyDocument(studentId: string, docId: string, status: "Verified" | "Rejected"): Promise<boolean> {
    return false;
  }

  async getTimeline(studentId: string): Promise<StudentTimelineEvent[]> {
    return [];
  }

  async addTimelineEvent(studentId: string, event: Partial<StudentTimelineEvent>): Promise<StudentTimelineEvent> {
    return {} as StudentTimelineEvent;
  }

  async search(params: any): Promise<any> {
    console.warn("SupabaseStudentRepository: search not implemented");
    return { data: [], total: 0, page: 1, limit: 10 };
  }

  async bulkAction(ids: string[], action: string, payload?: any): Promise<boolean> {
    console.warn("SupabaseStudentRepository: bulkAction not implemented");
    return false;
  }
}
