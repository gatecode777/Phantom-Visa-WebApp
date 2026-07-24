/**
 * Row-Level Security (RLS) Helper for PostgreSQL Session Context
 * Ensures `app.current_company_id` is set on DB connection sessions.
 */

export async function setSessionTenant(client: { query: (q: string, params?: any[]) => Promise<any> }, companyId: string) {
  if (!companyId || !companyId.match(/^[0-9a-fA-F-]{36}$/)) {
    throw new Error("SECURITY BREACH: Invalid or missing company_id for Row-Level Security isolation.");
  }
  await client.query(`SET LOCAL app.current_company_id = '${companyId}';`);
}

export function buildTenantScopedQuery(baseQuery: string, companyId: string): { query: string; params: any[] } {
  // Enforces dual-layer isolation: Application-layer WHERE + Database RLS
  return {
    query: baseQuery.includes("WHERE") 
      ? `${baseQuery} AND company_id = $1` 
      : `${baseQuery} WHERE company_id = $1`,
    params: [companyId]
  };
}
