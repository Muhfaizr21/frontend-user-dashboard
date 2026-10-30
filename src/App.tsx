import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { UserDashboardPage } from '@/features/users/components/UserDashboardPage';

export function App() {
  return (
    <ErrorBoundary>
      <UserDashboardPage />
    </ErrorBoundary>
  );
}

export default App;

