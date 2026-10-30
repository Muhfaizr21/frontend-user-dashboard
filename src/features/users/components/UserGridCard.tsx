import { Building2, Globe, Mail, MapPin, Phone } from 'lucide-react';
import type { User } from '../types/user.types';
import { getUserInitials } from '../utils/userFilter';

export interface UserGridCardProps {
  readonly user: User;
  readonly onSelectUser: (user: User) => void;
}

export function UserGridCard({ user, onSelectUser }: UserGridCardProps) {
  const initials = getUserInitials(user.name);
  const formattedId = `USR-${String(user.id).padStart(3, '0')}`;
  const strategyTags = user.company.bs.split(' ').slice(0, 3);

  return (
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#948F86] bg-white transition-colors duration-150 hover:border-[#111315]">
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#E4E2DD] bg-[#F9F8F5] px-3.5 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-[#111315] sm:text-[11px]">
            {formattedId}
          </span>
          <span className="rounded border border-[#E4E2DD] bg-white px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#5A6065] sm:text-[10px]">
            {user.isSupplemental ? 'Sampel Lokal' : 'API Publik'}
          </span>
        </div>

        <span className="max-w-[110px] truncate rounded-md border border-[#9A3412]/30 bg-[#FFF7ED] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#9A3412] sm:max-w-none sm:px-2 sm:text-[11px]">
          @{user.username.toLowerCase()}
        </span>
      </div>

      <div className="flex-1 p-3.5 sm:p-5">
        <div className="flex items-start gap-2.5 sm:gap-4">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#948F86] bg-[#F9F8F5] font-serif text-base font-medium text-[#111315] transition-colors group-hover:border-[#111315] group-hover:bg-[#111315] group-hover:text-white sm:h-12 sm:w-12 sm:text-xl"
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-lg leading-snug font-normal text-[#111315] sm:text-2xl">
              <button
                type="button"
                onClick={() => onSelectUser(user)}
                className="text-left transition-colors hover:text-[#9A3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315]"
              >
                {user.name}
              </button>
            </h2>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-semibold text-[#5A6065] sm:mt-1 sm:gap-1.5 sm:text-xs">
              <Building2
                className="h-3 w-3 shrink-0 text-[#9A3412] sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
              <span className="truncate">{user.company.name}</span>
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-[#E4E2DD] bg-[#F9F8F5] p-2.5 sm:mt-4 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-[#5A6065] uppercase sm:text-[10px]">
              Fokus Organisasi
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] text-[#111315] italic sm:text-xs">
            {user.company.catchPhrase}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {strategyTags.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="rounded border border-[#E4E2DD] bg-white px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#5A6065] sm:text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-3 space-y-1.5 text-xs sm:mt-4 sm:space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E4E2DD] bg-[#F9F8F5]/60 px-2 py-1.5 sm:px-2.5">
            <dt className="flex shrink-0 items-center gap-1.5 text-[#5A6065]">
              <Mail
                className="h-3 w-3 shrink-0 text-[#9A3412] sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
              <span className="hidden font-mono text-[10px] font-medium uppercase sm:inline">
                Email
              </span>
            </dt>
            <dd className="min-w-0 truncate font-mono text-[10px] font-medium text-[#111315] sm:text-[11px]">
              {user.email}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E4E2DD] bg-[#F9F8F5]/60 px-2 py-1.5 sm:px-2.5">
            <dt className="flex shrink-0 items-center gap-1.5 text-[#5A6065]">
              <MapPin
                className="h-3 w-3 shrink-0 text-[#9A3412] sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
              <span className="hidden font-mono text-[10px] font-medium uppercase sm:inline">
                Kota
              </span>
            </dt>
            <dd className="min-w-0 truncate text-[11px] font-medium text-[#111315] sm:text-xs">
              {user.address.city}{' '}
              <span className="hidden font-mono text-[10px] text-[#5A6065] sm:inline">
                ({user.address.zipcode.slice(0, 5)})
              </span>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E4E2DD] bg-[#F9F8F5]/60 px-2 py-1.5 sm:px-2.5">
            <dt className="flex shrink-0 items-center gap-1.5 text-[#5A6065]">
              <Phone
                className="h-3 w-3 shrink-0 text-[#9A3412] sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
              <span className="hidden font-mono text-[10px] font-medium uppercase sm:inline">
                Telp
              </span>
            </dt>
            <dd className="min-w-0 truncate font-mono text-[10px] text-[#111315] sm:text-[11px]">
              {user.phone}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#E4E2DD] bg-[#F9F8F5] px-3.5 py-2.5 text-xs sm:px-5 sm:py-3">
        <span className="inline-flex min-w-0 items-center gap-1 truncate font-mono text-[10px] text-[#5A6065] sm:text-[11px]">
          <Globe className="h-3 w-3 shrink-0 text-[#5A6065]" aria-hidden="true" />
          <span className="truncate">{user.website}</span>
        </span>

        <button
          type="button"
          onClick={() => onSelectUser(user)}
          aria-label={`Buka rincian lengkap ${user.name}`}
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-[#111315] bg-white px-3 py-2 font-mono text-[10px] font-semibold text-[#111315] transition-colors hover:bg-[#111315] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90 sm:px-3.5 sm:text-[11px]"
        >
          <span>Lihat Rincian</span>
        </button>
      </div>
    </article>
  );
}
