export interface DirectoryHeaderProps {
  readonly totalUsers: number;
  readonly filteredCount: number;
  readonly isLoading: boolean;
  readonly hasError: boolean;
  readonly onRefresh: () => void;
  readonly onSimulateError: () => void;
}

export function DirectoryHeader({
  totalUsers,
  filteredCount,
  isLoading,
  hasError,
  onRefresh,
  onSimulateError,
}: DirectoryHeaderProps) {
  const connectionStatusText = hasError
    ? 'Gangguan Koneksi'
    : isLoading
      ? 'Memuat Data'
      : 'Terhubung ke API';

  return (
    <header className="border-b border-[#E4E2DD] bg-[#F9F8F5]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-b border-[#E4E2DD] px-4 py-2.5 text-xs text-[#5A6065] sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 font-mono">
          <span className="inline-flex items-center gap-2 font-medium text-[#111315]">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${
                hasError
                  ? 'bg-red-700'
                  : isLoading
                    ? 'bg-amber-600'
                    : 'bg-[#047857]'
              }`}
            />
            <span>Status: {connectionStatusText}</span>
          </span>
          <span className="hidden text-[#5A6065] sm:inline" aria-hidden="true">
            |
          </span>
          <span className="hidden sm:inline">
            Sumber: jsonplaceholder.typicode.com/users (+5 sampel lokal)
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={onSimulateError}
            disabled={isLoading}
            title="Simulasikan error jaringan untuk menguji tampilan Error State"
            className="min-h-11 rounded-lg border border-[#948F86] bg-white px-3.5 py-2 text-xs font-semibold text-[#111315] transition-colors hover:border-red-700 hover:bg-red-50 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-red-100 disabled:opacity-50"
          >
            Uji Error API
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="min-h-11 rounded-lg border border-[#111315] bg-white px-3.5 py-2 text-xs font-semibold text-[#111315] transition-colors hover:bg-[#111315] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90 disabled:opacity-50"
          >
            {isLoading ? 'Memuat...' : 'Segarkan Direktori'}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#111315] sm:text-5xl">
              Direktori Pengguna &amp; Organisasi
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-[#5A6065] sm:text-base">
              Cari personel berdasarkan nama atau alamat email secara langsung, saring
              menurut wilayah domisili, dan klik baris atau kartu untuk memeriksa rincian
              alamat beserta perusahaan tempatnya bekerja.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#948F86] bg-[#948F86] sm:w-auto sm:min-w-[280px]">
            <div className="bg-white px-4 py-3">
              <span className="block font-mono text-[11px] font-medium tracking-wider text-[#5A6065] uppercase">
                Total Data
              </span>
              <span className="mt-1 block font-mono text-2xl font-semibold text-[#111315]">
                {isLoading ? '...' : String(totalUsers).padStart(2, '0')}
              </span>
            </div>
            <div className="bg-white px-4 py-3">
              <span className="block font-mono text-[11px] font-medium tracking-wider text-[#5A6065] uppercase">
                Hasil Filter
              </span>
              <span className="mt-1 block font-mono text-2xl font-semibold text-[#9A3412]">
                {isLoading ? '...' : String(filteredCount).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
