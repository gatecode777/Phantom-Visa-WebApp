# Phantom Visa OS — Enterprise Visa Operating System

**Phantom Visa OS** is a full-stack, multi-tenant B2B visa management and operations platform designed for travel agencies, corporate aggregators, consular bureaus, and applicants. It centralizes visa application lifecycle management, document verification, multi-currency payment processing, agent workload management, and reporting into a unified enterprise interface.

---

## 🏛️ System Architecture & Technology Stack

### 1. Frontend Architecture
- **Framework & Runtime**: React 18 with TypeScript, Vite build tool, React Router v6.
- **Styling**: TailwindCSS with custom design tokens, Outfit & Inter typography, responsive layouts.
- **Icons & Visuals**: Lucide React icon suite, custom SVG world map datasets.
- **State Management**: Centralized `VisaContext` providing reactive state synchronization, session persistence in `localStorage`, role switching, and dynamic API querying.
- **Authentication**: Passwordless phone OTP authentication node (`libphonenumber-js` E.164 formatting & validation, rate-limiting, and automatic session tokens).

### 2. Backend Architecture
- **Runtime**: Node.js with TypeScript (`tsc`), Express.js REST API with `/api/v1` namespace.
- **Database**: MongoDB with Mongoose ORM, connection management via Mongoose singleton, atomic transactions, and sequential sequence generators (`Counter`).
- **Security & Tokens**: Dual-token architecture (RS256/HS256 15-minute Access Tokens + 30-day SHA-256 hashed Refresh Tokens stored in HTTP-Only cookies and MongoDB).
- **Error Handling**: Standardized API response envelopes (`formatSuccessEnvelope` and `formatErrorEnvelope`).

---

## 📊 Core Data Models (`backend/src/models`)

