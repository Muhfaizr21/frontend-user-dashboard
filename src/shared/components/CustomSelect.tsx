import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface CustomSelectOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
  readonly badge?: string;
  readonly description?: string;
}

export interface CustomSelectProps<T extends string | number> {
  readonly label?: string;
  readonly ariaLabel: string;
  readonly value: T;
  readonly options: readonly CustomSelectOption<T>[];
  readonly onChange: (value: T) => void;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly align?: 'left' | 'right';
  readonly minWidthClass?: string;
}

export function CustomSelect<T extends string | number>({
  label,
  ariaLabel,
  value,
  options,
  onChange,
  disabled = false,
  icon,
  align = 'left',
  minWidthClass = 'min-w-[220px]',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex min-h-11 items-center justify-between gap-2.5 rounded-xl border bg-white px-3.5 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#F9F8F5] disabled:opacity-50 ${
          isOpen
            ? 'border-[#111315] ring-2 ring-[#111315]/15'
            : 'border-[#948F86] hover:border-[#111315]'
        }`}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-[#9A3412]" aria-hidden="true">
              {icon}
            </span>
          )}
          {label && (
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#5A6065] uppercase">
              {label}:
            </span>
          )}
          <span className="font-semibold text-[#111315]">
            {selectedOption?.label}
          </span>
          {selectedOption?.badge && (
            <span className="rounded border border-[#9A3412]/30 bg-[#FFF7ED] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#9A3412]">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-[#5A6065] transition-transform duration-150 group-hover:text-[#111315] ${
            isOpen ? 'rotate-180 text-[#111315]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute z-40 mt-2 ${minWidthClass} max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#111315] bg-white p-1.5 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="border-b border-[#E4E2DD] px-2.5 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#5A6065] uppercase">
            {ariaLabel}
          </div>

          <ul className="mt-1 max-h-64 space-y-1 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;

              return (
                <li key={String(opt.value)}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] ${
                      isSelected
                        ? 'bg-[#111315] font-semibold text-white'
                        : 'text-[#111315] hover:bg-[#F9F8F5] active:bg-[#E4E2DD]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-[#FFF7ED] text-[#9A3412]'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.description && (
                        <p
                          className={`mt-0.5 truncate text-[11px] font-normal ${
                            isSelected ? 'text-white/85' : 'text-[#5A6065]'
                          }`}
                        >
                          {opt.description}
                        </p>
                      )}
                    </div>

                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {isSelected && (
                        <Check className="h-4 w-4 text-white" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
