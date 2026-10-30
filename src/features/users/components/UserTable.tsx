import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Mail,
  MapPin,
} from 'lucide-react';
import type { SortField, SortOrder, User } from '../types/user.types';
import { getUserInitials } from '../utils/userFilter';

export interface UserTableProps {
  readonly users: readonly User[];
  readonly sortField: SortField;
  readonly sortOrder: SortOrder;
  readonly onSortChange: (field: SortField) => void;
  readonly onSelectUser: (user: User) => void;
}

interface SortableHeaderProps {
  readonly label: string;
  readonly field: SortField;
  readonly currentField: SortField;
  readonly currentOrder: SortOrder;
  readonly onSort: (field: SortField) => void;
  readonly className?: string;
}

function SortableColumnHeader({
  label,
  field,
  currentField,
  currentOrder,
  onSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = currentField === field;
  const ariaSortValue = isActive
    ? currentOrder === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSortValue}
      className={`select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        title={`Urutkan berdasarkan ${label} (${
          isActive && currentOrder === 'asc' ? 'DESC' : 'ASC'
        })`}
        className={`group/th inline-flex min-h-11 w-full items-center gap-1.5 py-3 text-left font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] ${
          isActive
            ? 'text-[#111315]'
            : 'text-[#5A6065] hover:text-[#111315]'
        }`}
      >
        <span>{label}</span>
        <span
          className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] transition-colors ${
            isActive
              ? 'border border-[#9A3412]/30 bg-[#FFF7ED] text-[#9A3412]'
              : 'text-[#5A6065] group-hover/th:bg-[#E4E2DD] group-hover/th:text-[#111315]'
          }`}
        >
          {isActive ? (
            <>
              {currentOrder === 'asc' ? (
                <ArrowUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ArrowDown className="h-3 w-3" aria-hidden="true" />
              )}
              <span>{currentOrder.toUpperCase()}</span>
            </>
          ) : (
            <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
          )}
        </span>
      </button>
    </th>
  );
}

export function UserTable({
  users,
  sortField,
  sortOrder,
  onSortChange,
  onSelectUser,
}: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#948F86] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#948F86] bg-[#F9F8F5]">
              <SortableColumnHeader
                label="ID"
                field="id"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSortChange}
                className="pr-3 pl-5"
              />
              <SortableColumnHeader
                label="Personel"
                field="name"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSortChange}
                className="px-3"
              />
              <SortableColumnHeader
                label="Kontak Email"
                field="email"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSortChange}
                className="px-3"
              />
              <SortableColumnHeader
                label="Organisasi / Perusahaan"
                field="company"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSortChange}
                className="hidden px-3 md:table-cell"
              />
              <SortableColumnHeader
                label="Domisili"
                field="city"
                currentField={sortField}
                currentOrder={sortOrder}
                onSort={onSortChange}
                className="hidden px-3 lg:table-cell"
              />
              <th
                scope="col"
                className="py-3.5 pr-5 pl-3 text-right font-mono text-[11px] font-semibold tracking-wider text-[#5A6065] uppercase"
              >
                Tindakan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DD]">
            {users.map((user) => {
              const initials = getUserInitials(user.name);
              const formattedId = `#${String(user.id).padStart(2, '0')}`;

              return (
                <tr
                  key={user.id}
                  className="group transition-colors hover:bg-[#FFF7ED]/60"
                >
                  <td className="py-4 pr-3 pl-5 font-mono text-xs font-medium text-[#5A6065] whitespace-nowrap">
                    {formattedId}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#948F86] bg-[#F9F8F5] font-serif text-sm font-medium text-[#111315] transition-colors group-hover:border-[#111315] group-hover:bg-[#111315] group-hover:text-white"
                      >
                        {initials}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectUser(user)}
                          className="text-left font-serif text-base font-normal text-[#111315] hover:text-[#9A3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315]"
                        >
                          {user.name}
                        </button>
                        <div className="font-mono text-[11px] text-[#5A6065]">
                          @{user.username.toLowerCase()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#111315]">
                      <Mail className="h-3.5 w-3.5 text-[#5A6065]" aria-hidden="true" />
                      <span>{user.email}</span>
                    </div>
                  </td>

                  <td className="hidden px-3 py-4 whitespace-nowrap md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#111315]">
                      <Building2 className="h-3.5 w-3.5 text-[#5A6065]" aria-hidden="true" />
                      <span>{user.company.name}</span>
                    </div>
                    <div className="mt-0.5 max-w-[220px] truncate text-[11px] text-[#5A6065] italic">
                      {user.company.catchPhrase}
                    </div>
                  </td>

                  <td className="hidden px-3 py-4 whitespace-nowrap lg:table-cell">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#5A6065]">
                      <MapPin className="h-3.5 w-3.5 text-[#5A6065]" aria-hidden="true" />
                      <span>{user.address.city}</span>
                    </div>
                  </td>

                  <td className="py-4 pr-5 pl-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectUser(user)}
                      aria-label={`Lihat rincian ${user.name}`}
                      className="inline-flex min-h-11 items-center rounded-lg border border-[#111315] bg-white px-3.5 py-2 font-mono text-xs font-semibold text-[#111315] transition-colors hover:bg-[#111315] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315] active:bg-[#111315]/90"
                    >
                      Lihat Rincian
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
