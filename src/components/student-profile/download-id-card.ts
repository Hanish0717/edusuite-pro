import { toast } from "sonner";

export function downloadStudentIdCardPdf(student: {
  name: string;
  rollNumber: string;
  department: string;
  degree: string;
  currentSemester: number | string;
  registrationNumber: string;
  personal: {
    bloodGroup: string;
    dob: string;
    phone: string;
    email: string;
    emergencyContact: { phone: string };
  };
  address: {
    permanent: { street: string; city: string; state: string; pincode: string };
  };
}) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Student ID Card - ${student.name}</title>
  <style>
    @page { size: A4; margin: 0; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      background: #0f172a;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
    }
    .card-frame {
      width: 380px;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #091024 100%);
      border-radius: 20px;
      border: 2px solid #3b82f6;
      padding: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 16px;
      color: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    .brand-title {
      font-weight: 900;
      font-size: 15px;
      color: #ffffff;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 9px;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
    }
    .session-badge {
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #93c5fd;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
    }
    .profile-section {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 18px;
    }
    .avatar-placeholder {
      width: 90px;
      height: 90px;
      border-radius: 16px;
      border: 2px solid #3b82f6;
      background: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      color: #60a5fa;
      flex-shrink: 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    }
    .student-info h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.2;
    }
    .student-dept {
      color: #60a5fa;
      font-size: 12px;
      font-weight: 700;
      margin-top: 2px;
    }
    .student-meta {
      font-size: 11px;
      color: #cbd5e1;
      margin-top: 4px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: rgba(15, 23, 42, 0.8);
      padding: 14px;
      border-radius: 14px;
      border: 1px solid #334155;
      font-size: 11px;
      margin-bottom: 16px;
    }
    .field-label {
      color: #94a3b8;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .field-value {
      font-weight: 800;
      color: #f8fafc;
    }
    .field-value.green {
      color: #4ade80;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }
    .barcode {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      letter-spacing: 3px;
      color: #94a3b8;
      background: rgba(0, 0, 0, 0.5);
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #334155;
    }
    .sign-box {
      text-align: right;
    }
    .sign-label {
      font-size: 8px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sign-name {
      font-family: Georgia, serif;
      font-style: italic;
      color: #93c5fd;
      font-size: 13px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card-frame">
    <div class="header">
      <div class="logo-box">
        <div class="logo-badge">EP</div>
        <div>
          <div class="brand-title">EduSuite Pro</div>
          <div class="brand-sub">Autonomous University</div>
        </div>
      </div>
      <div class="session-badge">AY 2026-27</div>
    </div>

    <div class="profile-section">
      <div class="avatar-placeholder">STUDENT</div>
      <div class="student-info">
        <h2>${student.name}</h2>
        <div class="student-dept">${student.department}</div>
        <div class="student-meta">Roll No: <strong style="color:#ffffff;">${student.rollNumber}</strong></div>
        <div class="student-meta">Adm No: <strong style="color:#ffffff;">${student.admissionNumber || student.registrationNumber}</strong></div>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <div class="field-label">Blood Group</div>
        <div class="field-value green">${student.personal.bloodGroup}</div>
      </div>
      <div>
        <div class="field-label">Valid Thru</div>
        <div class="field-value">JUNE 2026</div>
      </div>
      <div>
        <div class="field-label">Degree</div>
        <div class="field-value">${student.degree} (Sem ${student.currentSemester})</div>
      </div>
      <div>
        <div class="field-label">Status</div>
        <div class="field-value green">ACTIVE STUDENT</div>
      </div>
    </div>

    <div class="footer">
      <div class="barcode">||||| ||| ||||||| ||||</div>
      <div class="sign-box">
        <div class="sign-label">Authorized Signatory</div>
        <div class="sign-name">Registrar Academic</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = url;
  downloadAnchor.download = `${student.name.replace(/\s+/g, "_")}_Student_ID_Card.pdf`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);

  toast.success(`Downloaded ${student.name}'s official Digital Student ID Card PDF!`);
}
