-- PHANTOM VISA OS — DATABASE SCHEMA SOURCE OF TRUTH
-- Version: 1.0.0
-- Database: PostgreSQL 15+
-- Total Tables: ~104 tables across 13 domains

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================================
-- DOMAIN 1: IDENTITY & ACCESS CONTROL (12 Tables)
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    encrypted_passport_number TEXT,
    encrypted_bank_details TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    family_id UUID NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mfa_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    ip_address VARCHAR(45),
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Partition audit_logs for sample range
CREATE TABLE audit_logs_y2026m07 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-07-01 00:00:00') TO ('2026-08-01 00:00:00');

-- ============================================================================
-- DOMAIN 2: COMPANY / TENANT (9 Tables)
-- ============================================================================

CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL, -- Starter, Growth, Enterprise
    tier_level INT NOT NULL,
    monthly_price NUMERIC(12,2) NOT NULL,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    subscription_plan_id UUID REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    status VARCHAR(50) DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_kyc (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    tax_id VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE RESTRICT,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#0A111E',
    accent_color VARCHAR(20) DEFAULT '#D4AF37',
    font_family VARCHAR(100) DEFAULT 'Inter',
    custom_css TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE white_label_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    byo_smtp_enabled BOOLEAN DEFAULT FALSE,
    smtp_host VARCHAR(255),
    smtp_port INT,
    smtp_user VARCHAR(255),
    smtp_pass_encrypted TEXT,
    byo_payment_enabled BOOLEAN DEFAULT FALSE,
    stripe_public_key VARCHAR(255),
    stripe_secret_encrypted TEXT,
    byo_sms_enabled BOOLEAN DEFAULT FALSE,
    twilio_sid VARCHAR(255),
    twilio_token_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    domain VARCHAR(255) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    ssl_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_company_setting UNIQUE(company_id, setting_key)
);

CREATE TABLE company_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    doc_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOMAIN 3: VISA CATALOG (8 Tables)
-- ============================================================================

CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iso_code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE nationalities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iso_code VARCHAR(3) UNIQUE NOT NULL,
    demonym VARCHAR(100) NOT NULL
);

CREATE TABLE visa_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Tourist, Business, Student, Work
    max_stay_days INT NOT NULL,
    validity_days INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visa_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
    nationality_id UUID REFERENCES nationalities(id) ON DELETE RESTRICT,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visa_processing_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
    standard_days INT NOT NULL,
    express_days INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visa_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
    government_fee NUMERIC(12,2) NOT NULL,
    platform_fee NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE country_advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    advisory_level VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visa_type_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_type_id UUID REFERENCES visa_types(id) ON DELETE CASCADE,
    document_name VARCHAR(150) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- DOMAIN 4: APPLICATIONS (11 Tables)
-- ============================================================================

CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    application_number VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    visa_type_id UUID REFERENCES visa_types(id) ON DELETE RESTRICT,
    traveler_name VARCHAR(255) NOT NULL,
    passport_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, submitted, under_review, additional_docs_required, approved, rejected, completed
    sla_target_at TIMESTAMPTZ NOT NULL,
    version INT DEFAULT 1, -- Optimistic locking column
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE applications_y2026m07 PARTITION OF applications
    FOR VALUES FROM ('2026-07-01 00:00:00') TO ('2026-08-01 00:00:00');

CREATE TABLE application_status_history (
    id UUID DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    company_id UUID NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE application_status_history_y2026m07 PARTITION OF application_status_history
    FOR VALUES FROM ('2026-07-01 00:00:00') TO ('2026-08-01 00:00:00');

CREATE TABLE application_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_assignees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    staff_user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    doc_key VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, verified, needs_review
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_complete BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    flag_type VARCHAR(100) NOT NULL, -- SLA_WARNING_80, SLA_BREACH_100, HIGH_RISK
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    tag VARCHAR(50) NOT NULL
);

CREATE TABLE application_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    decision VARCHAR(50) NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOMAIN 5: DOCUMENTS & OCR (7 Tables)
-- ============================================================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE document_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    is_valid BOOLEAN NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb,
    verified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ocr_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    ocr_provider VARCHAR(50) NOT NULL, -- AWS_TEXTRACT, GOOGLE_VISION
    raw_response JSONB NOT NULL,
    extracted_fields JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mrz_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    document_number VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    expiry_date DATE NOT NULL,
    issuing_country VARCHAR(3) NOT NULL,
    nationality VARCHAR(3) NOT NULL,
    checksum_valid BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_quality_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    blur_score NUMERIC(5,2) NOT NULL,
    glare_score NUMERIC(5,2) NOT NULL,
    overall_quality VARCHAR(20) NOT NULL
);

