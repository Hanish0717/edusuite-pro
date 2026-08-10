/**
 * finance-pdf-utils.ts
 * Shared PDF generation utilities for the Student Finance module.
 * Uses jsPDF with dynamic import for code splitting.
 */

import { toast } from "sonner";
import type { ReceiptItem, StudentFinanceSummary, FeeHeadItem, NoDueClearanceItem } from "./types";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function getJsPDF() {
  const mod = await import("jspdf");
  return mod.jsPDF ?? mod.default;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── RECEIPT PDF ──────────────────────────────────────────────────────────────

export async function downloadReceiptPdf(
  receipt: ReceiptItem,
  summary: StudentFinanceSummary
): Promise<void> {
  const toastId = toast.loading(`Generating receipt ${receipt.receiptNumber}...`);
  try {
    const jsPDF = await getJsPDF();
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Header background
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageW, 42, "F");

    // College name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("EduSuite Pro University", pageW / 2, 14, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Fee Payment Receipt", pageW / 2, 21, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Receipt No: ${receipt.receiptNumber}`, pageW / 2, 29, { align: "center" });
    doc.text(`Academic Year: ${receipt.academicYear}`, pageW / 2, 35, { align: "center" });

    // VERIFIED badge
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(pageW - 44, 9, 36, 10, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("✓ VERIFIED PAID", pageW - 26, 16, { align: "center" });

    // Student details section
    let y = 54;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Student Information", 14, y);

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(14, y, pageW - 14, y);
    y += 6;

    const details = [
      ["Student Name", summary.studentName],
      ["Roll Number", summary.rollNumber],
      ["Department", summary.branch],
      ["Semester", `Semester ${receipt.semester}`],
      ["Transaction ID", receipt.transactionId],
      ["Payment Date", receipt.paymentDate],
      ["Payment Mode", receipt.paymentMode],
    ];

    doc.setFontSize(9);
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(label + ":", 14, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(value, 75, y);
      y += 8;
    });

    // Payment table
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Payment Details", 14, y);
    y += 6;
    doc.line(14, y, pageW - 14, y);
    y += 2;

    // Table header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageW - 28, 9, "F");
    y += 6.5;
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Description", 18, y);
    doc.text("Amount (₹)", pageW - 18, y, { align: "right" });

    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, pageW - 14, y);
    y += 6;

    // Row
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.text("Academic Fee & Hostel Clearance — Semester " + receipt.semester, 18, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${receipt.amount.toLocaleString()}`, pageW - 18, y, { align: "right" });
    y += 4;
    doc.line(14, y, pageW - 14, y);
    y += 6;

    // Total row
    doc.setFillColor(240, 253, 244);
    doc.rect(14, y - 2, pageW - 28, 10, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text("Total Amount Paid:", 18, y + 4);
    doc.text(`₹ ${receipt.amount.toLocaleString()}`, pageW - 18, y + 4, { align: "right" });
    y += 16;

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("This is a computer generated receipt. No signature required.", pageW / 2, pageH - 20, { align: "center" });
    doc.text("EduSuite Pro University · Hyderabad, Telangana · www.edusuitepro.edu", pageW / 2, pageH - 14, { align: "center" });

    // QR verification text
    doc.setFontSize(7.5);
    doc.text(`Verification QR: EDUSUITE-${receipt.receiptNumber}-${receipt.transactionId}`, pageW / 2, pageH - 8, { align: "center" });

    const blob = doc.output("blob");
    triggerDownload(blob, `Receipt_${receipt.receiptNumber}.pdf`);
    toast.success("Receipt downloaded successfully!", { id: toastId });
  } catch (err) {
    console.error("Receipt PDF generation failed:", err);
    toast.error("Failed to download receipt. Please try again.", { id: toastId });
  }
}

// ─── FEE STRUCTURE PDF ────────────────────────────────────────────────────────

export async function downloadFeeStructurePdf(
  summary: StudentFinanceSummary,
  feeHeads: FeeHeadItem[]
): Promise<void> {
  const toastId = toast.loading("Generating Fee Structure PDF...");
  try {
    const jsPDF = await getJsPDF();
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 46, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text("EduSuite Pro University", pageW / 2, 13, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Fee Structure — Academic Year 2024-2025", pageW / 2, 21, { align: "center" });

    doc.setFontSize(9);
    doc.text(`${summary.branch} · Semester ${summary.currentSemester}`, pageW / 2, 30, { align: "center" });

    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(`Generated: ${today}`, pageW / 2, 38, { align: "center" });

    // Student info
    let y = 56;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Student Details", 14, y);
    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, pageW - 14, y);
    y += 6;

    const infoRows = [
      ["Name", summary.studentName],
      ["Roll Number", summary.rollNumber],
      ["Student ID", summary.studentId],
      ["Department", summary.branch],
    ];

    doc.setFontSize(8.5);
    for (const [label, val] of infoRows) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(label + ":", 14, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(val, 65, y);
      y += 7;
    }

    // Fee table
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Fee Head Breakdown", 14, y);
    y += 5;
    doc.line(14, y, pageW - 14, y);
    y += 2;

    // Table header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageW - 28, 9, "F");
    y += 6.5;
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Fee Head", 18, y);
    doc.text("Category", 95, y);
    doc.text("Status", 135, y);
    doc.text("Amount (₹)", pageW - 18, y, { align: "right" });
    y += 4;
    doc.line(14, y, pageW - 14, y);

    let grandTotal = 0;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    feeHeads.forEach((fee, idx) => {
      y += 7;
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y - 4, pageW - 28, 8, "F");
      }
      doc.setTextColor(15, 23, 42);
      const feeText = fee.feeHead.length > 45 ? fee.feeHead.substring(0, 42) + "..." : fee.feeHead;
      doc.text(feeText, 18, y);
      doc.text(fee.category, 95, y);

      // status color
      if (fee.status === "Paid") {
        doc.setTextColor(5, 150, 105);
      } else {
        doc.setTextColor(217, 119, 6);
      }
      doc.text(fee.status, 135, y);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(fee.amount.toLocaleString(), pageW - 18, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      grandTotal += fee.amount;
    });

    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, pageW - 14, y);
    y += 6;

    // Grand Total
    doc.setFillColor(239, 246, 255);
    doc.rect(14, y - 2, pageW - 28, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(37, 99, 235);
    doc.text("Grand Total (Semester " + summary.currentSemester + "):", 18, y + 4);
    doc.text(`₹ ${grandTotal.toLocaleString()}`, pageW - 18, y + 4, { align: "right" });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("This is a system generated fee structure document.", pageW / 2, pageH - 12, { align: "center" });
    doc.text("EduSuite Pro University · Hyderabad, Telangana", pageW / 2, pageH - 7, { align: "center" });

    const blob = doc.output("blob");
    triggerDownload(blob, `Fee_Structure_${summary.rollNumber}_Sem${summary.currentSemester}.pdf`);
    toast.success("Fee Structure PDF downloaded!", { id: toastId });
  } catch (err) {
    console.error("Fee Structure PDF generation failed:", err);
    toast.error("Failed to generate Fee Structure PDF.", { id: toastId });
  }
}

// ─── NO DUE CERTIFICATE PDF ───────────────────────────────────────────────────

export async function downloadNoDueCertificatePdf(
  summary: StudentFinanceSummary,
  clearances: NoDueClearanceItem[]
): Promise<void> {
  const toastId = toast.loading("Generating No Due Certificate...");
  try {
    const jsPDF = await getJsPDF();
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

    // Outer border
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(2);
    doc.rect(8, 8, pageW - 16, pageH - 16);
    doc.setLineWidth(0.5);
    doc.rect(11, 11, pageW - 22, pageH - 22);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("EduSuite Pro University", pageW / 2, 28, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Hyderabad, Telangana — NAAC 'A++' Accredited", pageW / 2, 36, { align: "center" });

    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(1);
    doc.line(20, 41, pageW - 20, 41);

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text("NO DUE CERTIFICATE", pageW / 2, 52, { align: "center" });

    // Student details
    let y = 64;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("This is to certify that the following student has cleared all dues:", pageW / 2, y, { align: "center" });

    y += 10;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(18, y - 4, pageW - 36, 38, 4, 4, "F");

    const infoItems = [
      ["Student Name", summary.studentName],
      ["Roll Number", summary.rollNumber],
      ["Department", summary.branch],
      ["Academic Year", summary.academicYear],
      ["Semester", `Semester ${summary.currentSemester}`],
    ];

    doc.setFontSize(9);
    infoItems.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text(label + ":", 24, y + 2);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(value, 70, y + 2);
      y += 7;
    });

    y += 8;

    // Clearance table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Department Clearance Status", 18, y);
    y += 5;

    doc.setFillColor(241, 245, 249);
    doc.rect(18, y, pageW - 36, 8, "F");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Department", 22, y + 5.5);
    doc.text("Officer", 72, y + 5.5);
    doc.text("Date", 122, y + 5.5);
    doc.text("Status", pageW - 30, y + 5.5);
    y += 8;

    clearances.forEach((c) => {
      const isApproved = c.clearanceStatus === "Approved";
      if (!isApproved) {
        doc.setFillColor(255, 251, 235);
        doc.rect(18, y, pageW - 36, 8, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(c.department, 22, y + 5.5);
      doc.text(c.clearedBy.substring(0, 28), 72, y + 5.5);
      doc.text(c.clearedDate ?? "Pending", 122, y + 5.5);
      if (isApproved) doc.setTextColor(5, 150, 105); else doc.setTextColor(217, 119, 6);
      doc.setFont("helvetica", "bold");
      doc.text(c.clearanceStatus, pageW - 30, y + 5.5);
      y += 8;
    });

    y += 12;
    // Signature section
    doc.setDrawColor(200, 200, 200);
    doc.line(30, y, 85, y);
    doc.line(pageW - 85, y, pageW - 30, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Finance Officer Signature", 57, y + 5, { align: "center" });
    doc.text("Principal / Registrar Signature", pageW - 57, y + 5, { align: "center" });

    y += 18;
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Issue Date: ${today}`, pageW / 2, y, { align: "center" });

    // QR code as text placeholder
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Verification: NODUES-${summary.rollNumber}-${summary.currentSemester}-EDUSUITE`, pageW / 2, pageH - 18, { align: "center" });
    doc.text("This is a digitally generated certificate. Verify at portal.edusuitepro.edu", pageW / 2, pageH - 12, { align: "center" });

    const blob = doc.output("blob");
    triggerDownload(blob, `NoDue_Certificate_${summary.rollNumber}.pdf`);
    toast.success("No Due Certificate downloaded!", { id: toastId });
  } catch (err) {
    console.error("No Due Certificate PDF generation failed:", err);
    toast.error("Failed to generate No Due Certificate.", { id: toastId });
  }
}

// ─── RECEIPT ZIP (ALL) ────────────────────────────────────────────────────────

export async function downloadAllReceiptsAsZip(
  receipts: ReceiptItem[],
  summary: StudentFinanceSummary
): Promise<void> {
  const toastId = toast.loading("Generating all receipts...");
  try {
    const jsPDF = await getJsPDF();

    for (const receipt of receipts) {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageW, 42, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("EduSuite Pro University", pageW / 2, 14, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Official Payment Receipt", pageW / 2, 21, { align: "center" });
      doc.setFontSize(9);
      doc.text(`Receipt No: ${receipt.receiptNumber} · AY ${receipt.academicYear}`, pageW / 2, 30, { align: "center" });

      let y = 54;
      const rows = [
        ["Student", summary.studentName],
        ["Roll No", summary.rollNumber],
        ["Transaction ID", receipt.transactionId],
        ["Date", receipt.paymentDate],
        ["Mode", receipt.paymentMode],
        ["Semester", `Semester ${receipt.semester}`],
      ];
      doc.setFontSize(9);
      rows.forEach(([k, v]) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(k + ":", 14, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(v, 70, y);
        y += 8;
      });

      y += 8;
      doc.setFillColor(240, 253, 244);
      doc.rect(14, y - 2, pageW - 28, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text("Total Paid:", 18, y + 4);
      doc.text(`₹ ${receipt.amount.toLocaleString()}`, pageW - 18, y + 4, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Computer generated receipt — EduSuite Pro University", pageW / 2, pageH - 12, { align: "center" });

      const blob = doc.output("blob");
      triggerDownload(blob, `Receipt_${receipt.receiptNumber}.pdf`);

      // Small delay between downloads
      await new Promise((r) => setTimeout(r, 300));
    }

    toast.success(`Downloaded ${receipts.length} receipt(s) successfully!`, { id: toastId });
  } catch (err) {
    console.error("Bulk receipt download failed:", err);
    toast.error("Failed to download receipts.", { id: toastId });
  }
}
