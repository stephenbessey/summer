'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { KeyMetric } from '../../components/ui/KeyMetric';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function Analytics() {
  const { insights, connected } = useApi();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading analytics..." />
        </div>
      </div>
    );
  }

  const keyMetrics = [
    { label: 'Total Leads', value: 533, change: '+12% from last month', color: 'blue' as const },
    { label: 'Conversion Rate', value: '23.5%', change: '+2.3% improvement', color: 'green' as const },
    { label: 'Avg Days to Close', value: 18, change: '-3 days faster', color: 'yellow' as const },
    { label: 'Total Deals', value: 383, change: '+8% this quarter', color: 'purple' as const }
  ];

  const monthlyData = [
    { month: 'Jan', leads: 45 },
    { month: 'Feb', leads: 52 },
    { month: 'Mar', leads: 38 },
    { month: 'Apr', leads: 61 },
    { month: 'May', leads: 49 },
    { month: 'Jun', leads: 67 }
  ];

  const leadSources = [
    { source: 'API Integration', count: 65, color: 'bg-blue-500' },
    { source: 'Referrals', count: 28, color: 'bg-green-500' },
    { source: 'Social Media', count: 16, color: 'bg-yellow-500' },
    { source: 'Website', count: 11, color: 'bg-purple-500' }
  ];

  const topPerformers = [
    { name: 'Sarah Thompson', leads: 31, deals: 12, rate: 38.7 },
    { name: 'Jennifer Martinez', leads: 23, deals: 8, rate: 34.8 },
    { name: 'David Kim', leads: 18, deals: 6, rate: 33.3 },
    { name: 'Michael Brown', leads: 12, deals: 4, rate: 33.3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <PageHeader 
          title="Analytics Dashboard" 
          description="Track performance and insights" 
        />

        {/* Daily Inspiration */}
        {connected && insights.fortune && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8">
            <h2 className="text-lg font-semibold mb-2">Daily Motivation</h2>
            <p className="italic">"{insights.fortune}"</p>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <KeyMetric
              key={index}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              color={metric.color}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Monthly Performance */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Performance</h3>
            <div className="space-y-3">
              {monthlyData.map((month) => (
                <ProgressBar
                  key={month.month}
                  label={month.month}
                  value={month.leads}
                  maxValue={70}
                />
              ))}
            </div>
          </Card>

          {/* Lead Sources */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Lead Sources</h3>
            <div className="space-y-3">
              {leadSources.map(item => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm text-gray-900">{item.source}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Agent Performance Table */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-900 font-medium">Agent</th>
                  <th className="text-left py-2 text-gray-900 font-medium">Leads</th>
                  <th className="text-left py-2 text-gray-900 font-medium">Deals</th>
                  <th className="text-left py-2 text-gray-900 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map(agent => (
                  <tr key={agent.name} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{agent.name}</td>
                    <td className="py-3 text-gray-900">{agent.leads}</td>
                    <td className="py-3 text-gray-900">{agent.deals}</td>
                    <td className="py-3 text-gray-900">{agent.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}