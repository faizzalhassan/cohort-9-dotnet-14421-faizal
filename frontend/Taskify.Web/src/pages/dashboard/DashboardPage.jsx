import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {user?.firstName}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome to your Taskify dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Projects
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Tasks
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            0
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Role
          </p>

          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {user?.role || 'User'}
          </p>
        </div>

      </div>
    </div>
  );
}