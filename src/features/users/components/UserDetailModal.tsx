import { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Briefcase,
  X,
} from 'lucide-react';
import { useKeyboardShortcut } from '@/shared/hooks/useKeyboardShortcut';
import type { User } from '../types/user.types';
import { formatFullAddress, getUserInitials } from '../utils/userFilter';

export interface UserDetailModalProps {
  readonly user: User | null;
  readonly onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useKeyboardShortcut('Escape', () => {
    if (user) onClose();
  });

  useEffect(() => {
    if (!user) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [user]);

  if (!user) return null;

  const initials = getUserInitials(user.name);
  const fullAddress = formatFullAddress(user);
  const formattedId = `USR-${String(user.id).padStart(4, '0')}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${user.address.geo.lat},${user.address.geo.lng}`
  )}`;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-user-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#111315]/60 transition-opacity"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#111315] bg-[#F9F8F5] shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E2DD] bg-[#111315] px-6 py-3 text-white">
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span>RINCIAN PERSONEL // {formattedId}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal rincian pengguna"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>Tutup (ESC)</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-[#E4E2DD] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#111315] bg-white font-serif text-2xl font-medium text-[#111315]"
              >
                {initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="modal-user-name"
                    className="font-serif text-3xl font-normal text-[#111315]"
                  >
                    {user.name}
                  </h2>
                  <span className="rounded-md border border-[#9A3412]/30 bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#9A3412]">
                    @{user.username.toLowerCase()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#5A6065]">
                  Bekerja di{' '}
                  <strong className="font-semibold text-[#111315]">
                    {user.company.name}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-[#5A6065] uppercase">
              Saluran Komunikasi &amp; Kontak
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border border-[#948F86] bg-white p-3.5">
                <div className="flex items-center justify-between text-xs text-[#5A6065]">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Mail className="h-3.5 w-3.5 text-[#9A3412]" aria-hidden="true" />
                    Email
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(user.email, 'email')}
                    aria-label="Salin alamat email"
                    className="flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-[#E4E2DD] text-[#5A6065] hover:border-[#111315] hover:bg-[#F9F8F5] hover:text-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315]"
                    title="Salin alamat email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${user.email}`}
                  className="mt-2 truncate font-mono text-xs font-medium text-[#111315] underline decoration-[#948F86] underline-offset-4 hover:decoration-[#9A3412]"
                >
                  {user.email}
                </a>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-[#948F86] bg-white p-3.5">
                <div className="flex items-center justify-between text-xs text-[#5A6065]">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Phone className="h-3.5 w-3.5 text-[#9A3412]" aria-hidden="true" />
                    Telepon
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(user.phone, 'phone')}
                    aria-label="Salin nomor telepon"
                    className="flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-[#E4E2DD] text-[#5A6065] hover:border-[#111315] hover:bg-[#F9F8F5] hover:text-[#111315] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315]"
                    title="Salin nomor telepon"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <span className="mt-2 truncate font-mono text-xs font-medium text-[#111315]">
                  {user.phone}
                </span>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-[#948F86] bg-white p-3.5">
                <div className="flex items-center justify-between text-xs text-[#5A6065]">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Globe className="h-3.5 w-3.5 text-[#9A3412]" aria-hidden="true" />
                    Situs Web
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#5A6065]" aria-hidden="true" />
                </div>
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 truncate font-mono text-xs font-medium text-[#111315] underline decoration-[#948F86] underline-offset-4 hover:decoration-[#9A3412]"
                >
                  {user.website}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-[#5A6065] uppercase">
              Alamat Domisili &amp; Koordinat Geografis
            </h3>
            <div className="mt-3 rounded-xl border border-[#948F86] bg-white p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#111315]">
                    <MapPin className="h-4 w-4 text-[#9A3412]" aria-hidden="true" />
                    <span>{fullAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1 text-xs text-[#5A6065] sm:grid-cols-4">
                    <div>
                      <span className="block font-mono text-[10px] uppercase">Jalan</span>
                      <span className="font-medium text-[#111315]">{user.address.street}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase">Unit / Suite</span>
                      <span className="font-medium text-[#111315]">{user.address.suite}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase">Kota</span>
                      <span className="font-medium text-[#111315]">{user.address.city}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] uppercase">Kode Pos</span>
                      <span className="font-mono font-medium text-[#111315]">
                        {user.address.zipcode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start justify-between rounded-lg border border-[#E4E2DD] bg-[#F9F8F5] p-3 sm:items-end">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#5A6065]">
                    <Navigation className="h-3 w-3 text-[#9A3412]" aria-hidden="true" />
                    <span>
                      LAT: {user.address.geo.lat} / LNG: {user.address.geo.lng}
                    </span>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#9A3412] underline underline-offset-4 hover:text-[#111315]"
                  >
                    <span>Lihat di Google Maps</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-mono text-xs font-semibold tracking-wider text-[#5A6065] uppercase">
              Profil Perusahaan &amp; Entitas Bisnis
            </h3>
            <div className="mt-3 rounded-xl border border-[#948F86] bg-white p-5">
              <div className="flex items-start gap-3.5">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#9A3412]/30 bg-[#FFF7ED] text-[#9A3412]"
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-xl font-normal text-[#111315]">
                    {user.company.name}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-[#5A6065] italic">
                    {user.company.catchPhrase}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-[#E4E2DD] pt-3">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#5A6065]">
                      <Briefcase className="h-3 w-3 text-[#5A6065]" aria-hidden="true" />
                      FOKUS STRATEGIS:
                    </span>
                    {user.company.bs.split(' ').map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="rounded border border-[#E4E2DD] bg-[#F9F8F5] px-2 py-0.5 font-mono text-[11px] font-medium text-[#111315]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E2DD] pt-4">
            <span className="font-mono text-xs text-[#5A6065]">
              Sumber Data:{' '}
              <strong className="text-[#111315]">
                {user.isSupplemental
                  ? 'Data Sampel Tambahan Lokal (ID #11..15)'
                  : 'JSONPlaceholder Public API (ID #1..10)'}
              </strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-lg bg-[#111315] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#9A3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
