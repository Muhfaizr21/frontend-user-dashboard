import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
} from 'lucide-react';
import { CustomSelect, type CustomSelectOption } from '@/shared/components/CustomSelect';
import type { PageSizeOption } from '../hooks/useUserDirectoryFilter';

export interface PaginationBarProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: PageSizeOption;
  readonly totalFiltered: number;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (size: PageSizeOption) => void;
}

const PAGE_SIZE_OPTIONS: readonly CustomSelectOption<PageSizeOption>[] = [
  {
    value: 5,
    label: '5 Data / Hal',
    badge: 'Ringkas',
    description: 'Tampilkan 5 entitas personel per halaman',
  },
  {
    value: 10,
    label: '10 Data / Hal',
    badge: 'Standar',
    description: 'Tampilkan 10 entitas personel per halaman',
  },
  {
    value: 15,
    label: '15 Data / Hal',
    badge: 'Semua',
    description: 'Tampilkan seluruh 15 entitas sekaligus',
  },
];

export function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  totalFiltered,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav
      aria-label="Navigasi Halaman Direktori"
      className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#948F86] bg-white px-5 py-4 sm:flex-row sm:items-center"
    >
      <div className="flex flex-wrap items-center gap-4">
        <CustomSelect<PageSizeOption>
          label="Tampilkan"
          ariaLabel="Jumlah Data Per Halaman"
          value={pageSize}
          options={PAGE_SIZE_OPTIONS}
          onChange={onPageSizeChange}
          icon={<Layers className="h-3.5 w-3.5" aria-hidden="true" />}
          minWidthClass="min-w-[230px]"
        />

        <div className="font-mono text-xs text-[#5A6065]">
          Menampilkan{' '}
          <span className="font-semibold text-[#111315]">
            {startIndex} sampai {endIndex}
          </span>{' '}
          dari <span className="font-semibold text-[#9A3412]">{totalFiltered}</span>{' '}
          personel
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Halaman pertama"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#948F86] bg-[#F9F8F5] text-[#111315] transition-colors hover:border-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#E4E2DD] disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="flex min-h-11 items-center gap-1 rounded-lg border border-[#948F86] bg-[#F9F8F5] px-3 font-mono text-xs font-semibold text-[#111315] transition-colors hover:border-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#E4E2DD] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {pageNumbers.map((page) => {
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Halaman ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg font-mono text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] ${
                  isCurrent
                    ? 'bg-[#111315] text-white'
                    : 'border border-[#948F86] bg-white text-[#111315] hover:bg-[#F9F8F5] active:bg-[#E4E2DD]'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="flex min-h-11 items-center gap-1 rounded-lg border border-[#948F86] bg-[#F9F8F5] px-3 font-mono text-xs font-semibold text-[#111315] transition-colors hover:border-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#E4E2DD] disabled:opacity-40"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman terakhir"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#948F86] bg-[#F9F8F5] text-[#111315] transition-colors hover:border-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#E4E2DD] disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
