import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';

import TasksPage from './pages/tasks/TasksPage';
import AssignedTasksPage from './pages/tasks/AssignedTasksPage';
import PendingTasksPage from './pages/tasks/PendingTasksPage';
import InProgressTasksPage from './pages/tasks/InProgressTasksPage';
import CompletedTasksPage from './pages/tasks/CompletedTasksPage';
import OverdueTasksPage from './pages/tasks/OverdueTasksPage';
import CancelledTasksPage from './pages/tasks/CancelledTasksPage';

import AdminTasksPage from './pages/admin/AdminTasksPage';
import UsersPage from './pages/admin/Users';

import UserProfile from './pages/profile/UserProfile';
import AdminProfile from './pages/profile/AdminProfile';

import AppLayout from './components/layout/AppLayout';

import ProtectedRoute from './guards/ProtectedRoute';
import RoleRoute from './guards/RoleRoute';

export default function App() {
  return (
    <Routes>

      {/* ============================================================
          Public Routes
      ============================================================ */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* ============================================================
          Protected Routes
      ============================================================ */}

      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

          {/* ========================================================
              User Routes
          ======================================================== */}

          <Route
            path="/tasks"
            element={<TasksPage />}
          />

          <Route
            path="/tasks/assigned"
            element={<AssignedTasksPage />}
          />

          <Route
            path="/tasks/pending"
            element={<PendingTasksPage />}
          />

          <Route
            path="/tasks/in-progress"
            element={<InProgressTasksPage />}
          />

          <Route
            path="/tasks/completed"
            element={<CompletedTasksPage />}
          />

          <Route
            path="/tasks/overdue"
            element={<OverdueTasksPage />}
          />

          <Route
            path="/tasks/cancelled"
            element={<CancelledTasksPage />}
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={<UserProfile />}
          />

          {/* ========================================================
              Admin Only Routes
          ======================================================== */}

          <Route
            element={
              <RoleRoute allowedRoles={['Admin']} />
            }
          >

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={<AdminDashboardPage />}
            />

            {/* Admin Tasks */}
            <Route
              path="/admin/tasks"
              element={<AdminTasksPage />}
            />

            {/* Admin Users */}
            <Route
              path="/admin/users"
              element={<UsersPage />}
            />

            {/* Admin Profile */}
            <Route
              path="/admin/profile"
              element={<AdminProfile />}
            />

          </Route>

        </Route>

      </Route>

      {/* ============================================================
          Fallback
      ============================================================ */}

      <Route
        path="*"
        element={<LoginPage />}
      />

    </Routes>
  );
}