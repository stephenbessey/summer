'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track performance and insights</p>
        </div>

        {/* Daily Inspiration */}
        {connected && insights.fortune && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <h2 className="text-lg font-semibold mb-2">Daily Motivation</h2>
            <p className="italic">"{insights.fortune}"</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">533</p>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">23.5%</p>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-xs text-green-600">+2.3% improvement</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">18</p>
              <p className="text-sm text-gray-600">Avg Days to Close</p>
              <p className="text-xs text-green-600">-3 days faster</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">383</p>
              <p className="text-sm text-gray-600">Total Deals</p>
              <p className="text-xs text-green-600">+8% this quarter</p>
            </div>
          </div>
        </div>

        {/* Simple Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
            <div className="space-y-3">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                const leads = [45, 52, 38, 61, 49, 67][i];
                const width = (leads / 70) * 100;
                return (
                  <div key={month} className="flex items-center">
                    <span className="w-8 text-sm font-medium">{month}</span>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{leads}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
            <div className="space-y-3">
              {[
                { source: 'API Integration', count: 65, color: 'bg-blue-500' },
                { source: 'Referrals', count: 28, color: 'bg-green-500' },
                { source: 'Social Media', count: 16, color: 'bg-yellow-500' },
                { source: 'Website', count: 11, color: 'bg-purple-500' }
              ].map(item => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm">{item.source}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Performance Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Agent</th>
                  <th className="text-left py-2">Leads</th>
                  <th className="text-left py-2">Deals</th>
                  <th className="text-left py-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sarah Thompson', leads: 31, deals: 12, rate: 38.7 },
                  { name: 'Jennifer Martinez', leads: 23, deals: 8, rate: 34.8 },
                  { name: 'David Kim', leads: 18, deals: 6, rate: 33.3 },
                  { name: 'Michael Brown', leads: 12, deals: 4, rate: 33.3 }
                ].map(agent => (
                  <tr key={agent.name} className="border-b border-gray-100">
                    <td className="py-3">{agent.name}</td>
                    <td className="py-3">{agent.leads}</td>
                    <td className="py-3">{agent.deals}</td>
                    <td className="py-3">{agent.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}