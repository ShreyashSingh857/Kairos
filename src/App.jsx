import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import AcademicHub from './pages/AcademicHub';
import VitalityHub from './pages/VitalityHub';
import ProductivityHub from './pages/ProductivityHub';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes wrapped in AppLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AcademicHub />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vitality"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <VitalityHub />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/productivity"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductivityHub />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
