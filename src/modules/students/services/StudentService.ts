import { studentRepository } from "../repositories/RepositoryFactory";
import { StudentEvents } from "../events/StudentEvents";
import { StudentValidator } from "../validators/StudentValidator";
import type { StudentRecord, StudentDocument, StudentTimelineEvent } from "../types";

export const StudentService = {
  async getAll(): Promise<StudentRecord[]> {
    return await studentRepository.getAll();
  },

  async getById(id: string): Promise<StudentRecord | null> {
    return await studentRepository.getById(id);
  },

  async create(data: Partial<StudentRecord>): Promise<StudentRecord> {
    // Execute domain validations
    const errors = StudentValidator.validate(data);
    if (errors.length > 0) {
      throw new Error(errors.join(". "));
    }

    const student = await studentRepository.create(data);
    
    // Publish structured creation event
    StudentEvents.publish(StudentEvents.CREATED, {
      studentId: student.id,
      rollNo: student.rollNo,
      fullName: student.fullName,
      department: student.department,
      enrollmentDate: student.enrollmentDate,
    });

    return student;
  },

  async update(id: string, updates: Partial<StudentRecord>): Promise<StudentRecord> {
    // Validate fields if they are updated
    const errors = StudentValidator.validate(updates);
    if (errors.length > 0) {
      throw new Error(errors.join(". "));
    }

    const student = await studentRepository.update(id, updates);

    // Audit changes in the timeline log
    const changedFields = Object.keys(updates).join(", ");
    await studentRepository.addTimelineEvent(id, {
      title: "Profile Updated",
      description: `Fields updated: ${changedFields}`,
      type: "system",
      actor: "Registrar Officer",
    });

    StudentEvents.publish(StudentEvents.UPDATED, { studentId: id, updates });
    return student;
  },

  async delete(id: string): Promise<boolean> {
    const success = await studentRepository.delete(id);
    if (success) {
      StudentEvents.publish(StudentEvents.DELETED, { studentId: id });
    }
    return success;
  },

  async promoteStudent(id: string, newYear: string, newSemester: number): Promise<StudentRecord> {
    const student = await studentRepository.update(id, {
      academicYear: newYear,
      semester: newSemester,
    });

    await studentRepository.addTimelineEvent(id, {
      title: "Promoted",
      description: `Promoted to ${newYear} (Sem ${newSemester})`,
      type: "academic",
      actor: "Academic Coordinator",
    });

    StudentEvents.publish(StudentEvents.PROMOTED, { studentId: id, newYear, newSemester });
    return student;
  },

  async transferStudent(id: string, newDept: string, newSection: string): Promise<StudentRecord> {
    const oldStudent = await studentRepository.getById(id);
    const oldDept = oldStudent?.department || "N/A";
    const oldSec = oldStudent?.section || "N/A";

    const student = await studentRepository.update(id, {
      department: newDept,
      section: newSection,
    });

    await studentRepository.addTimelineEvent(id, {
      title: "Transferred",
      description: `Transferred from ${oldDept}-${oldSec} to ${newDept}-${newSection}`,
      type: "academic",
      actor: "Academic Registry",
    });

    StudentEvents.publish(StudentEvents.TRANSFERRED, { studentId: id, oldDept, oldSec, newDept, newSection });
    return student;
  },

  // Documents
  async getDocuments(studentId: string): Promise<StudentDocument[]> {
    return await studentRepository.getDocuments(studentId);
  },

  async uploadDocument(studentId: string, name: string, type: string, fileUrl: string): Promise<StudentDocument> {
    const doc = await studentRepository.uploadDocument(studentId, { name, type, fileUrl, status: "Pending" });
    
    await studentRepository.addTimelineEvent(studentId, {
      title: "Document Uploaded",
      description: `Uploaded document: ${name} (${type})`,
      type: "system",
      actor: "Student Portal",
    });

    return doc;
  },

  async verifyDocument(studentId: string, docId: string, status: "Verified" | "Rejected"): Promise<boolean> {
    const success = await studentRepository.verifyDocument(studentId, docId, status);
    if (success) {
      await studentRepository.addTimelineEvent(studentId, {
        title: `Document ${status}`,
        description: `Document ID ${docId} verified status changed to ${status}`,
        type: "system",
        actor: "Academic Registrar",
      });
      StudentEvents.publish(StudentEvents.DOCUMENT_VERIFIED, { studentId, docId, status });
    }
    return success;
  },

  // Timeline
  async getTimeline(studentId: string): Promise<StudentTimelineEvent[]> {
    return await studentRepository.getTimeline(studentId);
  },
};
