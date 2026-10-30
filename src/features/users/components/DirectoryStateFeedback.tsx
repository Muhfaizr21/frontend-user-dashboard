import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';
import type { ViewMode } from '../types/user.types';

export interface LoadingSkeletonProps {
  readonly viewMode: ViewMode;
  readonly count?: number;
}

export function LoadingSkeleton({ viewMode, count = 6 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (viewMode === 'table') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Sedang memuat daftar pengguna dari server"
        className="overflow-hidden rounded-xl border border-[#948F86] bg-white p-5"
      >
        <p className="mb-4 font-mono text-xs font-medium text-[#5A6065]">
          Sedang mengambil data personel dari endpoint /users...
        </p>
        <div className="space-y-4">
          {items.map((idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-[#E4E2DD] pb-4 last:border-none last:pb-0"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-md bg-[#E4E2DD]" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-[#E4E2DD]" />
                  <div className="h-3 w-24 rounded bg-[#F9F8F5]" />
                </div>
              </div>
              <div className="hidden h-3.5 w-40 rounded bg-[#E4E2DD] sm:block" />
              <div className="hidden h-3.5 w-32 rounded bg-[#E4E2DD] md:block" />
              <div className="h-7 w-16 rounded bg-[#E4E2DD]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Sedang memuat daftar pengguna dari server"
    >
      <p className="mb-4 font-mono text-xs font-medium text-[#5A6065]">
        Sedang mengambil data personel dari endpoint /users...
      </p>
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-5 lg:gap-6">
        {items.map((idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#948F86] bg-white p-5"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#E4E2DD] pb-3.5">
                <div className="h-3.5 w-16 rounded bg-[#E4E2DD]" />
                <div className="h-4 w-20 rounded-md bg-[#FFF7ED]" />
              </div>
              <div className="mt-4 flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-[#E4E2DD]" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-[#E4E2DD]" />
                  <div className="h-3 w-1/2 rounded bg-[#F9F8F5]" />
                </div>
              </div>
              <div className="mt-5 space-y-2.5 border-t border-dashed border-[#E4E2DD] pt-4">
                <div className="h-3 w-5/6 rounded bg-[#E4E2DD]" />
                <div className="h-3 w-2/3 rounded bg-[#E4E2DD]" />
                <div className="h-3 w-1/2 rounded bg-[#E4E2DD]" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#E4E2DD] pt-3">
              <div className="h-3 w-20 rounded bg-[#E4E2DD]" />
              <div className="h-8 w-24 rounded bg-[#E4E2DD]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ErrorFeedbackProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function ErrorFeedback({ message, onRetry }: ErrorFeedbackProps) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-2xl border border-red-700 bg-white p-8 text-center"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700"
      >
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="mt-4 font-mono text-xs font-semibold tracking-wider text-red-700 uppercase">
        Gangguan Koneksi API
      </p>
      <h2 className="mt-1 font-serif text-2xl font-normal text-[#111315]">
        Gagal Memuat Data Pengguna
      </h2>
      <p className="mt-2.5 text-sm leading-relaxed text-[#5A6065]">{message}</p>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#111315] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#9A3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>Muat Ulang Data</span>
        </button>
      </div>
    </div>
  );
}

export interface EmptySearchResultProps {
  readonly query: string;
  readonly onResetSearch: () => void;
}

export function EmptySearchResult({ query, onResetSearch }: EmptySearchResultProps) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[#948F86] bg-white p-10 text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#948F86] bg-[#F9F8F5] text-[#5A6065]"
      >
        <SearchX className="h-6 w-6" />
      </div>
      <p className="mt-4 font-mono text-xs font-medium text-[#5A6065] uppercase">
        Hasil Pencarian Kosong
      </p>
      <h2 className="mt-1 font-serif text-2xl font-normal text-[#111315]">
        Tidak Ada Pengguna yang Cocok
      </h2>
      <p className="mt-2 text-sm text-[#5A6065]">
        Tidak ditemukan personel dengan nama, alamat email, atau kota domisili yang
        sesuai dengan filter{' '}
        <span className="rounded border border-[#9A3412]/30 bg-[#FFF7ED] px-1.5 py-0.5 font-mono text-xs font-semibold text-[#9A3412]">
          {query}
        </span>
        .
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onResetSearch}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#111315] bg-white px-4 py-2.5 text-xs font-semibold text-[#111315] transition-colors hover:bg-[#111315] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90"
        >
          Reset Filter &amp; Pencarian
        </button>
      </div>
    </div>
  );
}
