import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  suggestions: string[];
  onSubmit: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  suggestions, 
  onSubmit, 
  placeholder,
  disabled = false 
}) => {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [input, suggestions]);

  const handleSubmit = (value: string) => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSubmit(filteredSuggestions[selectedIndex]);
      } else if (input.trim()) {
        handleSubmit(input);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-4 py-3 border-2 rounded-lg text-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-lol-gold focus:border-lol-gold
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800'}
            transition-all duration-200
          `}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSubmit(suggestion)}
              className={`
                w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150
                ${index === selectedIndex ? 'bg-lol-gold text-white' : 'text-gray-800'}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;