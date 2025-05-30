import { useRef, useEffect } from 'react';

interface SearchSortProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function SearchSort({ search, onSearchChange, sortBy, onSortChange }: SearchSortProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex gap-4">
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search agents..."
          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="rating">Rating</option>
          <option value="name">Name</option>
          <option value="leads">Leads</option>
          <option value="deals">Deals</option>
        </select>
      </div>
    </div>
  );
}