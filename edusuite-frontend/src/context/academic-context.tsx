import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AcademicDepartmentInfo {
  code: string;
  name: string;
  dean: string;
}

export const ACADEMIC_DEPARTMENTS: AcademicDepartmentInfo[] = [
  { code: "CSE", name: "Computer Science & Engineering (CSE)", dean: "Dr. Ravi Kumar" },
  { code: "ECE", name: "Electronics & Communication Engineering (ECE)", dean: "Dr. Amit Verma" },
  { code: "EEE", name: "Electrical & Electronics Engineering (EEE)", dean: "Dr. S. N. Singh" },
  { code: "ME", name: "Mechanical Engineering (ME)", dean: "Dr. H. P. Sharma" },
  { code: "Civil", name: "Civil Engineering", dean: "Dr. R. K. Mittal" },
  { code: "MBA", name: "Master of Business Administration (MBA)", dean: "Dr. Neha Kapoor" },
];

const ACADEMIC_DEPT_STORAGE_KEY = "edusuite.academic-selected-dept";

interface AcademicContextValue {
  selectedDepartment: string;
  setSelectedDepartment: (deptCode: string) => void;
  deanName: string;
  departments: AcademicDepartmentInfo[];
}

const AcademicContext = createContext<AcademicContextValue | null>(null);

export function AcademicProvider({ children }: { children: ReactNode }) {
  const [selectedDepartment, setSelectedDepartmentState] = useState<string>("CSE");

  // Load saved department from localStorage on mount
  useEffect(() => {
    const savedDept = window.localStorage.getItem(ACADEMIC_DEPT_STORAGE_KEY);
    const isValidDept = savedDept && ACADEMIC_DEPARTMENTS.some((d) => d.code === savedDept);
    if (isValidDept) {
      setSelectedDepartmentState(savedDept);
    } else {
      setSelectedDepartmentState("CSE");
    }
  }, []);

  const setSelectedDepartment = (deptCode: string) => {
    if (ACADEMIC_DEPARTMENTS.some((d) => d.code === deptCode)) {
      setSelectedDepartmentState(deptCode);
      window.localStorage.setItem(ACADEMIC_DEPT_STORAGE_KEY, deptCode);
    }
  };

  const deanName = useMemo(() => {
    const dept = ACADEMIC_DEPARTMENTS.find((d) => d.code === selectedDepartment);
    return dept ? dept.dean : "Dr. Ravi Kumar";
  }, [selectedDepartment]);

  const value = useMemo<AcademicContextValue>(
    () => ({
      selectedDepartment,
      setSelectedDepartment,
      deanName,
      departments: ACADEMIC_DEPARTMENTS,
    }),
    [selectedDepartment, deanName]
  );

  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
}

export function useAcademic() {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error("useAcademic must be used within an AcademicProvider");
  return ctx;
}
