import React, { ChangeEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...'
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar">
      <div className="search-icon">🔍</div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search tasks"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="search-clear"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};