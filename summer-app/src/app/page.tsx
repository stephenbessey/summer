'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

interface DailyInsight {
  quote?: string;
  fortune?: string;
  spiritAnimal?: string;
  color?: string;
  message?: string;
}

export default function Home() {
  const [dailyInsight, setDailyInsight] = useState<DailyInsight>({});
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    const fetchDailyInsights = async () => {
      setIsLoading(true);
      setApiStatus('checking');
      
      try {
        // Fetch from multiple API endpoints to create a "daily insight" feature
        const endpoints = [
          { 
            url: 'https://sd-6310-2025-summer-express-app.onrender.com/api/quote',
            key: 'quote' 
          },
          { 
            url: 'https://sd-6310-2025-summer-express-app.onrender.com/api/fortune-cookie',
            key: 'fortune' 
          },
          { 
            url: 'https://sd-6310-2025-summer-express-app.onrender.com/api/spirit-animal',
            key: 'spiritAnimal' 
          },
          { 
            url: 'https://sd-6310-2025-summer-express-app.onrender.com/api/color',
            key: 'color' 
          }
        ];

        const insights: DailyInsight = {};
        let successfulConnections = 0;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint.url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              cache: 'no-cache'
            });

            if (response.ok) {
              const data = await response.json();
              
              // Map the response to our insight object
              if (endpoint.key === 'quote' && data.quote) {
                insights.quote = data.quote;
              } else if (endpoint.key === 'fortune' && data.fortune) {
                insights.fortune = data.fortune;
              } else if (endpoint.key === 'spiritAnimal' && data.spiritAnimal) {
                insights.spiritAnimal = data.spiritAnimal;
              } else if (endpoint.key === 'color' && data.color) {
                insights.color = data.color;
              }
              
              successfulConnections++;
            }
          } catch (error) {
            console.error(`Failed to fetch from ${endpoint.url}:`, error);
          }
        }

        setDailyInsight(insights);
        setApiStatus(successfulConnections > 0 ? 'connected' : 'disconnected');
        
      } catch (error) {
        console.error('Error fetching daily insights:', error);
        setApiStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyInsights();
  }, []);

  const getMotivationalMessage = () => {
    const messages = [
      "Start your day with purpose and watch opportunities unfold!",
      "Today is full of possibilities - make them count!",
      "Your next breakthrough could be just one conversation away.",
      "Great things happen when preparation meets opportunity.",
      "Success begins with believing in yourself and your vision."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/next.svg"
                alt="SureFire Seller"
                width={40}
                height={40}
                className="dark:invert"
              />
              <h1 className="text-2xl font-bold text-gray-900 font-serif">SureFire Seller</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/agents" className="text-gray-600 hover:text-gray-900 transition-colors">
                Agents
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Daily Insights */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">SureFire Seller</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your intelligent real estate CRM that grows with your business. 
            Manage leads, track performance, and close more deals.
          </p>

          {/* API Status Indicator */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            apiStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : apiStatus === 'disconnected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              apiStatus === 'connected' 
                ? 'bg-green-500' 
                : apiStatus === 'disconnected'
                ? 'bg-red-500'
                : 'bg-yellow-500 animate-pulse'
            }`}></div>
            {apiStatus === 'connected' ? 'System Connected' : 
             apiStatus === 'disconnected' ? 'System Offline' : 'Connecting...'}
          </div>
        </div>

        {/* Daily Insights Card */}
        {apiStatus === 'connected' && Object.keys(dailyInsight).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Insights</h3>
              <p className="text-gray-600">Powered by our intelligent API connections</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyInsight.quote && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Quote of the Day</h4>
                      <p className="text-blue-800 text-sm italic">{`"${dailyInsight.quote}"`}</p>
                    </div>
                  </div>
                </div>
              )}

              {dailyInsight.fortune && (
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Fortune Cookie</h4>
                      <p className="text-purple-800 text-sm">{dailyInsight.fortune}</p>
                    </div>
                  </div>
                </div>
              )}

              {dailyInsight.spiritAnimal && (
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Spirit Animal</h4>
                      <p className="text-green-800 text-sm">Today's guidance: <strong>{dailyInsight.spiritAnimal}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {dailyInsight.color && (
                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                      style={{ backgroundColor: dailyInsight.color }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Color of Success</h4>
                      <p className="text-orange-800 text-sm">
                        Channel the energy of <strong style={{ color: dailyInsight.color }}>{dailyInsight.color}</strong> today
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm italic">{`"${getMotivationalMessage()}"`}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/agents" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100 group-hover:border-blue-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Agents</h3>
                  <p className="text-sm text-gray-600">View team performance & leads</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Access your real estate agent dashboard with API-powered insights</p>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Track performance metrics</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Coming soon: Advanced analytics powered by our data APIs</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Configure your workspace</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Customize your experience and API integrations</p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Powered by Smart API Integrations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Data</h4>
              <p className="text-sm text-gray-600">Live updates from multiple data sources</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Insights</h4>
              <p className="text-sm text-gray-600">AI-powered recommendations and guidance</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personalized</h4>
              <p className="text-sm text-gray-600">Tailored experience based on your preferences</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
              <p className="text-sm text-gray-600">Track and optimize your success metrics</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-700">Connecting to services...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}