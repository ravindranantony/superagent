import { SupabaseProvider } from './providers/SupabaseProvider';
import TaskManager from './components/TaskManager';
import AuthGuard from './components/AuthGuard';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <SupabaseProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <AuthGuard>
            <TaskManager />
          </AuthGuard>
        </main>
      </div>
    </SupabaseProvider>
  );
}