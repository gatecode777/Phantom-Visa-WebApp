# PHANTOM VISA OS — ENTITY RELATIONSHIP DIAGRAM (ERD)

This document contains the living Mermaid Entity Relationship Diagrams across all **13 domains** in PHANTOM VISA OS.

---

## 1. Identity & Access Control Domain

```mermaid
erDiagram
    COMPANIES ||--o{ USERS : "belongs to"
    USERS ||--o{ USER_ROLES : "assigned"
    ROLES ||--o{ USER_ROLES : "granted"
    ROLES ||--o{ ROLE_PERMISSIONS : "contains"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "defines"
    USERS ||--o{ SESSIONS : "establishes"
    SESSIONS ||--o{ REFRESH_TOKENS : "issues"
    USERS ||--o{ OTP_CODES : "receives"
    USERS ||--o{ MFA_DEVICES : "registers"
    USERS ||--o{ PASSWORD_RESETS : "requests"
    USERS ||--o{ SOCIAL_ACCOUNTS : "links"
    USERS ||--o{ AUDIT_LOGS : "triggers"

    USERS {
        uuid id PK
        uuid company_id FK
        string email
        string password_hash
        string encrypted_passport_number
        string encrypted_bank_details
        boolean is_active
        boolean is_mfa_enabled
    }
    ROLES {
        uuid id PK
        uuid company_id FK
        string name
        string slug
    }
    AUDIT_LOGS {
        uuid id PK
        uuid company_id FK
        uuid actor_id FK
        string action
        jsonb payload
    }
```

---

## 2. Company & Tenant Domain

```mermaid
erDiagram
    SUBSCRIPTION_PLANS ||--o{ COMPANIES : "gates"
    COMPANIES ||--o1 COMPANY_KYC : "verifies"
    COMPANIES ||--o{ COMPANY_SUBSCRIPTIONS : "subscribes"
    COMPANIES ||--o1 COMPANY_BRANDING : "styles"
    COMPANIES ||--o1 WHITE_LABEL_CONFIGS : "configures BYO"
    COMPANIES ||--o{ COMPANY_DOMAINS : "owns"
    COMPANIES ||--o{ COMPANY_SETTINGS : "stores"

    SUBSCRIPTION_PLANS {
        uuid id PK
        string name
        int tier_level
        numeric monthly_price
        jsonb features
    }
    WHITE_LABEL_CONFIGS {
        uuid id PK
        uuid company_id FK
        boolean byo_smtp_enabled
        boolean byo_payment_enabled
        boolean byo_sms_enabled
    }
```

---

## 3. Visa Catalog Domain

```mermaid
erDiagram
    COUNTRIES ||--o{ VISA_TYPES : "offers"
    VISA_TYPES ||--o{ VISA_REQUIREMENTS : "defines"
    NATIONALITIES ||--o{ VISA_REQUIREMENTS : "applies to"
    VISA_TYPES ||--o{ VISA_PROCESSING_TIMES : "estimates"
    VISA_TYPES ||--o{ VISA_FEES : "charges"
    COUNTRIES ||--o{ COUNTRY_ADVISORIES : "publishes"

    VISA_TYPES {
        uuid id PK
        uuid country_id FK
        string title
        string category
        int max_stay_days
    }
    VISA_FEES {
        uuid id PK
        uuid visa_type_id FK
        numeric government_fee
        numeric platform_fee
    }
```

---

## 4. Applications & Lifecycle Domain

```mermaid
erDiagram
    USERS ||--o{ APPLICATIONS : "submits"
    VISA_TYPES ||--o{ APPLICATIONS : "targets"
    APPLICATIONS ||--o{ APPLICATION_STATUS_HISTORY : "tracks"
    APPLICATIONS ||--o{ APPLICATION_TIMELINE_EVENTS : "logs"
    APPLICATIONS ||--o{ APPLICATION_ASSIGNEES : "assigned staff"
    APPLICATIONS ||--o{ APPLICATION_DOCUMENTS : "requires"
    APPLICATIONS ||--o{ APPLICATION_FLAGS : "triggers SLA flags"

    APPLICATIONS {
        uuid id PK
        uuid company_id FK
        string application_number
        string status
        timestamp sla_target_at
        int version
    }
```

---

## 5. Documents & OCR Domain

