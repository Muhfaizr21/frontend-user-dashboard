import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F9F8F5] p-6">
          <div className="max-w-md rounded-2xl border border-red-700 bg-white p-8 text-center shadow-lg">
            <div
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700"
            >
              <AlertOctagon className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-serif text-2xl text-[#111315]">
              Terjadi Kesalahan Aplikasi
            </h1>
            <p className="mt-2 text-sm text-[#5A6065]">
              {this.state.error?.message || 'Kesalahan tidak terduga pada antarmuka.'}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#111315] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#9A3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111315]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
