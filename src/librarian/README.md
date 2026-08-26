# Librarian ERP Module — Master Documentation (Pin-to-Pin A to Z Guide)

## Overview
The **Librarian ERP Module** is a comprehensive, enterprise-grade Library Management System designed for higher education institutions. It provides end-to-end management of physical book catalogs, digital e-resources, student/faculty circulation workflows, automated fine collection, ID card printing & approvals, gate entry logging, reading hall seat tracking, and system audit trails.

---

## Central Architecture & Data Flow

### 1. Master Single Source of Truth (`useLibraryStore`)
All data operations, state transitions, and business logic are managed by the centralized `LibraryStoreProvider` reducer state located in `src/librarian/store/index.tsx`.
- **Context Provider**: `LibraryStoreProvider`
- **Hook Access**: `useLibraryStore()`
- **Local Storage Persistence**: Automatically persists all user modifications to browser storage under key `EDUSUITE_LIBRARY_STORE_V1`.

### 2. URL-Driven Tab Routing (`useLibrarianTab`)
Tab navigation is synchronized with TanStack Router URLs via `LibrarianTabProvider` in `src/librarian/context/index.tsx`.
- **Context Provider**: `LibrarianTabProvider`
- **Hook Access**: `useLibrarianTab()`
- **Route Mapping**: Every tab maps directly to a TanStack sub-route under `/librarian/*`.

---

## Complete Module & Function Reference (A to Z)

| Sub-Module | URL Route | Key Responsibilities & Functions | Search & Filter Capabilities |
| :--- | :--- | :--- | :--- |
| **Console Overview** | `/librarian/dashboard` | Main operational dashboard displaying live KPIs (Total Books, Active Loans, Overdue Items, Fines Collected, Active Members), recent circulation activity ledger, and quick-action shortcuts. | N/A |
| **Book Management** | `/librarian/books` | Complete physical book catalog management. Supports adding new titles (`ADD_BOOK`), updating details (`UPDATE_BOOK`), deleting records (`DELETE_BOOK`), and initiating 1-click book issuing to members. | Multi-field search (Title, Author, ISBN, Rack), Category Pill filter (CS, Mechanical, ECE, General), Grid vs. List view toggler. |
| **MARC21 Cataloging** | `/librarian/catalog` | Advanced bibliographic cataloging using international MARC21 standards. Manages control fields (008), ISBN (020), Author (100), Title (245), Imprint (260), Physical Description (300), and Subject Headings (650). Auto-generates Dewey Decimal call numbers. | MARC tag filter, Accession No search. |
| **Book Acquisition** | `/librarian/acquisition` | Procurement & book acquisition lifecycle management. Tracks Purchase Orders (PO-2026-*), vendor profiles (Pearson, Oxford, McGraw-Hill), invoice amounts, and order statuses (*Ordered, In Inspection, Cataloged*). | Order status filter, Vendor search, PO No search. |
| **Physical Inventory** | `/librarian/inventory` | Bi-annual stock verification & physical inventory audit. Supports barcode scanner entry to tally scanned physical books against central records. Calculates verified vs. missing book ratios. | Audit Session filter, Verification status filter. |
| **Issue Books Desk** | `/librarian/issue-books` | Issue processing desk. Performs automated eligibility checks (`canIssueBook`: active member status, zero unpaid fines, borrowing capacity limit, available stock). Auto-calculates loan duration and due dates. | Member Roll No / ID auto-lookup, Book ISBN / Title barcode search. |
| **Return Books Desk** | `/librarian/return-books` | Return desk & loan clearance processing (`RETURN_BOOK`). Features a barcode scanner for active loan lookup, book physical condition selection (*Good, Slightly Worn, Damaged, Lost*), fine auto-calculation for overdue days, and instant inventory restoration. | Barcode / Issue ID / Roll No scanner query. |
| **Advanced Circulation** | `/librarian/circulation` | Central active loan registry and policy execution. Supports 1-click loan renewal (`RENEW_BOOK`), overdue fine accrual tracking, and role-based loan duration rules (Students vs. Faculty). | Member Name search, Overdue status filter. |
| **Book Reservations** | `/librarian/reservations` | Hold & reservation queue management (`PLACE_RESERVATION`, `CANCEL_RESERVATION`). Assigns automated queue positions (`#1`, `#2`), enforces hold expiration windows, and dispatches pickup notifications upon book return. | Reservation status filter, Member Roll No search. |
| **Reading Hall** | `/librarian/reading-hall` | Live reading hall & seat occupancy monitoring (`SEED_SEATS`). Visualizes seat allocations across Silent Study, Digital Hall, and Discussion zones. Tracks entry timestamps, exit timestamps, and occupancy duration. | Zone filter, Seat status filter (*Occupied, Available, Reserved*). |
| **Gate Entry Log** | `/librarian/entry` | Barcode & RFID gate entry logger for student and visitor tracking (`SEED_ENTRY_LOGS`). Displays live building headcounts, visit purposes (*Reading, Book Issue, Internet Access*), and timestamped entry/exit logs. | Roll No search, Gate ID filter, Purpose filter. |
| **Members Directory** | `/librarian/members` | Student & Faculty library membership directory (`SEED_MEMBERS`). Displays active loans count, total fines due, and membership status. Features a detailed Member Profile modal with complete borrowing history. | Member Name / Roll No search, Branch filter (CSE, ECE, MECH, CIVIL, AI&ML), Member Type filter (*Student, Faculty*). |
| **ID Card Management** | `/librarian/id-cards` | Student & Staff Library ID Card issuance and physical handover workflow. Supports 1-click approval (`APPROVE_ID_CARD`), rejection with custom reasons (`REJECT_ID_CARD_APPROVAL`), physical handover confirmation (`CONFIRM_PHYSICAL_HANDOVER`), and custom template branding (Front border accent, back gradient theme, institution address, usage instructions). Includes a dual-sided printable card modal. | Approval status filter (*Pending, Approved, Rejected*), Handover status filter, Roll No search. |
| **Digital E-Resources** | `/librarian/digital` | E-Journals, IEEE/Springer research papers, and eBooks portal (`SEED_DIGITAL`). Features AI Semantic Search toggle, download counters, and institutional access level badges (*Campus Only, Global*). | Multi-checkbox field search (Title, Author, Subject, Department, Semester, ISBN, Keywords), Category filter. |
| **Fines & Dues** | `/librarian/fines` | Central fine collection ledger (`COLLECT_FINE`). Manages unpaid fine records, payment processing (Cash, UPI, Online Receipt), fine waivers, and printable fee clearance receipts. | Fine status filter (*Unpaid, Paid, Waived*), Member Roll No search. |
| **Circulation Reports** | `/librarian/reports` | Executive circulation analytics & trends. Displays monthly issue statistics, department-wise borrowing breakdown, top borrowed titles, and timescale selectors (3-Month, 5-Month). Exports reports to CSV. | Timescale selector, Department filter, Export format. |
| **Notifications & Alerts** | `/librarian/notifications` | Automated reminder dispatch system (`SEED_NOTIFICATIONS`). Broadcasts overdue alerts and pickup notifications via WhatsApp, SMS, and Email channels. | Notification type filter (*Overdue, Due Date, Reservation Ready*), Channel filter. |
| **System Audit Logs** | `/librarian/audit-logs` | Immutable security audit trails (`SEED_AUDIT_LOGS`). Logs every system action with User ID, Role, Action Type, Detailed Description, Timestamp, and IP Address. | Module filter, Action type filter, Search query. |
| **Global OPAC Search** | `/librarian/search` | Universal Online Public Access Catalog (OPAC) search engine. Provides real-time availability status, shelf rack locations, and reservation shortcuts across all library titles. | Cross-field universal query (Title, Author, Subject, Accession No, ISBN). |
| **Library Settings** | `/librarian/settings` | Policy & configuration control panel (`SEED_SETTINGS`). Configures Student/Faculty max book limits, default loan duration, daily overdue fine rates, grace period days, and reservation hold validity. | N/A |

