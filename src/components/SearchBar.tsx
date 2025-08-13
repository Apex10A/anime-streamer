'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ className = '', placeholder = 'Search anime...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
          style={{
            '--focus-border-color': '#FF2400',
            '--focus-ring-color': 'rgba(255, 36, 0, 0.2)'
          } as React.CSSProperties}
          onFocus={(e) => {
            e.target.style.borderColor = '#FF2400';
            e.target.style.boxShadow = '0 0 0 2px rgba(255, 36, 0, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '';
            e.target.style.boxShadow = '';
          }}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 transition-colors"
          onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'}
          onMouseLeave={(e) => e.currentTarget.style.color = ''}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5-5 5M6 12h12"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}