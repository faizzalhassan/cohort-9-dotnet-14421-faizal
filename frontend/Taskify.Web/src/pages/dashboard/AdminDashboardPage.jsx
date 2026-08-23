import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome, {user?.firstName}. You have administrator access.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Administration
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Administrative features will be added in the upcoming modules.
        </p>
      </div>
    </div>
  );
}