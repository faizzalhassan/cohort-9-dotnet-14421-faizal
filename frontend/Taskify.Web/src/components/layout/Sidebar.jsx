import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ─── Tabler icon helper ─────────────────────────────────────────────────────
   Renders a single Tabler outline icon.
   Tabler webfont must be loaded once in index.html.
────────────────────────────────────────────────────────────────────────────── */
function TIcon({ name, size = 20, className = '' }) {
  return (
    <i
      className={`ti ti-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
}

/* ─── User Navigation ───────────────────────────────────────────────────── */

const userNavigation = [
  {
    label: 'All tasks',
    path: '/tasks',
    icon: 'subtask',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
    exact: true,
  },
  {
    label: 'Assigned to me',
    path: '/tasks/assigned',
    icon: 'user-check',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    exact: true,
  },
  {
    label: 'Pending',
    path: '/tasks/pending',
    icon: 'clock-pause',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
    exact: true,
  },
  {
    label: 'In progress',
    path: '/tasks/in-progress',
    icon: 'progress',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
    exact: true,
  },
  {
    label: 'Completed',
    path: '/tasks/completed',
    icon: 'circle-check',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    exact: true,
  },
  {
    label: 'Cancelled',
    path: '/tasks/cancelled',
    icon: 'circle-x',
    bg: 'bg-slate-50',
    color: 'text-slate-600',
    exact: true,
  },
];

const specialNavigation = [
  {
    label: 'Overdue',
    path: '/tasks/overdue',
    icon: 'calendar-x',
    bg: 'bg-red-50',
    color: 'text-red-600',
    exact: true,
  },
];

const accountNavigation = [
  {
    label: 'Profile',
    path: '/profile',
    icon: 'user-circle',
    bg: 'bg-slate-50',
    color: 'text-slate-600',
    exact: true,
  },
];

/* ─── Admin Navigation ──────────────────────────────────────────────────── */

const adminNavigation = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: 'dashboard',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
    exact: true,
  },
  {
    label: 'Tasks',
    path: '/admin/tasks',
    icon: 'subtask',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
    exact: true,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: 'users-group',
    bg: 'bg-cyan-50',
    color: 'text-cyan-600',
    exact: true,
  },
];

const adminAccountNavigation = [
  {
    label: 'Profile',
    path: '/admin/profile',
    icon: 'user-circle',
    bg: 'bg-slate-50',
    color: 'text-slate-600',
    exact: true,
  },
];

/* ─── Sidebar item ───────────────────────────────────────────────────────── */

function SidebarItem({ item, onClose }) {
  const location = useLocation();

  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path);

  return (
    <NavLink
      to={item.path}
      onClick={() => onClose?.()}
      className={`group relative flex h-11 w-full items-center rounded-xl
        text-[13.5px] font-medium transition-all duration-200
        gap-3 px-2
        ${
          isActive
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      {/* Icon container */}
      <span
        className={`
          grid h-8 w-8 shrink-0 place-items-center rounded-lg
          transition-all duration-200
          ${
            isActive
              ? 'bg-white/15 text-white'
              : `${item.bg} ${item.color} group-hover:scale-105`
          }
        `}
      >
        <TIcon name={item.icon} size={18} />
      </span>

      {/* Label */}
      <span className="min-w-0 flex-1 truncate leading-none">
        {item.label}
      </span>

      {/* Active dot */}
      {isActive && (
        <span className="mr-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white opacity-80" />
      )}
    </NavLink>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */

export default function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  /* ─── Logout ─────────────────────────────────────────────────────────── */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  /* ─── User initials ──────────────────────────────────────────────────── */

  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  /* ─── Full name ──────────────────────────────────────────────────────── */

  const getFullName = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';

    return `${firstName} ${lastName}`.trim() || 'User';
  };

  /* ─── Role ───────────────────────────────────────────────────────────── */

  const getRole = () => {
    if (isAdmin) return 'Administrator';

    return 'User';
  };

  /* ─── Logo destination ───────────────────────────────────────────────── */

  const handleLogoClick = () => {
    navigate(isAdmin ? '/admin' : '/tasks');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[248px] flex-col
          border-r border-slate-200/80 bg-white
          shadow-[4px_0_24px_rgba(15,23,42,0.04)]
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* ── Brand header ─────────────────────────────────────────────── */}

        <div
          className={`
            flex h-[68px] shrink-0 items-center
            justify-between border-b border-slate-100 px-4
          `}
        >
          {/* Logo + wordmark */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-indigo-50 ring-1 ring-indigo-100">
              <TIcon
                name="checks"
                size={20}
                className="text-indigo-600"
              />
            </div>

            <div className="text-left">
              <div className="text-[18px] font-bold tracking-[-0.02em] text-slate-900">
                Taskify
              </div>

              <div className="mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Task Management
              </div>
            </div>
          </button>

          {/* Mobile close */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400
                         transition-colors hover:bg-slate-50 hover:text-slate-700 lg:hidden"
            >
              <TIcon name="x" size={18} />
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────────────────────── */}

        <div className="flex-1 overflow-y-auto px-2.5 py-5">

          {isAdmin ? (

            /* ── Admin Navigation ────────────────────────────────────── */

            <div>

              {/* Administration */}
              <div className="mb-2 flex items-center gap-2 px-2">
                <span className="h-1 w-1 rounded-full bg-violet-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Administration
                </span>
              </div>

              <nav className="space-y-0.5">
                {adminNavigation.map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    onClose={onClose}
                  />
                ))}
              </nav>

              {/* Account */}
              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2 px-2">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Account
                  </span>
                </div>

                <nav className="space-y-0.5">
                  {adminAccountNavigation.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      onClose={onClose}
                    />
                  ))}
                </nav>

              </div>

            </div>

          ) : (

            /* ── User Navigation ─────────────────────────────────────── */

            <>

              {/* Section label - Views */}
              <div className="mb-2 flex items-center gap-2 px-2">
                <span className="h-1 w-1 rounded-full bg-indigo-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Views
                </span>
              </div>

              {/* Main nav - Views */}
              <nav className="space-y-0.5">
                {userNavigation.slice(0, 2).map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    onClose={onClose}
                  />
                ))}
              </nav>

              {/* Section label - Status */}
              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2 px-2">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </span>
                </div>

                {/* Status nav items */}
                <nav className="space-y-0.5">
                  {userNavigation.slice(2).map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      onClose={onClose}
                    />
                  ))}
                </nav>

              </div>

              {/* Section label - Special */}
              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2 px-2">
                  <span className="h-1 w-1 rounded-full bg-red-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Special
                  </span>
                </div>

                {/* Special nav items */}
                <nav className="space-y-0.5">
                  {specialNavigation.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      onClose={onClose}
                    />
                  ))}
                </nav>

              </div>

              {/* Section label - Account */}
              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2 px-2">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Account
                  </span>
                </div>

                <nav className="space-y-0.5">
                  {accountNavigation.map((item) => (
                    <SidebarItem
                      key={item.path}
                      item={item}
                      onClose={onClose}
                    />
                  ))}
                </nav>

              </div>

            </>
          )}

        </div>

        {/* ── User Profile & Logout Footer ────────────────────────────── */}

        <div className="shrink-0 border-t border-slate-100 p-3">

          <div className="flex w-full items-center gap-3 rounded-xl">

            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 text-base">
              {getInitials()}
            </div>

            {/* User info */}
            <div className="flex min-w-0 flex-1 flex-col items-start">

              <span className="truncate text-sm font-medium text-slate-900">
                {getFullName()}
              </span>

              <span className="mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {getRole()}
              </span>

            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg
                         bg-red-50 text-red-500 transition-all duration-200
                         hover:scale-105 hover:bg-red-100 hover:text-red-700"
            >
              <TIcon name="logout" size={18} />
            </button>

          </div>

        </div>

      </aside>
    </>
  );
}