---

## State Reducer Action Types Reference

All business logic actions dispatched via `dispatch({ type: ACTION_NAME, payload: ... })`:

1. **`ADD_BOOK`**: Registers a new physical book into `state.books` with auto-generated Accession No and Barcode.
2. **`UPDATE_BOOK`**: Updates metadata or copy quantities for an existing book.
3. **`DELETE_BOOK`**: Soft/Hard removes a book record from catalog.
4. **`ISSUE_BOOK`**: Validates eligibility, decrements available copies, creates an active loan record in `state.issues`, and logs an audit trail.
5. **`RETURN_BOOK`**: Clears loan record, updates condition rating, calculates fine if overdue, restores available copies, and updates member profile.
6. **`RENEW_BOOK`**: Extends loan due date by configured duration and increments renewal counter.
7. **`PLACE_RESERVATION`**: Adds member to book hold queue and updates queue positions.
8. **`CANCEL_RESERVATION`**: Cancels pending hold and re-sequences remaining queue positions.
9. **`COLLECT_FINE`**: Marks fine record as paid, updates paid amount, and clears dues from member profile.
10. **`APPROVE_ID_CARD`**: Approves pending ID card request, generates card record, and flags physical handover.
11. **`REJECT_ID_CARD_APPROVAL`**: Rejects card request with specified reason and logs audit record.
12. **`CONFIRM_PHYSICAL_HANDOVER`**: Confirms student receipt of printed physical ID card.
13. **`UPDATE_CARD_BRANDING`**: Saves custom ID card template branding (colors, address, instructions).
14. **`ADD_AUDIT_LOG`**: Appends a security audit entry to `state.auditLogs`.

---

## File Structure

```text
src/librarian/
├── components/
│   ├── basic-views.tsx          # Basic / Legacy view wrappers
│   ├── dashboard.tsx            # Master Librarian Dashboard & Tab Renderer
│   └── enterprise-views.tsx     # Enterprise sub-module views (Catalog, Acquisition, ID Cards, etc.)
├── context/
│   └── index.tsx                # LibrarianTabProvider, getTabFromPathname, TAB_ROUTE_MAP
├── services/
│   └── index.ts                 # External API wrappers & utility functions
├── store/
│   └── index.tsx                # LibraryStoreProvider, libraryReducer, INITIAL_STATE, LocalStorage persistence
├── types/
│   └── index.ts                 # Master TypeScript interfaces (Book, Member, IssueRecord, FineRecord, etc.)
├── index.ts                     # Central barrel export for all components and stores
└── README.md                    # Master Documentation (This file)
```
