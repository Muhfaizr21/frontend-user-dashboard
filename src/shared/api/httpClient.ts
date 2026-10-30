export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly endpoint?: string;
  public readonly isAborted: boolean;

  constructor(
    message: string,
    options?: { statusCode?: number; endpoint?: string; isAborted?: boolean }
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.endpoint = options?.endpoint;
    this.isAborted = options?.isAborted ?? false;
  }
}

export interface RequestConfig extends RequestInit {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10000;

// Combines caller AbortSignal with an internal timeout controller to prevent hanging requests.
export async function httpRequest<TResponse>(
  url: string,
  config: RequestConfig = {}
): Promise<TResponse> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal: externalSignal, ...fetchOptions } = config;

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

  const onExternalAbort = () => timeoutController.abort();
  externalSignal?.addEventListener('abort', onExternalAbort);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      throw new ApiError(
        `Gagal memuat data dari server (HTTP ${response.status}: ${response.statusText || 'Error'})`,
        {
          statusCode: response.status,
          endpoint: url,
        }
      );
    }

    const data = (await response.json()) as TResponse;
    return data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      const wasExternallyAborted = externalSignal?.aborted ?? false;
      throw new ApiError(
        wasExternallyAborted
          ? 'Permintaan data dibatalkan.'
          : 'Waktu koneksi habis (Request Timeout). Silakan periksa koneksi internet Anda.',
        {
          endpoint: url,
          isAborted: wasExternallyAborted,
        }
      );
    }

    const fallbackMessage =
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan jaringan yang tidak diketahui.';

    throw new ApiError(
      `Tidak dapat terhubung ke server API. Pastikan koneksi internet Anda aktif. (${fallbackMessage})`,
      { endpoint: url }
    );
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}
