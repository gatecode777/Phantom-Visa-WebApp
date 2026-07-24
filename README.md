# PHANTOM VISA OS — PLATFORM ARCHITECTURE

PHANTOM VISA OS is an enterprise multi-tenant visa operating platform built with Next.js, PostgreSQL Row-Level Security, and event-driven infrastructure.

---

## 🚫 EXPLICIT NON-GOALS (PRODUCT BOUNDARIES)

To prevent scope creep, **PHANTOM VISA OS v1 explicitly excludes the following domain areas**:

1. **Direct B2C Visa Marketplace**: PHANTOM VISA OS operates purely as a B2B SaaS platform for travel agencies, corporate aggregators, and visa bureau franchises. It is not an un-intermediated consumer marketplace.
2. **Government / Embassy-Side Internal Case Management**: The platform handles agency prep, document verification, and submission handoffs. It does not replace internal embassy/consular decisioning workflows.
3. **Full Immigration Legal-Case Management**: Complex asylum litigation, deportations, and long-term litigation case tracking are outside the scope of PHANTOM VISA OS.

---

## 🏛️ ARCHITECTURAL HIGHLIGHTS

- **Living Schema & ERD**: `schema.sql` (~104 tables across 13 domains) and `docs/ERD.md`.
- **Row-Level Security (RLS)**: PostgreSQL session-level RLS policies on all `company_id` tables.
- **Money Safety**: `Idempotency-Key` deduplication, atomic `SERIALIZABLE` transactions with `FOR UPDATE` locking, and Maker-Checker threshold approval (> $500) for refunds.
- **Append-Only Ledger**: Database triggers blocking `UPDATE` and `DELETE` on `wallet_transactions`.
- **Event-Driven Backbone**: Kafka broadcast topics partitioned by `company_id` hash + RabbitMQ imperative task queues.
- **Platform API Standards**: Designed `/v1/` endpoints with cursor pagination, rate limit headers, RS256 JWT rotation, and standard error envelopes.
- **Super Admin Control Plane**: Impersonation sessions (auto-expiring at 30 minutes with persistent notification banner), percentage feature flag rollouts, system health checks, and revenue metrics.
