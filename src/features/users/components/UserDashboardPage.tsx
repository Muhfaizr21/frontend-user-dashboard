import { useState } from 'react';
import { DirectoryHeader } from './DirectoryHeader';
import {
  EmptySearchResult,
  ErrorFeedback,
  LoadingSkeleton,
} from './DirectoryStateFeedback';
import { PaginationBar } from './PaginationBar';
import { SearchAndControls } from './SearchAndControls';
import { UserDetailModal } from './UserDetailModal';
import { UserGridCard } from './UserGridCard';
import { UserTable } from './UserTable';
import { useUserDirectoryFilter } from '../hooks/useUserDirectoryFilter';
import { useUsers } from '../hooks/useUsers';
import type { IUserRepository, User, ViewMode } from '../types/user.types';

export interface UserDashboardPageProps {
  readonly repository?: IUserRepository;
}

export function UserDashboardPage({ repository }: UserDashboardPageProps) {
  const { users, isLoading, error, refetch, simulateError } = useUsers(repository);
  const {
    searchQuery,
    selectedCity,
    availableCities,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
    totalPages,
    filteredUsers,
    paginatedUsers,
    startIndex,
    endIndex,
    handleSearchChange,
    handleClearSearch,
    handleCityChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
  } = useUserDirectoryFilter(users);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F5] text-[#111315]">
      <DirectoryHeader
        totalUsers={users.length}
        filteredCount={filteredUsers.length}
        isLoading={isLoading}
        hasError={Boolean(error)}
        onRefresh={refetch}
        onSimulateError={simulateError}
      />

      <SearchAndControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        selectedCity={selectedCity}
        availableCities={availableCities}
        onCityChange={handleCityChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        disabled={isLoading || Boolean(error)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <LoadingSkeleton viewMode={viewMode} count={pageSize} />
        ) : error ? (
          <ErrorFeedback message={error} onRetry={refetch} />
        ) : filteredUsers.length === 0 ? (
          <EmptySearchResult
            query={searchQuery || selectedCity}
            onResetSearch={handleClearSearch}
          />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-5 lg:gap-6">
                {paginatedUsers.map((user) => (
                  <UserGridCard
                    key={user.id}
                    user={user}
                    onSelectUser={setSelectedUser}
                  />
                ))}
              </div>
            ) : (
              <UserTable
                users={paginatedUsers}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                onSelectUser={setSelectedUser}
              />
            )}

            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalFiltered={filteredUsers.length}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-[#E4E2DD] bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 font-mono text-xs text-[#5A6065] sm:flex-row sm:px-6 lg:px-8">
          <span>DIREKTORI PERSONEL // REACT 19 + VITE + TAILWINDCSS</span>
          <span>ARSITEKTUR: CLEAN CODE &amp; SOLID</span>
        </div>
      </footer>

      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
