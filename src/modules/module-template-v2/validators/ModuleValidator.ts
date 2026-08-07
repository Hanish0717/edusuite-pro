import type { ModuleRecord } from "../types";

export const ModuleValidator = {
  validateCode(code: string): string | null {
    if (!code || code.trim() === "") return "Code is required";
    if (code.length < 3) return "Code must be at least 3 characters";
    return null;
  },

  validateName(name: string): string | null {
    if (!name || name.trim() === "") return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    return null;
  },

  validate(data: Partial<ModuleRecord>): string[] {
    const errors: string[] = [];
    if (data.code !== undefined) {
      const err = this.validateCode(data.code);
      if (err) errors.push(err);
    }
    if (data.name !== undefined) {
      const err = this.validateName(data.name);
      if (err) errors.push(err);
    }
    return errors;
  }
};
