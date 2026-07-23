'use client';

import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  className?: string;
}

/**
 * Tailored checkbox — a thin gold-outlined square that fills gold with a deep
 * forest check when selected. Square corners keep it in the house language.
 */
export default function Checkbox({ checked, onChange, label, id, className = '' }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`group inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        className={`relative w-[18px] h-[18px] border flex items-center justify-center transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold-500 peer-focus-visible:outline-offset-2 ${
          checked ? 'bg-gold-500 border-gold-500' : 'border-gold-500/45 group-hover:border-gold-500'
        }`}
      >
        <Check
          className={`w-3 h-3 text-forest-900 transition-all duration-200 ${
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          strokeWidth={2.5}
        />
      </span>
      <span
        className={`text-sm transition-colors ${
          checked ? 'text-forest-900' : 'text-ink-muted group-hover:text-forest-800'
        }`}
      >
        {label}
      </span>
    </label>
  );
}
