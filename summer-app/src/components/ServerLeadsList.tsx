import { Suspense } from 'react';

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  lead_status: string;
}

// Separate the async function for easier testing
export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch('https://sd-6310-2025-summer-express-app.onrender.com/api/leads', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }
  
  const data = await response.json();
  return data.success ? data.data : [];
}

// Client component wrapper for testing
export function LeadsDisplay({ leads, error }: { leads?: Lead[], error?: string }) {
  if (error) {
    return (
      <div role="alert" data-testid="leads-error">
        <p>Error loading leads: {error}</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div role="status" data-testid="no-leads">
        <p>No leads found</p>
      </div>
    );
  }
  
  return (
    <div data-testid="leads-list">
      <h2>Server-side Leads ({leads.length})</h2>
      <ul role="list">
        {leads.map((lead) => (
          <li key={lead.id} role="listitem" data-testid={`lead-${lead.id}`}>
            <div>
              <h3>{lead.first_name} {lead.last_name}</h3>
              <p title={`Email: ${lead.email}`}>{lead.email}</p>
              <span className={`status-${lead.lead_status}`}>
                {lead.lead_status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Async server component for production
async function LeadsData() {
  try {
    const leads = await fetchLeads();
    return <LeadsDisplay leads={leads} />;
  } catch (error) {
    return <LeadsDisplay error={error instanceof Error ? error.message : 'Unknown error'} />;
  }
}

export default function ServerLeadsList() {
  return (
    <div className="server-leads-container">
      <Suspense fallback={
        <div role="status" aria-label="Loading leads" data-testid="loading-leads">
          <p>Loading leads...</p>
        </div>
      }>
        <LeadsData />
      </Suspense>
    </div>
  );
}