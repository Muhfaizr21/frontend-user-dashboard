import { useMemo, useState, useTransition } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { SortField, SortOrder, User } from '../types/user.types';
import { filterUsersByQuery, sortUsers } from '../utils/userFilter';

export type PageSizeOption = 5 | 10 | 15;

export interface UseUserDirectoryFilterResult {
  readonly searchQuery: string;
  readonly debouncedQuery: string;
  readonly selectedCity: string;
  readonly availableCities: string[];
  readonly sortField: SortField;
  readonly sortOrder: SortOrder;
  readonly currentPage: number;
  readonly pageSize: PageSizeOption;
  readonly totalPages: number;
  readonly filteredUsers: User[];
  readonly paginatedUsers: User[];
  readonly startIndex: number;
  readonly endIndex: number;
  readonly isPendingFilter: boolean;
  readonly handleSearchChange: (value: string) => void;
  readonly handleClearSearch: () => void;
  readonly handleCityChange: (city: string) => void;
  readonly handleSortChange: (field: SortField) => void;
  readonly handlePageChange: (page: number) => void;
  readonly handlePageSizeChange: (size: PageSizeOption) => void;
}

// Separates immediate input state from low-priority filtering transitions to prevent UI blocking on large datasets.
export function useUserDirectoryFilter(
  users: readonly User[]
): UseUserDirectoryFilterResult {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deferredQuery, setDeferredQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(5);
  const [isPending, startTransition] = useTransition();

  const debouncedQuery = useDebounce(deferredQuery, 150);

  const availableCities = useMemo(() => {
    const citySet = new Set(users.map((u) => u.address.city));
    return Array.from(citySet).sort((a, b) => a.localeCompare(b, 'id'));
  }, [users]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    startTransition(() => {
      setDeferredQuery(value);
      setCurrentPage(1);
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCity('ALL');
    startTransition(() => {
      setDeferredQuery('');
      setCurrentPage(1);
    });
  };

  const handleCityChange = (city: string) => {
    startTransition(() => {
      setSelectedCity(city);
      setCurrentPage(1);
    });
  };

  const handleSortChange = (field: SortField) => {
    startTransition(() => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
      setCurrentPage(1);
    });
  };

  const handlePageSizeChange = (size: PageSizeOption) => {
    startTransition(() => {
      setPageSize(size);
      setCurrentPage(1);
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page);
    });
  };

  const filteredUsers = useMemo(() => {
    const matchedByQuery = filterUsersByQuery(users, deferredQuery);
    const matchedByCity =
      selectedCity === 'ALL'
        ? matchedByQuery
        : matchedByQuery.filter((u) => u.address.city === selectedCity);

    return sortUsers(matchedByCity, sortField, sortOrder);
  }, [users, deferredQuery, selectedCity, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    filteredUsers.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, filteredUsers.length);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  return {
    searchQuery,
    debouncedQuery,
    selectedCity,
    availableCities,
    sortField,
    sortOrder,
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    filteredUsers,
    paginatedUsers,
    startIndex,
    endIndex,
    isPendingFilter: isPending,
    handleSearchChange,
    handleClearSearch,
    handleCityChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
  };
}
