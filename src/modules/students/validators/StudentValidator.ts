import type { StudentRecord } from "../types";

export const StudentValidator = {
  validateRollNo(rollNo: string): string | null {
    if (!rollNo || rollNo.trim() === "") {
      return "Roll Number is required";
    }
    // E.g. alphanumeric/hyphens between 3 and 15 characters
    const rollRegex = /^[A-Z0-9-]{3,15}$/i;
    if (!rollRegex.test(rollNo)) {
      return "Roll Number must be 3-15 alphanumeric characters (hyphens allowed)";
    }
    return null;
  },

  validateEmail(email: string): string | null {
    if (!email || email.trim() === "") {
      return "Email address is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address format";
    }
    return null;
  },

  validatePhone(phone: string): string | null {
    if (!phone || phone.trim() === "") {
      return "Phone number is required";
    }
    // Matches 10-15 digits, allowing leading '+' or spaces/dashes
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return "Phone number must be 10-15 digits";
    }
    return null;
  },

  validateFullName(name: string): string | null {
    if (!name || name.trim() === "") {
      return "Full Name is required";
    }
    if (name.trim().length < 3) {
      return "Full Name must be at least 3 characters";
    }
    return null;
  },

  validateDepartment(department: string): string | null {
    if (!department || department.trim() === "") {
      return "Department allocation is required";
    }
    return null;
  },

  /**
   * Run full checks on a student form submission payload.
   * Returns a list of string validation error messages, or an empty list if valid.
   */
  validate(data: Partial<StudentRecord>): string[] {
    const errors: string[] = [];

    if (data.rollNo !== undefined) {
      const err = this.validateRollNo(data.rollNo);
      if (err) errors.push(err);
    }
    if (data.fullName !== undefined) {
      const err = this.validateFullName(data.fullName);
      if (err) errors.push(err);
    }
    if (data.email !== undefined) {
      const err = this.validateEmail(data.email);
      if (err) errors.push(err);
    }
    if (data.phone !== undefined) {
      const err = this.validatePhone(data.phone);
      if (err) errors.push(err);
    }
    if (data.department !== undefined) {
      const err = this.validateDepartment(data.department);
      if (err) errors.push(err);
    }

    return errors;
  }
};