| Model | File | Description |
| :--- | :--- | :--- |
| **`Application`** | [`Application.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Application.ts) | Core application record (Application ID `VO-YYYY-XXXX`, applicant details, passport, visa type, status, assigned agent, fees, notes). |
| **`Applicant`** | [`Applicant.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Applicant.ts) | Applicant master record with personal info, passport details, address, travel history, uploaded documents, and KYC status. |
| **`Agent`** | [`Agent.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Agent.ts) | Registered agency/agent profile (`AGT-XXXX`, company name, contact info, commission tier, active status, workload capacity). |
| **`User`** | [`User.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/User.ts) | System user identity across roles (`Admin`, `Agent`, `Staff`, `Applicant`) with phone, email, 2FA flag, and designation. |
| **`Transaction`** | [`Transaction.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Transaction.ts) | Financial transactions (Payments, refunds, wallet deductions, GST tax calculations, gateway references). |
| **`Appointment`** | [`Appointment.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Appointment.ts) | Consular appointments (Biometrics, document drop-off, interviews, rescheduling). |
| **`Country`** | [`Country.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Country.ts) | Destination countries with ISO codes, flags, currency, active visa programs, and regional settings. |
| **`VisaCategory`** | [`VisaCategory.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/VisaCategory.ts) | Visa categories (Tourist, Business, Student, Transit, Employment). |
| **`VisaType`** | [`VisaType.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/VisaType.ts) | Granular visa products with validity duration, entry types, standard/express processing times, and base pricing. |
| **`VisaRequirement`**| [`VisaRequirement.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/VisaRequirement.ts) | Mandatory & optional document requirements per country/visa category. |
| **`DocumentTemplate`**| [`DocumentTemplate.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/DocumentTemplate.ts) | Official document templates, checklist guidelines, and sample uploads. |
| **`CompanyProfile`** | [`CompanyProfile.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/CompanyProfile.ts) | Organization branding, legal name, GSTIN, registered address, invoice headers. |
| **`SupportTicket`** | [`SupportTicket.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/SupportTicket.ts) | Internal and customer support desk ticketing with threaded messages, attachments, and priorities. |
| **`SystemSetting`** | [`SystemSetting.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/SystemSetting.ts) | Global platform configurations (maintenance mode, currency exchange rates, notification webhooks). |
| **`RefreshToken`** | [`RefreshToken.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/RefreshToken.ts) | Hashed refresh tokens for secure multi-device session management and revocations. |
| **`ActivityLog`** | [`ActivityLog.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/ActivityLog.ts) | Comprehensive audit trail logging every administrative, agent, and user action. |
| **`Counter`** | [`Counter.ts`](file:///e:/data/Softwares/phantom-visa/backend/src/models/Counter.ts) | Atomic sequence incrementer for generating standardized IDs (`VO-YYYY-XXXX`, `AGT-XXXX`, `APP-XXXX`). |

---

## 🌐 API Route Specifications (`backend/src/routes`)

| Namespace | Base Route | Key Operations |
| :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | `/verify-phone`, `/send-otp`, `/verify-otp`, `/refresh-token`, `/logout`, `/sessions` |
| **Applications** | `/api/v1/applications` | `GET /` (scoped by `agentId`, `pool=available`, `status`), `POST /`, `GET /:id`, `PUT /:id/status`, `PUT /:id/assign` |
| **Applicant** | `/api/v1/applicant` | `/profile`, `/documents`, `/applications`, `/apply-visa`, `/invoices`, `/track` |
| **Agent** | `/api/v1/agent` | `/all`, `/active`, `/pending-approval`, `/performance`, `/workload`, `/assign` |
| **Admin** | `/api/v1/admin` | `/dashboard-stats`, `/impersonate`, `/users`, `/reports`, `/activity-logs` |
| **Visa Configuration** | `/api/v1/visa` | `/categories`, `/types`, `/requirements`, `/processing-times`, `/fees` |
| **Country** | `/api/v1/country` | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` |
| **Finance** | `/api/v1/finance` | `/transactions`, `/invoices`, `/revenue`, `/daily-reports`, `/monthly-reports` |
| **Appointments** | `/api/v1/appointments` | `GET /`, `POST /book`, `PUT /:id/reschedule`, `PUT /:id/cancel`, `PUT /:id/complete` |
| **Support** | `/api/v1/support` | `GET /tickets`, `POST /tickets`, `POST /tickets/:id/messages`, `PUT /:id/resolve` |
| **System** | `/api/v1/system` | `GET /settings`, `PUT /settings`, `POST /backup`, `POST /restore` |

---

## 👥 Role Portals & Workflows

### 1. Super Admin Portal (`/admin`)
- **Global Operations Center**: Comprehensive view of all platform applications, system revenue, agency performance, and server health.
- **Master Data Controls**: Configuration of Destination Countries, Visa Categories, Types, Fees, Document Templates, and Rule Matrices.
- **Agency Governance**: Approval and KYC audit workflows for newly registered agencies (`AGT-XXXX`).
- **Audit & Compliance**: Full access to immutable Activity Logs, Login Audit trails, and financial ledgers.

### 2. Agent Portal (`/agent`)
- **Scoped Workload Queue**: Automatic server-side isolation ensuring agents exclusively view and manage their assigned visa applications (`agentId`).
- **Available Pickup Pool**: Dedicated tab for unassigned applications allowing agents to claim cases directly into their queue.
- **Application Processing**: Document verification, status updates (`Submitted` &rarr; `Under Review` &rarr; `Approved` / `Rejected` &rarr; `Completed`), internal remarks, and client correspondence.
- **Commission & Performance**: Real-time commission earnings tracking, processing efficiency stats, and agency profile management.

### 3. Customer / Applicant Portal (`/dashboard`)
- **Self-Service Application Wizard**: Step-by-step visa application filing, passport scanning, and document upload.
- **Live Status Tracking**: Real-time timeline view across verification, review, and final visa grant.
- **Digital Vault**: Secure storage for passport copies, financial statements, travel itineraries, and issued visas.
- **Invoicing & Payments**: Instant GST invoice generation and online payment records.

### 4. Consular Staff Portal (`/staff`)
- **Document & KYC Verification Queue**: Specialized intake audit for identity documents, bank solvency certificates, and employment letters.
- **Checklist Approvals**: Verification checkoffs before advancing applications to reviewer decision stages.

---

## 🔒 Security & Data Integrity Highlights

1. **Server-Side Workload Isolation**: Agents are strictly bounded by their `assignedAgentId` at the database query layer.
2. **Mutually Exclusive Status Taxonomy**: Clean separation across 5 core lifecycle statuses (`Submitted`, `Under Review`, `Approved`, `Rejected`, `Completed`) ensuring all metric cards sum strictly to the total application count.
3. **Identity Verification & Anti-Collision**: Unique passport numbers mapped to validated applicant identities with zero placeholder contamination.
4. **Passwordless OTP Resilience**: E.164 international phone number normalization with automated role mapping and fallback provisioning.
5. **Zero-Fallback Data Protocol**: Complete removal of hardcoded mock records and synthetic fallback arrays across all 30+ management views, services, and contexts. When database collections are empty, the entire UI dynamically reflects 0 counts and clean empty states with no phantom data.
