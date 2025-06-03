'use client';

import { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { AgentCard } from '../../components/AgentCard';
import { SearchSort } from '../../components/SearchSort';
import { PageHeader } from '../../components/ui/PageHeader';
import { KeyMetric } from '../../components/ui/KeyMetric';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useApi } from '../../hooks/useApi';

export default function Agents() {
  const { insights } = useApi();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockAgents: Agent[] = [
      { id: 1, name: "Jennifer Martinez", specialty: "Luxury Homes", rating: 4.9, leads: 145, deals: 89 },
      { id: 2, name: "David Kim", specialty: "First-Time Buyers", rating: 4.7, leads: 98, deals: 67 },
      { id: 3, name: "Sarah Thompson", specialty: "Investment Properties", rating: 4.8, leads: 203, deals: 156 },
      { id: 4, name: "Michael Brown", specialty: "Commercial Real Estate", rating: 4.6, leads: 87, deals: 71 }
    ];

    const enhancedAgents = mockAgents.map(agent => ({
      ...agent,
      quote: insights.quote
    }));

    setTimeout(() => {
      setAgents(enhancedAgents);
      setLoading(false);
    }, 500);
  }, [insights]);

  const filteredAndSorted = agents
    .filter(agent => 
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.rating - a.rating;
        case 'leads': return b.leads - a.leads;
        case 'deals': return b.deals - a.deals;
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading agents..." />
        </div>
      </div>
    );
  }

  const teamStats = [
    { label: 'Total Agents', value: agents.length, color: 'blue' as const },
    { label: 'Total Leads', value: agents.reduce((sum, a) => sum + a.leads, 0), color: 'green' as const },
    { label: 'Total Deals', value: agents.reduce((sum, a) => sum + a.deals, 0), color: 'purple' as const },
    { label: 'Avg Rating', value: agents.length > 0 ? (agents.reduce((sum, a) => sum + a.rating, 0) / agents.length).toFixed(1) : '0.0', color: 'yellow' as const }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <PageHeader 
          title="Real Estate Agents" 
          description="Manage your team and track performance" 
        />

        <SearchSort
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {teamStats.map((stat, index) => (
            <KeyMetric
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-800">No agents found.</p>
          </div>
        )}
      </div>
    </div>
  );
}