CREATE TABLE duplicate_detection_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    matched_document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    similarity_score NUMERIC(5,4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOMAIN 6: AI LAYER (6 Tables)
-- ============================================================================

CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_title VARCHAR(255) DEFAULT 'Consular Assistance',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- user, assistant, system
    message_text TEXT NOT NULL,
    intent VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    recommendation_type VARCHAR(100) NOT NULL,
    recommendation_text TEXT NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_verification_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    is_tampered BOOLEAN NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL,
    anomaly_flags JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE ai_approval_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL,
    predicted_outcome VARCHAR(50) NOT NULL,
    probability NUMERIC(5,4) NOT NULL,
    risk_factors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    version_tag VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOMAIN 7: CRM (9 Tables)
-- ============================================================================

CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL
);

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    source_id UUID REFERENCES lead_sources(id) ON DELETE SET NULL,
    stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL
);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    scheduled_for TIMESTAMPTZ NOT NULL,
    is_done BOOLEAN DEFAULT FALSE
);

-- ============================================================================
-- DOMAIN 8: FINANCE & WALLET (13 Tables) - Append-Only Wallet Safety
-- ============================================================================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID UNIQUE NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    balance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    credit_limit NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- APPEND-ONLY TABLE
CREATE TABLE wallet_transactions (
    id UUID DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT,
    company_id UUID NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- RECHARGE, VISA_DEBIT, REFUND, PAYOUT
    signed_amount NUMERIC(14,2) NOT NULL,
    balance_after NUMERIC(14,2) NOT NULL,
    reference_id VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE wallet_transactions_y2026m07 PARTITION OF wallet_transactions
    FOR VALUES FROM ('2026-07-01 00:00:00') TO ('2026-08-01 00:00:00');

CREATE TABLE wallet_recharges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE RESTRICT,
    amount NUMERIC(14,2) NOT NULL,
    payment_gateway_ref VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount NUMERIC(14,2) NOT NULL,
    tax_amount NUMERIC(14,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'issued',
    issued_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE RESTRICT,
    description VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INT NOT NULL,
    line_total NUMERIC(14,2) NOT NULL
);

CREATE TABLE gst_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE RESTRICT,
    gstin VARCHAR(15) NOT NULL,
    cgst NUMERIC(12,2) NOT NULL,
    sgst NUMERIC(12,2) NOT NULL,
    igst NUMERIC(12,2) NOT NULL
);

CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    application_id UUID NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    requires_maker_checker BOOLEAN DEFAULT TRUE,
    initiated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    approved_by UUID REFERENCES users(id) ON DELETE RESTRICT, -- Must be different user if > threshold
    status VARCHAR(50) DEFAULT 'pending_approval', -- pending_approval, approved, executed, rejected
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commission_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    percentage NUMERIC(5,2) NOT NULL
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    application_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tax_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    tax_type VARCHAR(50) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    filed_at TIMESTAMPTZ
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    entry_type VARCHAR(50) NOT NULL,
    debit_amount NUMERIC(14,2) DEFAULT 0,
    credit_amount NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE financial_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    net_revenue NUMERIC(14,2) NOT NULL
);

-- DB TRIGGER FOR APPEND-ONLY WALLET TRANSACTIONS
CREATE OR REPLACE FUNCTION block_wallet_tx_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CRITICAL DATA INTEGRITY VIOLATION: wallet_transactions table is strictly append-only. UPDATE and DELETE operations are forbidden at database level.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_wallet_tx_append_only
BEFORE UPDATE OR DELETE ON wallet_transactions
FOR EACH ROW EXECUTE FUNCTION block_wallet_tx_mutation();

-- ============================================================================
-- DOMAIN 9: NOTIFICATIONS (5 Tables)
-- ============================================================================

CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_code VARCHAR(100) UNIQUE NOT NULL,
    channel VARCHAR(50) NOT NULL, -- EMAIL, SMS, WHATSAPP, PUSH
    subject TEXT,
    body_template TEXT NOT NULL
);

CREATE TABLE notification_logs (
    id UUID DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE notification_logs_y2026m07 PARTITION OF notification_logs
    FOR VALUES FROM ('2026-07-01 00:00:00') TO ('2026-08-01 00:00:00');

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE push_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform VARCHAR(20) NOT NULL
);

