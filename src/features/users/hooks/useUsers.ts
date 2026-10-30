import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/httpClient';
import { defaultUserRepository } from '../services/userRepository';
import type { IUserRepository, User } from '../types/user.types';

export interface UseUsersResult {
  readonly users: User[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => void;
  readonly simulateError: () => void;
}

// Manages user fetching lifecycle with AbortController cleanup to prevent memory leaks and race conditions.
export function useUsers(
  repository: IUserRepository = defaultUserRepository
): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState<number>(0);
  const [shouldFailNext, setShouldFailNext] = useState<boolean>(false);

  const refetch = useCallback(() => {
    setShouldFailNext(false);
    setRequestVersion((prev) => prev + 1);
  }, []);

  const simulateError = useCallback(() => {
    setShouldFailNext(true);
    setRequestVersion((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    async function fetchUsersData() {
      setIsLoading(true);
      setError(null);

      try {
        if (shouldFailNext) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          throw new ApiError(
            'Simulasi Kegagalan API: Server mengembalikan status 503 Service Unavailable. Gunakan tombol "Muat Ulang Data" untuk memulihkan koneksi.',
            { statusCode: 503, endpoint: 'https://jsonplaceholder.typicode.com/users' }
          );
        }

        const data = await repository.getAllUsers(abortController.signal);

        if (isMounted && !abortController.signal.aborted) {
          setUsers(data);
        }
      } catch (err: unknown) {
        if (err instanceof ApiError && err.isAborted) {
          return;
        }
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        if (isMounted && !abortController.signal.aborted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan tidak terduga saat memuat data pengguna.';
          setError(message);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void fetchUsersData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [repository, requestVersion, shouldFailNext]);

  return {
    users,
    isLoading,
    error,
    refetch,
    simulateError,
  };
}
