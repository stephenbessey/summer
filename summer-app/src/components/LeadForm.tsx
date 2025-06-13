'use client';

import { useState } from 'react';

interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  lead_status: string;
}

interface LeadFormProps {
  onSubmit?: (data: LeadFormData) => Promise<void>;
  initialData?: Partial<LeadFormData>;
}

export default function LeadForm({ onSubmit, initialData }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    lead_status: initialData?.lead_status || 'new'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.email.trim()) {
      setError('First name and email are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        lead_status: 'new'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess(false);
  };

  return (
    <div className="lead-form-container">
      <h2>Add New Lead</h2>
      
      {error && (
        <div role="alert" data-testid="form-error" className="error">
          {error}
        </div>
      )}
      
      {success && (
        <div role="status" data-testid="form-success" className="success">
          Lead added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} data-testid="lead-form">
        <div className="form-group">
          <label htmlFor="first_name">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            title="Enter the lead's first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            disabled={isSubmitting}
            title="Enter the lead's last name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            title="Enter a valid email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_status">
            Lead Status
          </label>
          <select
            id="lead_status"
            name="lead_status"
            value={formData.lead_status}
            onChange={handleInputChange}
            disabled={isSubmitting}
            title="Select the lead status"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="submit-button"
          title={isSubmitting ? 'Submitting...' : 'Submit lead form'}
        >
          {isSubmitting ? 'Submitting...' : 'Add Lead'}
        </button>
      </form>
    </div>
  );
}