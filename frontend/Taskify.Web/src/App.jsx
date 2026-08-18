import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';

import AppLayout from './components/layout/AppLayout';

import ProtectedRoute from './guards/ProtectedRoute';
import RoleRoute from './guards/RoleRoute';

export default function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          {/* Admin Only */}
          <Route
            element={
              <RoleRoute allowedRoles={['Admin']} />
            }
          >
            <Route
              path="/admin"
              element={<AdminDashboardPage />}
            />
          </Route>

        </Route>

      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<LoginPage />}
      />

    </Routes>
  );
}