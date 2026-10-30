import { useRef } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Filter,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CustomSelect, type CustomSelectOption } from '@/shared/components/CustomSelect';
import { useKeyboardShortcut } from '@/shared/hooks/useKeyboardShortcut';
import type { SortField, SortOrder, ViewMode } from '../types/user.types';

export interface SearchAndControlsProps {
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
  readonly onClearSearch: () => void;
  readonly selectedCity: string;
  readonly availableCities: readonly string[];
  readonly onCityChange: (city: string) => void;
  readonly viewMode: ViewMode;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly sortField: SortField;
  readonly sortOrder: SortOrder;
  readonly onSortChange: (field: SortField) => void;
  readonly disabled?: boolean;
}

const SORT_OPTIONS: readonly CustomSelectOption<SortField>[] = [
  {
    value: 'id',
    label: 'ID Pengguna',
    badge: '#01..15',
    description: 'Urutkan berdasarkan nomor registrasi sistem',
  },
  {
    value: 'name',
    label: 'Nama Lengkap',
    badge: 'A..Z',
    description: 'Urutkan alfabetis berdasarkan nama personel',
  },
  {
    value: 'email',
    label: 'Alamat Email',
    badge: '@',
    description: 'Urutkan berdasarkan alamat korespondensi email',
  },
  {
    value: 'company',
    label: 'Perusahaan',
    badge: 'ORG',
    description: 'Urutkan berdasarkan entitas organisasi kerja',
  },
  {
    value: 'city',
    label: 'Kota Domisili',
    badge: 'GEO',
    description: 'Urutkan berdasarkan lokasi kota tempat tinggal',
  },
];

export function SearchAndControls({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedCity,
  availableCities,
  onCityChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSortChange,
  disabled = false,
}: SearchAndControlsProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut('/', (event) => {
    if (document.activeElement !== searchInputRef.current) {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
  });

  useKeyboardShortcut(
    'k',
    (event) => {
      event.preventDefault();
      searchInputRef.current?.focus();
    },
    { ctrlOrMeta: true }
  );

  const cityOptions: CustomSelectOption<string>[] = [
    {
      value: 'ALL',
      label: 'Semua Kota',
      badge: `${availableCities.length} Kota`,
      description: 'Tampilkan personel dari seluruh wilayah domisili',
    },
    ...availableCities.map((city) => ({
      value: city,
      label: city,
      description: `Filter personel berdomisili di ${city}`,
    })),
  ];

  const hasActiveFilter = Boolean(searchQuery) || selectedCity !== 'ALL';

  return (
    <section
      aria-label="Filter dan Pengaturan Tampilan"
      className="sticky top-0 z-30 border-b border-[#E4E2DD] bg-[#F9F8F5]/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label
              htmlFor="user-search-input"
              className="mb-1.5 block font-mono text-[11px] font-semibold tracking-wider text-[#5A6065] uppercase"
            >
              Cari Personel (Nama atau Email)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A6065]">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                ref={searchInputRef}
                id="user-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={disabled}
                placeholder="Ketik nama personel atau email... (Tekan '/' untuk fokus)"
                className="min-h-11 w-full rounded-xl border border-[#948F86] bg-white py-2.5 pr-24 pl-10 text-sm text-[#111315] placeholder-[#5A6065] transition-colors focus:border-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] disabled:bg-gray-100"
              />
              {hasActiveFilter ? (
                <button
                  type="button"
                  onClick={() => {
                    onClearSearch();
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Bersihkan pencarian dan filter"
                  className="absolute inset-y-0 right-2 my-auto flex min-h-8 items-center gap-1 rounded-lg border border-[#948F86] bg-[#F9F8F5] px-2.5 font-mono text-xs font-semibold text-[#111315] transition-colors hover:border-[#111315] hover:bg-[#111315] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              ) : (
                <div
                  className="pointer-events-none absolute inset-y-0 right-3 hidden items-center sm:flex"
                  aria-hidden="true"
                >
                  <kbd className="rounded-md border border-[#948F86] bg-[#F9F8F5] px-2 py-0.5 font-mono text-[11px] font-medium text-[#5A6065]">
                    /
                  </kbd>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
            <CustomSelect<string>
              label="Wilayah"
              ariaLabel="Filter Wilayah Kota Domisili"
              value={selectedCity}
              options={cityOptions}
              onChange={onCityChange}
              disabled={disabled}
              icon={<Filter className="h-3.5 w-3.5" aria-hidden="true" />}
              align="right"
              minWidthClass="min-w-[240px]"
            />

            <div className="flex items-center gap-2">
              <CustomSelect<SortField>
                label="Urutkan"
                ariaLabel="Kriteria Pengurutan Data"
                value={sortField}
                options={SORT_OPTIONS}
                onChange={onSortChange}
                disabled={disabled}
                icon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />}
                align="right"
                minWidthClass="min-w-[250px]"
              />

              <button
                type="button"
                disabled={disabled}
                onClick={() => onSortChange(sortField)}
                aria-label={`Ubah arah urutan, saat ini ${
                  sortOrder === 'asc' ? 'naik A ke Z' : 'turun Z ke A'
                }`}
                title={`Urutan saat ini: ${
                  sortOrder === 'asc' ? 'Naik (Ascending)' : 'Turun (Descending)'
                }`}
                className="flex min-h-11 items-center gap-1.5 rounded-xl border border-[#948F86] bg-white px-3.5 py-2 font-mono text-xs font-semibold text-[#111315] transition-colors hover:border-[#111315] hover:bg-[#FFF7ED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#E4E2DD] disabled:opacity-50"
              >
                {sortOrder === 'asc' ? (
                  <ArrowUp className="h-3.5 w-3.5 text-[#9A3412]" aria-hidden="true" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5 text-[#9A3412]" aria-hidden="true" />
                )}
                <span>{sortOrder.toUpperCase()}</span>
              </button>
            </div>

            <div
              role="group"
              aria-label="Mode tampilan daftar pengguna"
              className="inline-flex rounded-xl border border-[#948F86] bg-white p-1"
            >
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] ${
                  viewMode === 'grid'
                    ? 'bg-[#111315] text-white'
                    : 'text-[#5A6065] hover:text-[#111315] active:bg-[#F9F8F5]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Grid Card</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                aria-pressed={viewMode === 'table'}
                className={`flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] ${
                  viewMode === 'table'
                    ? 'bg-[#111315] text-white'
                    : 'text-[#5A6065] hover:text-[#111315] active:bg-[#F9F8F5]'
                }`}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tabel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
