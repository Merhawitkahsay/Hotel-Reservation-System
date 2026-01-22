import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search...", value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <input 
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-text-secondary focus:border-transparent outline-none transition-all"
    />
  </div>
);

export default SearchBar;