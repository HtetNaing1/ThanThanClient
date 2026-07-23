'use client';

import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Tailored search field — ivory surface, thin gold hairline, a gold loupe icon,
 * and a clear control that appears once you've typed.
 */
export default function SearchField({
  value,
  onChange,
  placeholder,
  className = '',
  'aria-label': ariaLabel,
}: SearchFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600/80"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="w-full bg-ivory border border-gold-500/20 pl-11 pr-10 py-3 text-sm text-forest-900 placeholder:text-ink-muted/60 focus:outline-none focus:border-gold-500/60 hover:border-gold-500/40 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-ink-muted hover:text-forest-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