```mermaid
erDiagram
    DOCUMENTS ||--o1 DOCUMENT_VERIFICATIONS : "verifies"
    DOCUMENTS ||--o1 OCR_EXTRACTIONS : "extracts"
    DOCUMENTS ||--o1 MRZ_DATA : "parses"
    DOCUMENTS ||--o1 DOCUMENT_QUALITY_SCORES : "evaluates"

    DOCUMENTS {
        uuid id PK
        uuid company_id FK
        string file_name
        string storage_path
    }
    MRZ_DATA {
        uuid id PK
        uuid document_id FK
        string document_number
        date expiry_date
        boolean checksum_valid
    }
```

---

## 6. AI Consular & Verification Domain

```mermaid
erDiagram
    USERS ||--o{ AI_CHAT_SESSIONS : "opens"
    AI_CHAT_SESSIONS ||--o{ AI_CHAT_MESSAGES : "contains"
    APPLICATIONS ||--o{ AI_RECOMMENDATIONS : "receives"
    DOCUMENTS ||--o{ AI_VERIFICATION_RESULTS : "scans for tamper"

    AI_CHAT_MESSAGES {
        uuid id PK
        uuid session_id FK
        string sender
        text message_text
    }
```

---

## 7. CRM Domain

```mermaid
erDiagram
    PIPELINES ||--o{ PIPELINE_STAGES : "contains"
    LEADS ||--o{ TASKS : "schedules"
    LEADS ||--o{ MEETINGS : "arranges"
    LEADS ||--o{ NOTES : "records"

    LEADS {
        uuid id PK
        uuid company_id FK
        string contact_name
        string status
    }
```

---

## 8. Finance & Wallet Domain (Append-Only)

```mermaid
erDiagram
    COMPANIES ||--o1 WALLETS : "holds"
    WALLETS ||--o{ WALLET_TRANSACTIONS : "append-only log"
    WALLETS ||--o{ WALLET_RECHARGES : "recharges"
    COMPANIES ||--o{ INVOICES : "issues"
    INVOICES ||--o{ INVOICE_LINE_ITEMS : "details"
    APPLICATIONS ||--o{ REFUNDS : "initiates"

    WALLETS {
        uuid id PK
        uuid company_id FK
        numeric balance
        numeric credit_limit
    }
    WALLET_TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        numeric signed_amount
        numeric balance_after
    }
    REFUNDS {
        uuid id PK
        numeric amount
        boolean requires_maker_checker
        uuid initiated_by FK
        uuid approved_by FK
    }
```

---

## 9. Notifications Domain

```mermaid
erDiagram
    NOTIFICATION_TEMPLATES ||--o{ NOTIFICATION_LOGS : "formats"
    USERS ||--o1 NOTIFICATION_PREFERENCES : "configures"
    USERS ||--o{ PUSH_TOKENS : "registers"
```

---

## 10. HR Domain

```mermaid
erDiagram
    DEPARTMENTS ||--o{ EMPLOYEES : "groups"
    EMPLOYEES ||--o{ PAYSLIPS : "receives"
    EMPLOYEES ||--o{ LEAVE_REQUESTS : "submits"
```

---

## 11. Reports & Pre-Aggregated Analytics Domain

```mermaid
erDiagram
    REPORT_DEFINITIONS ||--o{ REPORT_SCHEDULES : "schedules"
    REPORT_SCHEDULES ||--o{ REPORT_RUNS : "executes"
    COMPANIES ||--o{ ANALYTICS_SNAPSHOTS : "caches 5-min snapshot"
```

---

## 12. API Marketplace & Integrations Domain

```mermaid
erDiagram
    COMPANIES ||--o{ API_KEYS : "generates"
    API_KEYS ||--o{ API_USAGE_LOGS : "logs"
    COMPANIES ||--o{ WEBHOOK_SUBSCRIPTIONS : "configures"
    COMPANIES ||--o{ INTEGRATION_CONFIGS : "connects BYO"
```

---

## 13. Super Admin & Platform Control Domain

```mermaid
erDiagram
    USERS ||--o{ PLATFORM_AUDIT_LOGS : "super admin actions"
    FEATURE_FLAGS ||--o{ COMPANIES : "percentage rollout"
    SUPER_ADMIN ||--o{ IMPERSONATION_LOGS : "30-min auto expire session"
```
