import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    loading,
  } = useAuth();

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="fixed right-0 top-0 z-10 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-gray-200 bg-white px-6">

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Logout
        </button>

      </div>
    </header>
  );
}