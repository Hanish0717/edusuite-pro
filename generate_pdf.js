import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// SVG Icons
const icons = {
  ai: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.5 7.5"/><path d="m12 12 4.5 7.5"/><circle cx="12" cy="12" r="3" fill="#818cf8"/></svg>`,
  students: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  faculty: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  alumni: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  hostel: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  finance: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
  disciplinary: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  wallet: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M16 12h.01"/><path d="M18 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"/></svg>`,
  reports: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  workflow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  approval: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  notifications: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  analytics: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
};

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>EduSuite Pro - Enterprise System Documentation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  @page {
    size: A4;
    margin: 18mm 15mm 18mm 15mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.55;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  /* Page Break Controls */
  .page-break {
    page-break-after: always;
    break-after: page;
  }

  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Header & Footer Styling for PDF */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }

  .doc-header .brand {
    font-size: 11pt;
    font-weight: 800;
    color: #1e1b4b;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .doc-header .brand-badge {
    background: linear-gradient(135deg, #4f46e5, #3730a3);
    color: white;
    font-size: 8pt;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .doc-header .meta {
    font-size: 8.5pt;
    color: #64748b;
    font-weight: 500;
  }

  /* Cover Page Styling */
  .cover-container {
    height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 20px;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }

  .cover-bg-accent {
    position: absolute;
    top: 0;
    right: 0;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .cover-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cover-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cover-logo-icon {
    width: 44px;
    height: 44px;
    background: #4f46e5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18pt;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  .cover-logo-text {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
  }

  .cover-badge {
    background: #e0e7ff;
    color: #3730a3;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 9pt;
    letter-spacing: 0.03em;
    border: 1px solid #c7d2fe;
  }

  .cover-body {
    margin-top: 40px;
  }

  .cover-subtitle-tag {
    color: #4f46e5;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9.5pt;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cover-title {
    font-size: 28pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    margin: 0 0 16px 0;
    letter-spacing: -0.03em;
  }

  .cover-description {
    font-size: 11pt;
    color: #475569;
    max-width: 600px;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .cover-modules-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 20px;
  }

  .cover-module-chip {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .cover-module-chip-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cover-module-chip-text {
    font-weight: 700;
    font-size: 9.5pt;
    color: #1e293b;
  }

  .cover-module-chip-sub {
    font-size: 8pt;
    color: #64748b;
  }

  .cover-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .cover-meta-item {
    font-size: 8.5pt;
    color: #64748b;
  }

  .cover-meta-item strong {
    color: #1e293b;
    display: block;
    font-size: 9pt;
  }

  /* Section Titles & Headers */
  h1.section-title {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h2.module-title {
    font-size: 15pt;
    font-weight: 800;
    color: #1e1b4b;
    margin: 0 0 14px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #4f46e5;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.02em;
  }

  h3.sub-title {
    font-size: 11pt;
    font-weight: 700;
    color: #334155;
    margin: 14px 0 8px 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Master Summary Table */
  .master-table-wrapper {
    margin-bottom: 25px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }

  table.master-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    text-align: left;
  }

  table.master-table th {
    background-color: #1e1b4b;
    color: #ffffff;
    font-weight: 700;
    padding: 10px 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 8pt;
    border-bottom: 2px solid #312e81;
  }

  table.master-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
    line-height: 1.45;
  }

  table.master-table tr:nth-child(even) {
    background-color: #f8fafc;
  }

  table.master-table tr:last-child td {
    border-bottom: none;
  }

  .sno-badge {
    background: #e0e7ff;
    color: #3730a3;
    font-weight: 800;
    padding: 3px 7px;
    border-radius: 5px;
    font-size: 8pt;
    display: inline-block;
  }

  /* Module Structure Cards */
  .module-container {
    margin-bottom: 25px;
    background: #ffffff;
  }

  .overview-box {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-left: 4px solid #4f46e5;
    border-radius: 0 10px 10px 0;
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  .overview-box p {
    margin: 0;
    font-size: 9.5pt;
    color: #334155;
    line-height: 1.6;
  }

  .objectives-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .objective-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 9pt;
    color: #1e293b;
    font-weight: 500;
  }

  .func-group {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 12px;
  }

  .func-group-header {
    font-weight: 700;
    font-size: 9.5pt;
    color: #1e1b4b;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .func-list {
    margin: 0;
    padding-left: 18px;
    font-size: 8.8pt;
    color: #475569;
  }

  .func-list li {
    margin-bottom: 4px;
  }

  .func-list li strong {
    color: #1e293b;
  }

  /* Two Column Layout for Roles & Workflow */
  .grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .info-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px;
  }

  .info-card-header {
    font-weight: 700;
    font-size: 9.5pt;
    color: #0f172a;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
  }

  .role-pill-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .role-pill-item {
    font-size: 8.5pt;
    color: #334155;
  }

  .role-pill-item strong {
    color: #1e1b4b;
  }

  .workflow-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .workflow-step-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 8.5pt;
    color: #334155;
  }

  .step-num {
    background: #4f46e5;
    color: white;
    font-weight: 800;
    font-size: 7.5pt;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .benefits-banner {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 10px 14px;
    margin-top: 10px;
  }

  .benefits-header {
    font-weight: 700;
    font-size: 9pt;
    color: #166534;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .benefit-card {
    font-size: 8.2pt;
    color: #15803d;
    background: #ffffff;
    border: 1px solid #dcfce7;
    border-radius: 6px;
    padding: 6px 8px;
    font-weight: 600;
  }

  /* Integrated System Architecture Section */
  .integrated-box {
    background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-top: 15px;
  }

  .integrated-box h2 {
    color: #ffffff;
    margin-top: 0;
    font-size: 14pt;
    border-bottom: 1px solid #4338ca;
    padding-bottom: 8px;
  }

  .integrated-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 15px;
  }

  .integrated-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 10px 12px;
  }

  .integrated-card-title {
    font-weight: 700;
    font-size: 9.5pt;
    color: #818cf8;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .integrated-card-desc {
    font-size: 8.5pt;
    color: #e0e7ff;
    line-height: 1.45;
  }
</style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-container page-break">
    <div class="cover-bg-accent"></div>
    
    <div class="cover-top">
      <div class="cover-logo">
        <div class="cover-logo-icon">E</div>
        <div class="cover-logo-text">EduSuite Pro</div>
      </div>
      <div class="cover-badge">Enterprise Edition</div>
    </div>

    <div class="cover-body">
      <div class="cover-subtitle-tag">
        ${icons.workflow} System Specification & Capabilities Guide
      </div>
      <h1 class="cover-title">Product Architecture & Core Module Specifications</h1>
      <p class="cover-description">
        A comprehensive production-level reference detailing the functionality, user workflows, governance roles, and operational benefits of EduSuite Pro's six core administrative and academic modules.
      </p>

      <div class="cover-modules-grid">
        <div class="cover-module-chip">
          <div class="cover-module-chip-icon">${icons.ai}</div>
          <div>
            <div class="cover-module-chip-text">01. LMS - AI Embedded</div>
            <div class="cover-module-chip-sub">Personalized Learning & Evaluation</div>
          </div>
        </div>

        <div class="cover-module-chip">
          <div class="cover-module-chip-icon">${icons.alumni}</div>
          <div>
            <div class="cover-module-chip-text">02. Alumni (ALUMI)</div>
            <div class="cover-module-chip-sub">Graduate Lifecycle & Network</div>
          </div>
        </div>

        <div class="cover-module-chip">
          <div class="cover-module-chip-icon">${icons.hostel}</div>
          <div>
            <div class="cover-module-chip-text">03. Hostel Management (HMS)</div>
            <div class="cover-module-chip-sub">Residential Operations & Safety</div>
          </div>
        </div>

        <div class="cover-module-chip">
          <div class="cover-module-chip-icon">${icons.disciplinary}</div>
          <div>
            <div class="cover-module-chip-text">04. Disciplinary Management</div>
            <div class="cover-module-chip-sub">Conduct Governance & Hearings</div>
          </div>
        </div>

        <div class="cover-module-chip">
          <div class="cover-module-chip-icon">${icons.wallet}</div>
          <div>
            <div class="cover-module-chip-text">05. Faculty Work Wallet</div>
            <div class="cover-module-chip-sub">Contribution Tracking & Credits</div>
          </div>
        </div>

        <div class="cover-module-chip">
          <div class="cover-module-chip-icon">${icons.finance}</div>
          <div>
            <div class="cover-module-chip-text">06. Fee Management</div>
            <div class="cover-module-chip-sub">Billing & Financial Administration</div>
          </div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-meta-item">
        <strong>Prepared For</strong>
        Institutional Leadership & Administration
      </div>
      <div class="cover-meta-item">
        <strong>Document Status</strong>
        Production Ready (v2.5)
      </div>
      <div class="cover-meta-item">
        <strong>Classification</strong>
        Enterprise Confidential
      </div>
    </div>
  </div>


  <!-- PAGE 2: EXECUTIVE SUMMARY & MASTER TABLE -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">EduSuite Pro</span> Executive System Overview
    </div>
    <div class="meta">Master Capabilities Matrix</div>
  </div>

  <h1 class="section-title">
    ${icons.reports} Executive Master Summary
  </h1>
  <p style="font-size: 9.5pt; color: #475569; margin-bottom: 16px;">
    The table below provides a high-level executive summary of the six core modules analyzed in this document, detailing their core objectives and key administrative capabilities.
  </p>

  <div class="master-table-wrapper">
    <table class="master-table">
      <thead>
        <tr>
          <th style="width: 6%;">S.NO</th>
          <th style="width: 22%;">MODULE NAME</th>
          <th style="width: 32%;">OBJECTIVES</th>
          <th style="width: 40%;">FUNCTIONALITIES</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="sno-badge">01</span></td>
          <td><strong>LMS - AI Embedded</strong></td>
          <td>Empower personalized learning, automate assessment grading, deliver real-time progress telemetry, and provide 24/7 AI tutoring support.</td>
          <td>AI Contextual Tutor, Adaptive Learning Modules, Automated Rubric Evaluation, Plagiarism & Similarity Detection, Performance Analytics.</td>
        </tr>
        <tr>
          <td><span class="sno-badge">02</span></td>
          <td><strong>Alumni (ALUMI)</strong></td>
          <td>Foster lifelong graduate relations, track career outcomes, streamline alumni fundraising, and facilitate career mentorship.</td>
          <td>Global Alumni Registry, Career & Internship Referral Board, Event & Reunion Manager, Philanthropy & Endowment Portal.</td>
        </tr>
        <tr>
          <td><span class="sno-badge">03</span></td>
          <td><strong>HMS (Hostel System)</strong></td>
          <td>Automate room inventory allocation, enforce gate-pass security governance, streamline maintenance, and optimize mess hall logistics.</td>
          <td>Smart Room Allocation, Biometric/QR Gate Pass Engine, Facility Maintenance Dispatch, Mess Card & Meal Forecast System.</td>
        </tr>
        <tr>
          <td><span class="sno-badge">04</span></td>
          <td><strong>Disciplinary Management</strong></td>
          <td>Maintain campus code of conduct, log behavioral incidents, schedule committee hearings, and track corrective action compliance.</td>
          <td>Confidential Incident Reporting, Committee Hearing Manager, Sanction Tracking Engine, Formal Appeals Portal, Conduct Scoring.</td>
        </tr>
        <tr>
          <td><span class="sno-badge">05</span></td>
          <td><strong>Faculty Work Wallet</strong></td>
          <td>Quantify faculty contributions, automate multi-tier duty verification, award gamified credit points, and streamline annual appraisals.</td>
          <td>Multi-Category Work Claim Engine, HOD/Dean Verification Routing, Wallet Balance Ledger, Gamified Achievement Badges, NAAC/NBA Export.</td>
        </tr>
        <tr>
          <td><span class="sno-badge">06</span></td>
          <td><strong>Fee Management</strong></td>
          <td>Configure flexible fee structures, process multi-channel payments, enforce financial security controls, and automate receipting.</td>
          <td>Multi-Component Fee Engine, Online Payment Gateway Integration, Dynamic Dues & Penalty Automation, Daily Cashier Settlement Reports.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>


  <!-- MODULE 1: LMS - AI EMBEDDED -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">Module 01</span> LMS - AI Embedded
    </div>
    <div class="meta">Academic Delivery & Learning Automation</div>
  </div>

  <div class="module-container">
    <h2 class="module-title">
      ${icons.ai} Module 01: LMS - AI Embedded
    </h2>

    <h3 class="sub-title">1.1 Module Overview</h3>
    <div class="overview-box">
      <p>
        The <strong>AI-Embedded Learning Management System (LMS)</strong> is a modern digital learning environment that combines traditional course content delivery with native Artificial Intelligence capability. The module addresses the critical challenge of one-size-fits-all academic instruction and delayed assessment feedback. It provides students with a 24/7 intelligent contextual tutor while automating repetitive grading workflows for faculty members. Used by students, course instructors, teaching assistants, and academic deans, this module transforms static course repositories into an interactive, data-driven learning ecosystem.
      </p>
    </div>

    <h3 class="sub-title">1.2 Objectives</h3>
    <div class="objectives-list">
      <div class="objective-item">
        ${icons.check} Deliver 24/7 personalized, AI-guided learning assistance tailored to student pace.
      </div>
      <div class="objective-item">
        ${icons.check} Automate assignment grading and rubric evaluation to free faculty time for mentoring.
      </div>
      <div class="objective-item">
        ${icons.check} Provide real-time telemetry and early-warning alerts for struggling students.
      </div>
      <div class="objective-item">
        ${icons.check} Centralize curriculum delivery, multimedia notes, SCORM packages, and interactive quizzes.
      </div>
    </div>

    <h3 class="sub-title">1.3 Functionalities</h3>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.ai} 1.3.1 AI-Powered Learning Assistant & Virtual Tutor
      </div>
      <ul class="func-list">
        <li><strong>Contextual Syllabus Assistant:</strong> Answers student queries strictly grounded in uploaded lecture slides, textbooks, and course syllabus documents.</li>
        <li><strong>Adaptive Concept Clarification:</strong> Explains complex concepts at varying difficulty levels (e.g., beginner, intermediate, advanced) with dynamic real-world examples.</li>
        <li><strong>Self-Paced Practice Quiz Generation:</strong> Instantly generates customized practice questions based on specific weak areas identified during learning sessions.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.workflow} 1.3.2 Course Delivery & Assessment Automation
      </div>
      <ul class="func-list">
        <li><strong>Structured Module Progression:</strong> Hosts video lectures, reading materials, code snippets, and audio notes with enforced prerequisites.</li>
        <li><strong>Smart Automated Evaluation:</strong> Auto-evaluates multiple-choice, short-answer, and programming assignments using predefined rubric scoring engines.</li>
        <li><strong>Originality & Plagiarism Verification:</strong> Scans student submissions against global literature databases and peer repositories for content similarity.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.analytics} 1.3.3 Telemetry & Academic Analytics
      </div>
      <ul class="func-list">
        <li><strong>Real-Time Engagement Diagnostics:</strong> Tracks video completion rates, quiz turnaround speed, and module time-on-task metrics.</li>
        <li><strong>Early Warning Intervention Triggers:</strong> Flags at-risk students automatically to course advisors based on low activity and failing practice scores.</li>
      </ul>
    </div>

    <div class="grid-2col">
      <div class="info-card">
        <div class="info-card-header">
          ${icons.faculty} User Roles & Access
        </div>
        <div class="role-pill-list">
          <div class="role-pill-item"><strong>Students:</strong> Access syllabus materials, engage with AI tutor, complete quizzes, view score feedback.</div>
          <div class="role-pill-item"><strong>Instructors:</strong> Upload course content, review AI grading recommendations, monitor class performance.</div>
          <div class="role-pill-item"><strong>Deans / Admins:</strong> Audit curriculum coverage, verify engagement metrics across departments.</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header">
          ${icons.workflow} Standard Module Workflow
        </div>
        <div class="workflow-steps">
          <div class="workflow-step-item"><span class="step-num">1</span> Course content & syllabus published by faculty.</div>
          <div class="workflow-step-item"><span class="step-num">2</span> Student consumes modules & engages with AI tutor.</div>
          <div class="workflow-step-item"><span class="step-num">3</span> Student submits assignment; AI executes auto-evaluation.</div>
          <div class="workflow-step-item"><span class="step-num">4</span> Faculty validates grades & updates gradebook ledger.</div>
        </div>
      </div>
    </div>

    <div class="benefits-banner">
      <div class="benefits-header">
        ${icons.approval} Key Operational & Academic Benefits
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">⚡ 40% Reduction in Grading Time</div>
        <div class="benefit-card">🎓 24/7 Instant Academic Assistance</div>
        <div class="benefit-card">📊 Early At-Risk Student Detection</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>


  <!-- MODULE 2: ALUMNI (ALUMI) -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">Module 02</span> Alumni Management System (ALUMI)
    </div>
    <div class="meta">Graduate Lifecycle & Community Network</div>
  </div>

  <div class="module-container">
    <h2 class="module-title">
      ${icons.alumni} Module 02: Alumni Management System (ALUMI)
    </h2>

    <h3 class="sub-title">2.1 Module Overview</h3>
    <div class="overview-box">
      <p>
        The <strong>Alumni Management System (ALUMI)</strong> is an enterprise lifecycle management platform designed to maintain lifelong relationships between the institution and its global graduate community. It eliminates fragmented spreadsheets, lost contact details, and uncoordinated career outreach. Used by graduated alumni, final-year students, placement officers, and institutional advancement directors, this module streamlines graduate verification, job referral exchanges, global event coordination, and strategic fundraising campaigns essential for national (NAAC/NIRF) and international accreditation rankings.
      </p>
    </div>

    <h3 class="sub-title">2.2 Objectives</h3>
    <div class="objectives-list">
      <div class="objective-item">
        ${icons.check} Maintain a self-updating, verified global directory of all institutional graduates.
      </div>
      <div class="objective-item">
        ${icons.check} Facilitate direct mentorship and job referral channels between alumni and students.
      </div>
      <div class="objective-item">
        ${icons.check} Drive institutional fundraising campaigns with transparent donation tracking.
      </div>
      <div class="objective-item">
        ${icons.check} Capture graduate outcome statistics required for institutional accreditation.
      </div>
    </div>

    <h3 class="sub-title">2.3 Functionalities</h3>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.alumni} 2.3.1 Global Alumni Directory & Verified Registries
      </div>
      <ul class="func-list">
        <li><strong>Multi-Parameter Search Registry:</strong> Allows searching alumni records by graduation year, domain expertise, geographic location, and current employer.</li>
        <li><strong>LinkedIn Profile Synchronization:</strong> Automatically updates alumni employment history, designations, and professional milestones.</li>
        <li><strong>Digital Alumni Membership Card:</strong> Issues secure QR-verified digital alumni IDs for campus facility access and library privileges.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.workflow} 2.3.2 Mentorship Exchange & Career Hub
      </div>
      <ul class="func-list">
        <li><strong>Alumni Job & Internship Portal:</strong> Enables alumni to post exclusive career openings, internship slots, and campus referral opportunities.</li>
        <li><strong>Structured Mentorship Matching:</strong> Connects final-year students with alumni mentors based on career interests and academic background.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.finance} 2.3.3 Philanthropy & Endowment Management
      </div>
      <ul class="func-list">
        <li><strong>Campaign Fundraising Portal:</strong> Manages targeted infrastructure, scholarship, and research equipment fundraising drives.</li>
        <li><strong>Automated Tax Receipting & Audit Log:</strong> Generates instant digital tax exemption certificates and maintains transparent donor honor rolls.</li>
      </ul>
    </div>

    <div class="grid-2col">
      <div class="info-card">
        <div class="info-card-header">
          ${icons.faculty} User Roles & Access
        </div>
        <div class="role-pill-list">
          <div class="role-pill-item"><strong>Alumni:</strong> Update career profiles, offer mentorship, post jobs, contribute to campaigns.</div>
          <div class="role-pill-item"><strong>Students:</strong> Seek alumni career mentorship, apply for alumni-referred job postings.</div>
          <div class="role-pill-item"><strong>Alumni Relations Office:</strong> Verify graduate profiles, manage chapters, oversee donation campaigns.</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header">
          ${icons.workflow} Standard Module Workflow
        </div>
        <div class="workflow-steps">
          <div class="workflow-step-item"><span class="step-num">1</span> Graduate profile auto-created upon graduation clearance.</div>
          <div class="workflow-step-item"><span class="step-num">2</span> Alumni claims account & completes professional profile.</div>
          <div class="workflow-step-item"><span class="step-num">3</span> Alumni posts job referrals & participates in mentorship.</div>
          <div class="workflow-step-item"><span class="step-num">4</span> Contributions logged & accreditation reports generated.</div>
        </div>
      </div>
    </div>

    <div class="benefits-banner">
      <div class="benefits-header">
        ${icons.approval} Key Operational & Advancement Benefits
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">💼 Higher Student Job Placement Rates</div>
        <div class="benefit-card">📜 Automated NIRF/NAAC Outcome Reports</div>
        <div class="benefit-card">💰 Transparent Philanthropic Operations</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>


  <!-- MODULE 3: HMS (HOSTEL MANAGEMENT SYSTEM) -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">Module 03</span> Hostel Management System (HMS)
    </div>
    <div class="meta">Residential Operations & Safety Governance</div>
  </div>

  <div class="module-container">
    <h2 class="module-title">
      ${icons.hostel} Module 03: Hostel Management System (HMS)
    </h2>

    <h3 class="sub-title">3.1 Module Overview</h3>
    <div class="overview-box">
      <p>
        The <strong>Hostel Management System (HMS)</strong> is an integrated residential operations platform that manages student housing allocations, meal card subscriptions, night outing approvals, and facility maintenance dispatch. It replaces manual room ledgers, untracked paper outing slips, and unorganized mess hall logistics. Interacted with by resident students, hostel wardens, gate security staff, and mess managers, HMS ensures total resident safety, transparent room allocations, and efficient facility management across campus dormitories.
      </p>
    </div>

    <h3 class="sub-title">3.2 Objectives</h3>
    <div class="objectives-list">
      <div class="objective-item">
        ${icons.check} Automate transparent, criteria-based online room inventory allocations.
      </div>
      <div class="objective-item">
        ${icons.check} Enforce campus security via digital QR/biometric gate pass authorization.
      </div>
      <div class="objective-item">
        ${icons.check} Streamline maintenance dispatch and SLA tracking for living quarters.
      </div>
      <div class="objective-item">
        ${icons.check} Optimize mess hall meal forecasting to reduce food wastage and operational costs.
      </div>
    </div>

    <h3 class="sub-title">3.3 Functionalities</h3>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.hostel} 3.3.1 Smart Room Inventory & Online Allocation
      </div>
      <ul class="func-list">
        <li><strong>Visual Floorplan Room Selection:</strong> Displays real-time room availability, floor layouts, and roommate preferences during enrollment.</li>
        <li><strong>Occupancy Roster & Capacity Control:</strong> Prevents overbooking and maintains real-time records of vacant vs. occupied beds across hostel blocks.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.approval} 3.3.2 Digital Gate Pass & Movement Governance
      </div>
      <ul class="func-list">
        <li><strong>Outing Request & Warden Authorization:</strong> Allows students to submit day/overnight outing applications via mobile for warden digital sign-off.</li>
        <li><strong>Parent SMS/WhatsApp Notification:</strong> Triggers automated instant alerts to parents upon gate checkout and return entry scan.</li>
        <li><strong>Gate Security Scan Portal:</strong> Equips security desks with real-time QR scanners to verify authorized movements and catch curfew violations.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.reports} 3.3.3 Facility Maintenance & Mess Management
      </div>
      <ul class="func-list">
        <li><strong>Mobile Maintenance Ticketing:</strong> Enables students to report plumbing, electrical, or structural issues with photo uploads and SLA tracking.</li>
        <li><strong>Digital Mess Card & Meal Forecast:</strong> Tracks daily meal attendance using RFID/QR check-in, providing kitchen managers with accurate meal volume forecasts.</li>
      </ul>
    </div>

    <div class="grid-2col">
      <div class="info-card">
        <div class="info-card-header">
          ${icons.faculty} User Roles & Access
        </div>
        <div class="role-pill-list">
          <div class="role-pill-item"><strong>Resident Students:</strong> Select room preferences, submit outing requests, log maintenance tickets.</div>
          <div class="role-pill-item"><strong>Wardens:</strong> Review outing requests, assign rooms, approve maintenance dispatch orders.</div>
          <div class="role-pill-item"><strong>Security Personnel:</strong> Scan student QR gate passes at entry/exit points.</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header">
          ${icons.workflow} Standard Module Workflow
        </div>
        <div class="workflow-steps">
          <div class="workflow-step-item"><span class="step-num">1</span> Student selects room online & pays residential fee.</div>
          <div class="workflow-step-item"><span class="step-num">2</span> Student submits night-pass request via mobile portal.</div>
          <div class="workflow-step-item"><span class="step-num">3</span> Warden approves pass; parent receives automated alert.</div>
          <div class="workflow-step-item"><span class="step-num">4</span> Security scans pass at gate; system updates movement log.</div>
        </div>
      </div>
    </div>

    <div class="benefits-banner">
      <div class="benefits-header">
        ${icons.approval} Key Operational & Residential Benefits
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">🛡️ 100% Student Outing Audit Trail</div>
        <div class="benefit-card">⚡ Faster Maintenance SLA Turnaround</div>
        <div class="benefit-card">🍲 Zero Food Wastage via Meal Analytics</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>


  <!-- MODULE 4: STUDENT DISCIPLINARY MANAGEMENT SYSTEM -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">Module 04</span> Student Disciplinary Management System
    </div>
    <div class="meta">Conduct Governance & Hearing Administration</div>
  </div>

  <div class="module-container">
    <h2 class="module-title">
      ${icons.disciplinary} Module 04: Student Disciplinary Management System
    </h2>

    <h3 class="sub-title">4.1 Module Overview</h3>
    <div class="overview-box">
      <p>
        The <strong>Student Disciplinary Management System</strong> provides an unbiased, confidential, and legally compliant framework for managing student conduct incidents across the institution. Unstructured disciplinary handling often results in administrative liability, lack of documentation, and subjective penalties. Utilized by disciplinary committee members, student affairs deans, department heads, security officers, and students, this module guarantees fair due process, evidence security, committee hearing scheduling, and transparent sanction enforcement.
      </p>
    </div>

    <h3 class="sub-title">4.2 Objectives</h3>
    <div class="objectives-list">
      <div class="objective-item">
        ${icons.check} Establish uniform enforcement of institutional conduct codes across departments.
      </div>
      <div class="objective-item">
        ${icons.check} Provide secure, confidential logging of incident reports and attached evidence files.
      </div>
      <div class="objective-item">
        ${icons.check} Streamline disciplinary committee hearings, summons generation, and minutes logging.
      </div>
      <div class="objective-item">
        ${icons.check} Guarantee student due process through formal defense submissions and appeal portals.
      </div>
    </div>

    <h3 class="sub-title">4.3 Functionalities</h3>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.disciplinary} 4.3.1 Confidential Incident Reporting & Case Logging
      </div>
      <ul class="func-list">
        <li><strong>Multi-Source Incident Entry:</strong> Accepts reports logged by faculty, hostel wardens, security personnel, or peer grievance channels.</li>
        <li><strong>Digital Evidence Vault:</strong> Encrypts and securely attaches media, witness statements, CCTV references, and formal incident logs.</li>
        <li><strong>Severity Matrix Categorization:</strong> Categorizes infractions automatically (e.g., Minor Conduct Issue, Academic Dishonesty, Severe Policy Breach).</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.workflow} 4.3.2 Committee Hearing & Sanction Governance
      </div>
      <ul class="func-list">
        <li><strong>Automated Committee Hearing Scheduler:</strong> Assembles hearing panels, sends digital summons letters to students, and logs committee votes.</li>
        <li><strong>Sanction Tracking Engine:</strong> Monitors compliance deadlines for issued sanctions (e.g., written warnings, community service, suspension, fines).</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.reports} 4.3.3 Formal Appeals & Conduct Clearance
      </div>
      <ul class="func-list">
        <li><strong>Timed Student Appeals Portal:</strong> Allows students to submit structured appeal petitions within designated institutional timeframes.</li>
        <li><strong>Conduct Transcript Integration:</strong> Automatically checks disciplinary status before issuing bonafide certificates or graduation clearance.</li>
      </ul>
    </div>

    <div class="grid-2col">
      <div class="info-card">
        <div class="info-card-header">
          ${icons.faculty} User Roles & Access
        </div>
        <div class="role-pill-list">
          <div class="role-pill-item"><strong>Reporting Staff:</strong> File incident reports with initial evidence attachments.</div>
          <div class="role-pill-item"><strong>Disciplinary Committee:</strong> Review case files, conduct hearings, record votes, assign sanctions.</div>
          <div class="role-pill-item"><strong>Students:</strong> Receive formal summons, submit written defense statements, log appeal requests.</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header">
          ${icons.workflow} Standard Module Workflow
        </div>
        <div class="workflow-steps">
          <div class="workflow-step-item"><span class="step-num">1</span> Incident reported & evidence vault initialized.</div>
          <div class="workflow-step-item"><span class="step-num">2</span> Hearing scheduled; formal summons sent to student.</div>
          <div class="workflow-step-item"><span class="step-num">3</span> Hearing executed; committee records decision & sanction.</div>
          <div class="workflow-step-item"><span class="step-num">4</span> Student fulfills sanction or files appeal within timeline.</div>
        </div>
      </div>
    </div>

    <div class="benefits-banner">
      <div class="benefits-header">
        ${icons.approval} Key Governance & Compliance Benefits
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">⚖️ Zero Legal Exposure via Due Process</div>
        <div class="benefit-card">🔒 Encrypted Evidence Confidentiality</div>
        <div class="benefit-card">📋 Automated Graduation Clearance Check</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>


  <!-- MODULE 5: FACULTY WORK WALLET -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">Module 05</span> Faculty Work Wallet
    </div>
    <div class="meta">Contribution Tracking & Credit Governance</div>
  </div>

  <div class="module-container">
    <h2 class="module-title">
      ${icons.wallet} Module 05: Faculty Work Wallet
    </h2>

    <h3 class="sub-title">5.1 Module Overview</h3>
    <div class="overview-box">
      <p>
        The <strong>Faculty Work Wallet</strong> is an innovative credit tracking and institutional governance engine that quantifies, verifies, and rewards faculty contributions outside routine classroom teaching. Unrecorded extra duties (such as research publishing, conference organizing, committee leadership, and exam invigilation) often lead to subjective annual performance appraisals and faculty dissatisfaction. Interacted with by faculty members, department heads (HODs), portfolio deans, IQAC coordinators, and institutional leadership, this module provides an evidence-verified digital wallet for all academic and administrative contributions.
      </p>
    </div>

    <h3 class="sub-title">5.2 Objectives</h3>
    <div class="objectives-list">
      <div class="objective-item">
        ${icons.check} Quantify diverse faculty contributions using a standardized credit point system.
      </div>
      <div class="objective-item">
        ${icons.check} Streamline multi-tier verification (HOD, Dean, IQAC) for work claims.
      </div>
      <div class="objective-item">
        ${icons.check} Motivate academic performance through transparent badging and leaderboards.
      </div>
      <div class="objective-item">
        ${icons.check} Generate data-backed documentation for annual appraisals and NAAC/NBA accreditation.
      </div>
    </div>

    <h3 class="sub-title">5.3 Functionalities</h3>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.wallet} 5.3.1 Multi-Category Work Claim Submission Engine
      </div>
      <ul class="func-list">
        <li><strong>Evidence-Backed Work Submissions:</strong> Enables faculty to submit claims for research publications, grant approvals, workshop hosting, and committee service with document/photo proof.</li>
        <li><strong>Institutional Duty Issuance:</strong> Allows leadership to assign mandatory institutional duties directly to faculty wallets with predefined point values.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.approval} 5.3.2 Role-Based Multi-Tier Verification Routing
      </div>
      <ul class="func-list">
        <li><strong>Configurable Approval Hierarchy:</strong> Routes claims automatically to HODs (departmental duties), Deans (institutional portfolio), or IQAC (accreditation validity).</li>
        <li><strong>Audit Trail & Adjustments:</strong> Logs reviewer feedback, point adjustments, and approval timestamps for complete transparency.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.analytics} 5.3.3 Points Ledger, Badging & Appraisal Export
      </div>
      <ul class="func-list">
        <li><strong>Real-Time Credit Balance & Badges:</strong> Displays earned points balance and automatically awards achievement badges (e.g., "Research Master", "Institutional Leader").</li>
        <li><strong>One-Click NAAC/NBA Portfolio Export:</strong> Compiles verified faculty contribution portfolios directly into standardized accreditation formats.</li>
      </ul>
    </div>

    <div class="grid-2col">
      <div class="info-card">
        <div class="info-card-header">
          ${icons.faculty} User Roles & Access
        </div>
        <div class="role-pill-list">
          <div class="role-pill-item"><strong>Faculty Members:</strong> Submit work claims with evidence, view wallet points balance, track badges.</div>
          <div class="role-pill-item"><strong>HOD / Dean / IQAC:</strong> Review submitted claims, verify proof documents, approve point allocations.</div>
          <div class="role-pill-item"><strong>Principal / Super Admin:</strong> Define points policy matrix, audit institution-wide faculty performance.</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header">
          ${icons.workflow} Standard Module Workflow
        </div>
        <div class="workflow-steps">
          <div class="workflow-step-item"><span class="step-num">1</span> Faculty executes academic/admin duty & uploads evidence.</div>
          <div class="workflow-step-item"><span class="step-num">2</span> Claim routes to designated verification authority (HOD/Dean).</div>
          <div class="workflow-step-item"><span class="step-num">3</span> Reviewer approves claim; points credit to faculty wallet.</div>
          <div class="workflow-step-item"><span class="step-num">4</span> Wallet balance updates & syncs with annual appraisal portfolio.</div>
        </div>
      </div>
    </div>

    <div class="benefits-banner">
      <div class="benefits-header">
        ${icons.approval} Key Operational & Faculty Benefits
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">🏆 100% Objective Performance Appraisals</div>
        <div class="benefit-card">📄 One-Click NAAC/NBA Faculty Dossiers</div>
        <div class="benefit-card">🌟 High Faculty Motivation via Credit Badges</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>


  <!-- MODULE 6: FEE MANAGEMENT -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">Module 06</span> Fee Management System
    </div>
    <div class="meta">Financial Administration & Revenue Integrity</div>
  </div>

  <div class="module-container">
    <h2 class="module-title">
      ${icons.finance} Module 06: Fee Management System
    </h2>

    <h3 class="sub-title">6.1 Module Overview</h3>
    <div class="overview-box">
      <p>
        The <strong>Fee Management System</strong> is a enterprise financial administration engine designed to automate student fee structuring, multi-channel payment collection, installment tracking, automated tax receipting, and daily ledger reconciliation. Manual fee collection creates long physical queues, cash handling security risks, delayed revenue posting, and billing errors. Utilized by finance officers, campus accountants, leadership, students, and parents, this module provides a transparent, error-proof financial ecosystem that ensures 100% revenue integrity.
      </p>
    </div>

    <h3 class="sub-title">6.2 Objectives</h3>
    <div class="objectives-list">
      <div class="objective-item">
        ${icons.check} Automate complex, multi-component fee structures by course, batch, and quota.
      </div>
      <div class="objective-item">
        ${icons.check} Provide secure 24/7 online payment options (UPI, Cards, Net Banking) for parents.
      </div>
      <div class="objective-item">
        ${icons.check} Prevent over-billing or erroneous transactions via real-time balance validation.
      </div>
      <div class="objective-item">
        ${icons.check} Generate automated daily cashier collection summaries and accounting ledger posts.
      </div>
    </div>

    <h3 class="sub-title">6.3 Functionalities</h3>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.finance} 6.3.1 Flexible Fee Structure & Category Engine
      </div>
      <ul class="func-list">
        <li><strong>Multi-Component Structure Builder:</strong> Configures tuition, library, laboratory, hostel, transport, and exam fee templates per academic program.</li>
        <li><strong>Scholarships & Waiver Rules:</strong> Applies category-based discounts, government scholarships, and administrative fee waivers automatically.</li>
        <li><strong>Installment Schedule Configurator:</strong> Allows students to split annual fees into authorized installment milestone plans.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.workflow} 6.3.2 Multi-Channel Payments & Security Validation
      </div>
      <ul class="func-list">
        <li><strong>24/7 Digital Payment Gateway:</strong> Integrates major payment gateways for instant online payments via Credit Card, Debit Card, Net Banking, and UPI.</li>
        <li><strong>Server-Enforced Amount Validation:</strong> Prevents students from paying amounts exceeding their verified net outstanding balance.</li>
        <li><strong>Offline Counter Entry & DD Processing:</strong> Supports cashier entry for cash, Demand Drafts, and bank transfers with instant digital receipts.</li>
      </ul>
    </div>

    <div class="func-group">
      <div class="func-group-header">
        ${icons.reports} 6.3.3 Reconciliation, Dues Alerts & Financial Auditing
      </div>
      <ul class="func-list">
        <li><strong>Automated PDF Receipt & Parent Alerts:</strong> Delivers instant digital receipts via Email/SMS/WhatsApp upon payment clearance.</li>
        <li><strong>Cashier Daily Settlement Reports:</strong> Generates end-of-day cash counter reconciliation summaries and aging outstanding balance reports.</li>
      </ul>
    </div>

    <div class="grid-2col">
      <div class="info-card">
        <div class="info-card-header">
          ${icons.faculty} User Roles & Access
        </div>
        <div class="role-pill-list">
          <div class="role-pill-item"><strong>Students / Parents:</strong> View fee breakdown, pay online, download tax/fee receipts.</div>
          <div class="role-pill-item"><strong>Cashiers / Accountants:</strong> Process counter payments, reconcile bank transfers, audit ledgers.</div>
          <div class="role-pill-item"><strong>Finance Director:</strong> Define fee structures, approve waivers, monitor total revenue collections.</div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-header">
          ${icons.workflow} Standard Module Workflow
        </div>
        <div class="workflow-steps">
          <div class="workflow-step-item"><span class="step-num">1</span> Finance team configures fee structure & generates invoices.</div>
          <div class="workflow-step-item"><span class="step-num">2</span> Student/parent accesses billing portal & selects payment mode.</div>
          <div class="workflow-step-item"><span class="step-num">3</span> Payment processed; transaction verified by security engine.</div>
          <div class="workflow-step-item"><span class="step-num">4</span> PDF receipt issued & daily financial ledger updated automatically.</div>
        </div>
      </div>
    </div>

    <div class="benefits-banner">
      <div class="benefits-header">
        ${icons.approval} Key Financial & Administrative Benefits
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">🔒 Zero Over-Billing / Payment Errors</div>
        <div class="benefit-card">📲 24/7 Convenient Remote Payment</div>
        <div class="benefit-card">📊 Real-Time Daily Revenue Analytics</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>


  <!-- INTEGRATED SYSTEM VIEW -->
  <div class="doc-header">
    <div class="brand">
      <span class="brand-badge">EduSuite Pro</span> System Architecture & Institutional Synergy
    </div>
    <div class="meta">Integrated Governance Model</div>
  </div>

  <h1 class="section-title">
    ${icons.workflow} Integrated System Architecture & Organizational Impact
  </h1>
  <p style="font-size: 9.5pt; color: #475569; margin-bottom: 16px; line-height: 1.6;">
    While each of the six modules operates with specialized functional boundaries, collectively they form an interconnected administrative backbone for modern higher education institutions. The diagram and structural breakdown below explain how these modules support the complete institutional ecosystem without claiming non-existent code dependencies.
  </p>

  <div class="integrated-box">
    <h2>Institutional Synergy & Domain Coverage</h2>

    <div class="integrated-grid">
      <div class="integrated-card">
        <div class="integrated-card-title">${icons.ai} LMS - AI Embedded</div>
        <div class="integrated-card-desc">
          <strong>Academic Pillar:</strong> Drives classroom engagement, curriculum delivery, personalized student learning, and automated evaluation telemetry.
        </div>
      </div>

      <div class="integrated-card">
        <div class="integrated-card-title">${icons.alumni} Alumni (ALUMI)</div>
        <div class="integrated-card-desc">
          <strong>Advancement Pillar:</strong> Connects academic outcomes with long-term graduate legacy, placement mentorship, and institutional philanthropy.
        </div>
      </div>

      <div class="integrated-card">
        <div class="integrated-card-title">${icons.hostel} Hostel Management (HMS)</div>
        <div class="integrated-card-desc">
          <strong>Residential Operations:</strong> Safeguards student living environments, automates housing allocations, and monitors daily movement security.
        </div>
      </div>

      <div class="integrated-card">
        <div class="integrated-card-title">${icons.disciplinary} Disciplinary Management</div>
        <div class="integrated-card-desc">
          <strong>Campus Governance:</strong> Enforces ethical conduct guidelines, protects institutional safety, and ensures transparent due process.
        </div>
      </div>

      <div class="integrated-card">
        <div class="integrated-card-title">${icons.wallet} Faculty Work Wallet</div>
        <div class="integrated-card-desc">
          <strong>Faculty Performance:</strong> Quantifies non-teaching institutional duties, drives career appraisals, and simplifies accreditation dossiers.
        </div>
      </div>

      <div class="integrated-card">
        <div class="integrated-card-title">${icons.finance} Fee Management</div>
        <div class="integrated-card-desc">
          <strong>Financial Administration:</strong> Ensures financial sustainability, revenue integrity, 24/7 digital billing, and automated ledger auditing.
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: 25px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
    <h3 style="margin-top: 0; font-size: 11pt; color: #1e1b4b; display: flex; align-items: center; gap: 6px;">
      ${icons.approval} Summary of Institutional Governance Value
    </h3>
    <p style="font-size: 9pt; color: #475569; margin: 0; line-height: 1.6;">
      By deploying these six modules, an institution achieves complete digital transformation across its critical operational pillars—Academic Delivery, Residential Care, Conduct Compliance, Faculty Management, Graduate Advancement, and Financial Stewardship. The unified design ensures high operational efficiency, transparent compliance, and a superior experience for students, faculty, and administrators.
    </p>
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log("Launching Edge headless browser...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set HTML content
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, 'EduSuite_Pro_Enterprise_Documentation.pdf');

  console.log("Generating PDF artifact...");
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; font-size: 8px; font-family: 'Plus Jakarta Sans', sans-serif; color: #94a3b8; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center;">
        <span><strong>EduSuite Pro</strong> | Enterprise System Documentation</span>
        <span>Confidential</span>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 8px; font-family: 'Plus Jakarta Sans', sans-serif; color: #94a3b8; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center;">
        <span>Module Architecture & Capability Reference</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();
  console.log(`PDF successfully created at: ${pdfPath}`);
}

generatePDF().catch(err => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
