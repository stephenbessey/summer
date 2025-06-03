'use client';

import Link from "next/link";
import { useApi } from '../hooks/useApi';
import { Card } from '../components/ui/Card';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function Home() {
  const { insights, loading, connected } = useApi();

  const quickActions = [
    {
      href: '/agents',
      title: 'Manage Agents',
      description: 'View and manage your team',
      color: 'blue',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      href: '/analytics',
      title: 'Analytics',
      description: 'Track performance',
      color: 'green',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      href: '#',
      title: 'Settings',
      description: 'Configure workspace',
      color: 'purple',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const insightCards = [
    { key: 'quote', title: 'Quote', bgColor: 'bg-blue-50', textColor: 'text-blue-800', titleColor: 'text-blue-900' },
    { key: 'fortune', title: 'Fortune', bgColor: 'bg-green-50', textColor: 'text-green-800', titleColor: 'text-green-900' },
    { key: 'color', title: "Today's Color", bgColor: 'bg-purple-50', textColor: 'text-purple-800', titleColor: 'text-purple-900' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600 font-playfair">SureFire Seller</span>
          </h1>
          <p className="text-xl text-gray-800 mb-6">
            Your simple real estate CRM solution
          </p>
          
          <StatusIndicator connected={connected} />
        </div>

        {/* Daily Insights */}
        {connected && !loading && Object.keys(insights).length > 0 && (
          <Card className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Daily Insights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {insightCards.map((card) => {
                const value = insights[card.key as keyof typeof insights];
                if (!value) return null;
                
                return (
                  <div key={card.key} className={`${card.bgColor} rounded-lg p-4`}>
                    <h3 className={`font-semibold ${card.titleColor} mb-2`}>{card.title}</h3>
                    {card.key === 'color' ? (
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: value }}
                        ></div>
                        <span className={`${card.textColor} text-sm font-medium`}>{value}</span>
                      </div>
                    ) : (
                      <p className={`${card.textColor} text-sm`}>
                        {card.key === 'quote' ? `"${value}"` : value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="group">
              <Card className="hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{action.title}</h3>
                  <p className="text-gray-800 text-sm">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}