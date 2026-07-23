'use client';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
}

/**
 * Tailored radio group. The indicator is a thin gold ring that fills with the
 * house gem (a gold diamond) when chosen — a nod to the logo's gemstone arc.
 * The native input stays for keyboard and screen-reader support.
 */
export default function RadioGroup({ name, value, onChange, options, className = '' }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={className}>
      {options.map((opt) => {
        const checked = opt.value === value;
        return (
          <label key={opt.value} className="group inline-flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="sr-only peer"
            />
            <span className="relative w-[18px] h-[18px] rounded-full border border-gold-500/45 flex items-center justify-center transition-colors group-hover:border-gold-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold-500 peer-focus-visible:outline-offset-2">
              <span
                className={`w-2 h-2 rotate-45 bg-gold-500 transition-all duration-200 ${
                  checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              />
            </span>
            <span
              className={`text-sm transition-colors ${
                checked ? 'text-forest-900' : 'text-ink-muted group-hover:text-forest-800'
              }`}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
