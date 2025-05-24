'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  rating: number;
  totalLeads: number;
  activeLeads: number;
  closedDeals: number;
  avatar: string;
  location: string;
  joinDate: string;
  motivationalQuote?: string; // From API
  favoriteColor?: string; // From API
  officeSpirit?: string; // From API
}

// Define API response types
interface QuoteResponse {
  quote?: string;
}

interface FortuneResponse {
  fortune?: string;
}

interface SpiritAnimalResponse {
  spiritAnimal?: string;
}

interface ColorResponse {
  color?: string;
}

type ApiResponse = QuoteResponse | FortuneResponse | SpiritAnimalResponse | ColorResponse;

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'totalLeads' | 'closedDeals'>('rating');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // Fetch inspirational data from working API endpoints to enhance agent profiles
        const apiEndpoints = [
          'https://sd-6310-2025-summer-express-app.onrender.com/api/quote',
          'https://sd-6310-2025-summer-express-app.onrender.com/api/spirit-animal',
          'https://sd-6310-2025-summer-express-app.onrender.com/api/color',
          'https://sd-6310-2025-summer-express-app.onrender.com/api/fortune-cookie'
        ];

        const apiPromises = apiEndpoints.map(async (url): Promise<ApiResponse | null> => {
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              cache: 'no-cache'
            });
            
            if (response.ok) {
              return await response.json() as ApiResponse;
            }
            return null;
          } catch (error) {
            console.warn(`Failed to fetch from ${url}:`, error);
            return null;
          }
        });

        const responses = await Promise.all(apiPromises);
        const apiData: ApiResponse[] = responses.filter((data): data is ApiResponse => data !== null);

        console.log('Successfully fetched API data:', apiData);

        // Base agent data
        const baseAgents: Omit<Agent, 'motivationalQuote' | 'favoriteColor' | 'officeSpirit'>[] = [
          {
            id: 1,
            name: "Jennifer Martinez",
            email: "j.martinez@realty.com",
            phone: "(555) 100-2000",
            specialty: "Luxury Homes",
            experience: 8,
            rating: 4.9,
            totalLeads: 145,
            activeLeads: 23,
            closedDeals: 89,
            avatar: "/next.svg",
            location: "Austin, TX",
            joinDate: "2016-03-15"
          },
          {
            id: 2,
            name: "David Kim",
            email: "d.kim@realty.com",
            phone: "(555) 200-3000",
            specialty: "First-Time Buyers",
            experience: 5,
            rating: 4.7,
            totalLeads: 98,
            activeLeads: 18,
            closedDeals: 67,
            avatar: "/next.svg",
            location: "Dallas, TX",
            joinDate: "2019-07-22"
          },
          {
            id: 3,
            name: "Sarah Thompson",
            email: "s.thompson@realty.com",
            phone: "(555) 300-4000",
            specialty: "Investment Properties",
            experience: 12,
            rating: 4.8,
            totalLeads: 203,
            activeLeads: 31,
            closedDeals: 156,
            avatar: "/next.svg",
            location: "Houston, TX",
            joinDate: "2012-01-10"
          },
          {
            id: 4,
            name: "Michael Brown",
            email: "m.brown@realty.com",
            phone: "(555) 400-5000",
            specialty: "Commercial Real Estate",
            experience: 15,
            rating: 4.6,
            totalLeads: 87,
            activeLeads: 12,
            closedDeals: 71,
            avatar: "/next.svg",
            location: "San Antonio, TX",
            joinDate: "2009-09-05"
          }
        ];

        // Helper functions to safely extract data from API responses
        const getQuoteFromApiData = (data: ApiResponse[]): string | undefined => {
          for (const item of data) {
            if ('quote' in item && item.quote) {
              return item.quote;
            }
            if ('fortune' in item && item.fortune) {
              return item.fortune;
            }
          }
          return undefined;
        };

        const getColorFromApiData = (data: ApiResponse[]): string | undefined => {
          const colorItem = data.find((item): item is ColorResponse => 'color' in item);
          return colorItem?.color;
        };

        const getSpiritAnimalFromApiData = (data: ApiResponse[]): string | undefined => {
          const spiritItem = data.find((item): item is SpiritAnimalResponse => 'spiritAnimal' in item);
          return spiritItem?.spiritAnimal;
        };

        // Enhance agents with API data
        const enhancedAgents: Agent[] = baseAgents.map((agent) => {
          const enhancement: Partial<Pick<Agent, 'motivationalQuote' | 'favoriteColor' | 'officeSpirit'>> = {};

          // Add motivational quote from API
          const quote = getQuoteFromApiData(apiData);
          if (quote) {
            enhancement.motivationalQuote = quote;
          }

          // Add favorite color from API
          const color = getColorFromApiData(apiData);
          if (color) {
            enhancement.favoriteColor = color;
          }

          // Add office spirit animal from API
          const spiritAnimal = getSpiritAnimalFromApiData(apiData);
          if (spiritAnimal) {
            enhancement.officeSpirit = spiritAnimal;
          }

          return { ...agent, ...enhancement };
        });
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setAgents(enhancedAgents);
        
      } catch (error) {
        console.error('Error fetching agents:', error);
        // Fallback to basic agent data
        const fallbackAgent: Agent = {
          id: 1,
          name: "Jennifer Martinez",
          email: "j.martinez@realty.com",
          phone: "(555) 100-2000",
          specialty: "Luxury Homes",
          experience: 8,
          rating: 4.9,
          totalLeads: 145,
          activeLeads: 23,
          closedDeals: 89,
          avatar: "/next.svg",
          location: "Austin, TX",
          joinDate: "2016-03-15"
        };
        setAgents([fallbackAgent]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filteredAndSortedAgents = agents
    .filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'totalLeads':
          return b.totalLeads - a.totalLeads;
        case 'closedDeals':
          return b.closedDeals - a.closedDeals;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    return stars;
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
                alt="Surefire Seller Logo"
                width={40}
                height={40}
                className="dark:invert"
              />
              <h1 className="text-2xl font-bold text-gray-900 font-serif">SureFire Seller</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/agents" className="text-blue-600 font-medium">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Real Estate Agents</h2>
          <p className="text-gray-600">Manage your team of real estate professionals and their performance</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Agents
              </label>
              <input
                ref={searchInputRef}
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialty, or location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="totalLeads">Total Leads</option>
                <option value="closedDeals">Closed Deals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold text-gray-900">{agents.reduce((sum, a) => sum + a.activeLeads, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {agents.length > 0 ? (agents.reduce((sum, a) => sum + a.rating, 0) / agents.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{agents.reduce((sum, a) => sum + a.closedDeals, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading agents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAgents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Image
                      src={agent.avatar}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="rounded-full dark:invert"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.specialty}</p>
                    {agent.favoriteColor && (
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: agent.favoriteColor }}
                        ></div>
                        <span className="text-xs text-gray-500">Favorite color</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(agent.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({agent.rating})</span>
                  </div>
                  <p className="text-sm text-gray-600">{agent.experience} years experience</p>
                  <p className="text-sm text-gray-600">{agent.location}</p>
                  {agent.officeSpirit && (
                    <p className="text-sm text-gray-600">Office spirit: {agent.officeSpirit}</p>
                  )}
                </div>

                {/* Motivational Quote from API */}
                {agent.motivationalQuote && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm italic text-blue-800">
                      "{agent.motivationalQuote.length > 80 
                        ? agent.motivationalQuote.substring(0, 80) + '...' 
                        : agent.motivationalQuote}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-blue-600">{agent.totalLeads}</p>
                    <p className="text-xs text-gray-600">Total Leads</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">{agent.activeLeads}</p>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-purple-600">{agent.closedDeals}</p>
                    <p className="text-xs text-gray-600">Closed</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                    View Profile
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedAgents.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No agents found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}