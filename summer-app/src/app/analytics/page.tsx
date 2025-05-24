'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AnalyticsData {
  totalLeads: number;
  conversionRate: number;
  avgDaysToClose: number;
  topLifeEvent: string;
  monthlyTrends: Array<{ month: string; leads: number; conversions: number }>;
  agentPerformance: Array<{ name: string; leads: number; conversions: number }>;
  leadSources: Array<{ source: string; count: number; percentage: number }>;
  quote?: string;
  fortune?: string;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const refreshButtonRef = useRef<HTMLButtonElement>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch inspirational quote
      const quoteResponse = await fetch('https://sd-6310-2025-summer-express-app.onrender.com/api/quote');
      const quoteData = await quoteResponse.json();
      
      // Fetch fortune cookie
      const fortuneResponse = await fetch('https://sd-6310-2025-summer-express-app.onrender.com/api/fortune-cookie');
      const fortuneData = await fortuneResponse.json();
      
      // Fetch listings to generate analytics
      const listingsResponse = await fetch('https://sd-6310-2025-summer-express-app.onrender.com/listings');
      const listings = await listingsResponse.json();
      
      // Generate analytics based on listings data
      const mockAnalytics: AnalyticsData = {
        totalLeads: listings.length * 12, // Assume 12x multiplier for realistic numbers
        conversionRate: 23.5,
        avgDaysToClose: 18,
        topLifeEvent: "Job Relocation",
        quote: quoteData.quote,
        fortune: fortuneData.fortune,
        monthlyTrends: [
          { month: "Jan", leads: 45, conversions: 12 },
          { month: "Feb", leads: 52, conversions: 14 },
          { month: "Mar", leads: 38, conversions: 9 },
          { month: "Apr", leads: 61, conversions: 16 },
          { month: "May", leads: 49, conversions: 13 },
          { month: "Jun", leads: 67, conversions: 18 }
        ],
        agentPerformance: [
          { name: "Jennifer Martinez", leads: 23, conversions: 8 },
          { name: "David Kim", leads: 18, conversions: 6 },
          { name: "Sarah Thompson", leads: 31, conversions: 12 },
          { name: "Michael Brown", leads: 12, conversions: 4 }
        ],
        leadSources: [
          { source: "Life Events API", count: 65, percentage: 54.2 },
          { source: "Referrals", count: 28, percentage: 23.3 },
          { source: "Social Media", count: 16, percentage: 13.3 },
          { source: "Website", count: 11, percentage: 9.2 }
        ]
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeframe]);

  useEffect(() => {
    if (refreshButtonRef.current) {
      refreshButtonRef.current.focus();
    }
  }, []);

  const getConversionRate = (leads: number, conversions: number) => {
    return leads > 0 ? ((conversions / leads) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/next.svg"
                alt="SureFire Seller Logo"
                width={40}
                height={40}
                className="dark:invert"
              />
              <h1 className="text-2xl font-bold text-gray-900 font-serif">Surefire Seller</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/agents" className="text-gray-600 hover:text-gray-900 transition-colors">
                Agents
              </Link>
              <Link href="/analytics" className="text-blue-600 font-medium">
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">Track performance, conversion rates, and AI-powered insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                ref={refreshButtonRef}
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Daily Inspiration */}
            {analytics?.quote && analytics?.fortune && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
                <h3 className="text-lg font-semibold mb-4">Daily Motivation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Quote of the Day</h4>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Developer Fortune</h4>
                    <p className="text-purple-100 italic">"{analytics.fortune}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.totalLeads}</p>
                    <p className="text-xs text-green-600">+12% from last period</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-md">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.conversionRate}%</p>
                    <p className="text-xs text-green-600">+2.3% improvement</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-md">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Days to Close</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics?.avgDaysToClose}</p>
                    <p className="text-xs text-green-600">-3 days faster</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-md">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Life Event</p>
                    <p className="text-lg font-bold text-gray-900">{analytics?.topLifeEvent}</p>
                    <p className="text-xs text-blue-600">32% of leads</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Trends */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Lead Trends</h3>
                <div className="space-y-4">
                  {analytics?.monthlyTrends.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 w-8">{month.month}</span>
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2 w-32">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(month.leads / 70) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{month.leads} leads</p>
                        <p className="text-xs text-green-600">{month.conversions} conversions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Sources */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
                <div className="space-y-4">
                  {analytics?.leadSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="text-sm text-gray-900">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{source.count}</p>
                        <p className="text-xs text-gray-500">{source.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Agent Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Agent</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Leads</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Conversions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Conversion Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.agentPerformance.map((agent, index) => (
                      <tr key={agent.name} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">{agent.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">{agent.leads}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{agent.conversions}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{getConversionRate(agent.leads, agent.conversions)}%</td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(agent.conversions / agent.leads) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}