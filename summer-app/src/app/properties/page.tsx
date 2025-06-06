'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  listing_price: number;
  listing_status: string;
  listing_date: string;
  description?: string;
  inquiries?: Array<{
    inquiry_id: number;
    inquiry_type: string;
    inquiry_date: string;
    lead_id: number;
    lead_name: string;
    lead_email: string;
  }>;
}

interface PropertyFormData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  square_feet: string;
  listing_price: string;
  listing_status: string;
  description: string;
}

const PROPERTY_TYPES = ['house', 'condo', 'townhouse', 'apartment', 'land', 'commercial', 'other'];
const LISTING_STATUSES = ['active', 'pending', 'sold', 'withdrawn'];
const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState('');
  const [bathroomsFilter, setBathroomsFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    address: '',
    city: '',
    state: 'TX',
    zip_code: '',
    property_type: 'house',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    listing_price: '',
    listing_status: 'active',
    description: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedOnce, setLoadedOnce] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = 'https://sd-6310-2025-summer-express-app.onrender.com/api';

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('status', statusFilter);
      if (minPriceFilter) queryParams.append('min_price', minPriceFilter);
      if (maxPriceFilter) queryParams.append('max_price', maxPriceFilter);
      if (propertyTypeFilter) queryParams.append('property_type', propertyTypeFilter);
      if (bedroomsFilter) queryParams.append('bedrooms', bedroomsFilter);
      if (bathroomsFilter) queryParams.append('bathrooms', bathroomsFilter);
      
      const url = `${BASE_URL}/properties${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setProperties(data.data);
        setLoadedOnce(true);
      } else {
        setError('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProperties = () => {
    fetchProperties();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'minPrice':
        setMinPriceFilter(value);
        break;
      case 'maxPrice':
        setMaxPriceFilter(value);
        break;
      case 'propertyType':
        setPropertyTypeFilter(value);
        break;
      case 'bedrooms':
        setBedroomsFilter(value);
        break;
      case 'bathrooms':
        setBathroomsFilter(value);
        break;
    }
    // Auto-fetch when filters change if already loaded once
    if (loadedOnce) {
      setTimeout(fetchProperties, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const propertyData = {
        ...formData,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : undefined,
        listing_price: parseFloat(formData.listing_price),
        description: formData.description || undefined
      };

      const url = editingProperty 
        ? `${BASE_URL}/properties/${editingProperty.id}`
        : `${BASE_URL}/properties`;
        
      const method = editingProperty ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save property');
      }

      const data = await response.json();
      if (data.success) {
        await fetchProperties();
        handleCloseModal();
      } else {
        setError(data.message || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setError(error instanceof Error ? error.message : 'Failed to save property');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (property: Property) => {
    if (!confirm(`Are you sure you want to delete the property at ${property.address}?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/properties/${property.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      const data = await response.json();
      if (data.success) {
        await fetchProperties();
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      address: property.address,
      city: property.city,
      state: property.state,
      zip_code: property.zip_code,
      property_type: property.property_type || 'house',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      square_feet: property.square_feet?.toString() || '',
      listing_price: property.listing_price.toString(),
      listing_status: property.listing_status,
      description: property.description || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProperty(null);
    setFormData({
      address: '',
      city: '',
      state: 'TX',
      zip_code: '',
      property_type: 'house',
      bedrooms: '',
      bathrooms: '',
      square_feet: '',
      listing_price: '',
      listing_status: 'active',
      description: ''
    });
    setError('');
  };

  const filteredProperties = properties.filter(property => 
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (property.property_type && property.property_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'withdrawn': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Management</h2>
              <p className="text-gray-600">Manage your real estate property listings</p>
            </div>
            <div className="flex space-x-3">
              {!loadedOnce && (
                <button
                  onClick={handleLoadProperties}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load Properties'}
                </button>
              )}
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Property
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Filters */}
        {loadedOnce && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Properties
                </label>
                <input
                  ref={searchInputRef}
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by address, city, or type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {LISTING_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  id="propertyType"
                  value={propertyTypeFilter}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  id="minPrice"
                  value={minPriceFilter}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  value={maxPriceFilter}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="10000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  value={bedroomsFilter}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Bathrooms
                </label>
                <input
                  type="number"
                  step="0.5"
                  id="bathrooms"
                  value={bathroomsFilter}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchProperties}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh Properties'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {loadedOnce && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProperties.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProperties.filter(p => p.listing_status === 'active').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProperties.filter(p => p.listing_status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-md">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProperties.length > 0 
                      ? formatCurrency(filteredProperties.reduce((sum, p) => sum + p.listing_price, 0) / filteredProperties.length)
                      : '$0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        ) : loadedOnce ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{formatCurrency(property.listing_price)}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.listing_status)}`}>
                      {property.listing_status.charAt(0).toUpperCase() + property.listing_status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {property.address}<br />
                    {property.city}, {property.state} {property.zip_code}
                  </p>

                  {property.property_type && (
                    <p className="text-sm text-gray-500 mb-2 capitalize">
                      {property.property_type.replace('_', ' ')}
                    </p>
                  )}

                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <div className="flex space-x-4">
                      {property.bedrooms && (
                        <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                      )}
                      {property.square_feet && (
                        <span>{property.square_feet.toLocaleString()} sq ft</span>
                      )}
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {property.description.length > 100 
                        ? property.description.substring(0, 100) + '...' 
                        : property.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    Listed: {new Date(property.listing_date).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(property)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property)}
                      className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded-md hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProperties.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No properties found matching your criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties loaded</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by loading your property listings from the database.</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zip_code}
                      onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PROPERTY_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.square_feet}
                      onChange={(e) => setFormData({...formData, square_feet: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Listing Price *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.listing_price}
                      onChange={(e) => setFormData({...formData, listing_price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.listing_status}
                      onChange={(e) => setFormData({...formData, listing_status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LISTING_STATUSES.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Property description..."
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitLoading ? 'Saving...' : (editingProperty ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}