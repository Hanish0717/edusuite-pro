import api from "@/lib/api";

export interface SalarySlip {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  monthYear: string;
  basicPay: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "Paid" | "Processing" | "Pending Approval";
  paymentDate?: string | undefined;
  bankAccount?: string | undefined;
}

export const INITIAL_SALARY_SLIPS: SalarySlip[] = [
  {
    id: "PAY-2026-07-01",
    employeeName: "Dr. Rajesh Sharma",
    employeeId: "EMP001",
    department: "CSE",
    designation: "Professor & HOD",
    monthYear: "July 2026",
    basicPay: 85000,
    hra: 25500,
    allowances: 12000,
    deductions: 10200,
    netSalary: 112300,
    status: "Paid",
    paymentDate: "2026-07-31",
    bankAccount: "HDFC-****-4821",
  },
  {
    id: "PAY-2026-07-02",
    employeeName: "Dr. Meera Rao",
    employeeId: "EMP002",
    department: "ECE",
    designation: "Professor & Vice Principal",
    monthYear: "July 2026",
    basicPay: 72000,
    hra: 21600,
    allowances: 10000,
    deductions: 8640,
    netSalary: 94960,
    status: "Paid",
    paymentDate: "2026-07-31",
    bankAccount: "SBI-****-9102",
  },
  {
    id: "PAY-2026-07-03",
    employeeName: "Prof. Anand Kumar",
    employeeId: "EMP003",
    department: "ME",
    designation: "Associate Professor",
    monthYear: "July 2026",
    basicPay: 55000,
    hra: 16500,
    allowances: 8000,
    deductions: 6600,
    netSalary: 72900,
    status: "Processing",
    paymentDate: "Pending",
    bankAccount: "ICICI-****-3310",
  },
  {
    id: "PAY-2026-07-04",
    employeeName: "Dr. S. K. Gupta",
    employeeId: "EMP004",
    department: "CSE",
    designation: "Academic Dean",
    monthYear: "July 2026",
    basicPay: 90000,
    hra: 27000,
    allowances: 15000,
    deductions: 10800,
    netSalary: 121200,
    status: "Paid",
    paymentDate: "2026-07-31",
    bankAccount: "AXIS-****-7781",
  },
  {
    id: "PAY-2026-07-05",
    employeeName: "Ms. Ananya Verma",
    employeeId: "EMP005",
    department: "AI&DS",
    designation: "Assistant Professor",
    monthYear: "July 2026",
    basicPay: 48000,
    hra: 14400,
    allowances: 6000,
    deductions: 5760,
    netSalary: 62640,
    status: "Pending Approval",
    paymentDate: "Pending",
    bankAccount: "KOTAK-****-1192",
  },
];

export async function fetchPayrollLedger(): Promise<SalarySlip[]> {
  try {
    const res = await api.get("/api/payroll");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_SALARY_SLIPS;
}

export async function generatePayslip(slipData: Partial<SalarySlip>): Promise<SalarySlip> {
  try {
    const res = await api.post("/api/payroll/generate", slipData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const basic = Number(slipData.basicPay) || 50000;
  const hra = Number(slipData.hra) || basic * 0.3;
  const allowances = Number(slipData.allowances) || 8000;
  const deductions = Number(slipData.deductions) || basic * 0.12;
  const net = basic + hra + allowances - deductions;

  const newSlip: SalarySlip = {
    id: `PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
    employeeName: slipData.employeeName || "Dr. Ravi Kumar",
    employeeId: slipData.employeeId || "EMP010",
    department: slipData.department || "CSE",
    designation: slipData.designation || "Faculty",
    monthYear: slipData.monthYear || "August 2026",
    basicPay: basic,
    hra: Math.round(hra),
    allowances: Math.round(allowances),
    deductions: Math.round(deductions),
    netSalary: Math.round(net),
    status: slipData.status || "Processing",
    paymentDate: slipData.status === "Paid" ? new Date().toISOString().split("T")[0] : "Pending",
    bankAccount: slipData.bankAccount || "HDFC-****-9901",
  };

  return newSlip;
}

export async function updateSalaryStatus(
  id: string,
  status: "Paid" | "Processing" | "Pending Approval",
): Promise<Partial<SalarySlip>> {
  try {
    const res = await api.put(`/api/payroll/${id}`, { status });
    if (res && res.data) return res.data;
  } catch {}
  return { id, status };
}