CREATE TABLE whatsapp_message_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    message_sid VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOMAIN 10: HR (8 Tables)
-- ============================================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    job_title VARCHAR(100) NOT NULL,
    joined_at DATE NOT NULL
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    clock_in TIMESTAMPTZ NOT NULL,
    clock_out TIMESTAMPTZ
);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    pay_period VARCHAR(50) NOT NULL,
    total_disbursed NUMERIC(14,2) NOT NULL,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE RESTRICT,
    employee_id UUID REFERENCES employees(id) ON DELETE RESTRICT,
    net_pay NUMERIC(12,2) NOT NULL
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    starts_on DATE NOT NULL,
    ends_on DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    annual_leave_days INT DEFAULT 20,
    sick_leave_days INT DEFAULT 10
);

CREATE TABLE performance_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DOMAIN 11: REPORTS & ANALYTICS (5 Tables)
-- ============================================================================

CREATE TABLE report_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    query_template TEXT NOT NULL
);

CREATE TABLE report_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    report_definition_id UUID REFERENCES report_definitions(id) ON DELETE CASCADE,
    cron_expression VARCHAR(50) NOT NULL
);

CREATE TABLE report_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES report_schedules(id) ON DELETE CASCADE,
    output_file_url TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    widget_type VARCHAR(100) NOT NULL,
    position_config JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    snapshot_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ============================================================================
-- DOMAIN 12: API MARKETPLACE (6 Tables)
-- ============================================================================

CREATE TABLE api_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(50) DEFAULT 'standard'
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- Secrets returned once; store hash only
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    response_code INT NOT NULL,
    latency_ms INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhook_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    target_url TEXT NOT NULL,
    subscribed_events JSONB NOT NULL DEFAULT '[]'::jsonb,
    secret_hash VARCHAR(255) NOT NULL
);

CREATE TABLE webhook_delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    http_status INT NOT NULL,
    attempt INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE integration_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    integration_name VARCHAR(100) NOT NULL, -- AMADEUS, EXPEDIA, TEXTRACT, OPENAI, GOOGLE_MAPS
    is_enabled BOOLEAN DEFAULT TRUE,
    config_settings JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- DOMAIN 13: SUPER ADMIN (5 Tables)
-- ============================================================================

CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_key VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    rollout_percentage INT DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE system_health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- OK, DEGRADED, DOWN
    latency_ms INT NOT NULL,
    checked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    super_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE revenue_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary_date DATE NOT NULL,
    gross_revenue NUMERIC(14,2) NOT NULL,
    platform_net NUMERIC(14,2) NOT NULL
);

CREATE TABLE impersonation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    super_admin_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    target_company_id UUID REFERENCES companies(id) ON DELETE RESTRICT,
    session_started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    session_expires_at TIMESTAMPTZ NOT NULL
);

-- ============================================================================
-- INDEXES: Composite (company_id, status, created_at DESC) & GIN JSONB
-- ============================================================================

CREATE INDEX idx_applications_composite ON applications(company_id, status, created_at DESC);
CREATE INDEX idx_wallet_tx_composite ON wallet_transactions(company_id, created_at DESC);
CREATE INDEX idx_leads_composite ON leads(company_id, status, created_at DESC);
CREATE INDEX idx_audit_logs_composite ON audit_logs(company_id, created_at DESC);
CREATE INDEX idx_invoices_composite ON invoices(company_id, status, issued_at DESC);

CREATE INDEX idx_gin_visa_requirements ON visa_requirements USING GIN (requirements);
CREATE INDEX idx_gin_doc_verifications ON document_verifications USING GIN (attributes);
CREATE INDEX idx_gin_ocr_extractions ON ocr_extractions USING GIN (extracted_fields);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES ON ALL TENANT-SCOPED TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_users_isolation ON users
    USING (company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid);

CREATE POLICY tenant_applications_isolation ON applications
    USING (company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid);

CREATE POLICY tenant_wallets_isolation ON wallets
    USING (company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid);

CREATE POLICY tenant_wallet_transactions_isolation ON wallet_transactions
    USING (company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid);

CREATE POLICY tenant_leads_isolation ON leads
    USING (company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid);

CREATE POLICY tenant_audit_logs_isolation ON audit_logs
    USING (company_id = NULLIF(current_setting('app.current_company_id', true), '')::uuid);
