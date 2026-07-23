'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Tailored dropdown — not a native <select>. A hairline-bordered trigger opens
 * an ivory panel; the chosen option is marked with the house gem (a gold
 * diamond) rather than a generic tick. Closes on outside click or Escape.
 */
export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select',
  ariaLabel,
  className = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 bg-ivory border border-gold-500/20 px-4 py-3 text-sm text-forest-900 hover:border-gold-500/45 focus:outline-none focus:border-gold-500/60 transition-colors"
      >
        <span className={selected ? '' : 'text-ink-muted'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gold-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-2 bg-ivory-card border border-gold-500/25 shadow-[0_20px_50px_-30px_rgba(31,27,20,0.6)] py-1 max-h-72 overflow-auto animate-rise"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    active ? 'text-gold-700' : 'text-forest-900 hover:bg-gold-100/40'
                  }`}
                >
                  {opt.label}
                  {active && <span className="w-2 h-2 rotate-45 bg-gold-500 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
