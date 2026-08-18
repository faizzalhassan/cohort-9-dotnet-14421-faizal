import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/* ─── Tabler icon helper ─────────────────────────────────────────────────────
   Renders a single Tabler outline icon.  The <i> tag inherits color from its
   parent so active / hover states work automatically.
   Tabler webfont must be loaded once in your index.html:
     <link rel="stylesheet"
           href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
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

/* ─── Navigation definitions ─────────────────────────────────────────────── */

const userNavigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'layout-dashboard',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
  },
  {
    label: 'My Tasks',
    path: '/tasks',
    icon: 'checklist',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
  },
  {
    label: 'Assigned Tasks',
    path: '/tasks/assigned',
    icon: 'user-check',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    label: 'Pending Tasks',
    path: '/tasks/pending',
    icon: 'clock-pause',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    label: 'Overdue Tasks',
    path: '/tasks/overdue',
    icon: 'calendar-x',
    bg: 'bg-red-50',
    color: 'text-red-600',
  },
  {
    label: 'Completed Tasks',
    path: '/tasks/completed',
    icon: 'circle-check',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
];

const adminNavigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'layout-dashboard',
    bg: 'bg-indigo-50',
    color: 'text-indigo-600',
  },
  {
    label: 'Manage Tasks',
    path: '/admin/tasks',
    icon: 'subtask',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: 'users-group',
    bg: 'bg-cyan-50',
    color: 'text-cyan-600',
  },
];

/* ─── Sidebar item ───────────────────────────────────────────────────────── */

function SidebarItem({ item, collapsed, onClose, onExpand }) {
  return (
    <NavLink
      to={item.path}
      onClick={(event) => {
        if (collapsed) {
          event.preventDefault();
          onExpand();
        } else {
          onClose?.();
        }
      }}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `group relative flex h-11 w-full items-center rounded-xl
         text-[13.5px] font-medium transition-all duration-200
         ${collapsed ? 'justify-center px-0' : 'gap-3 px-2'}
         ${
           isActive
             ? 'bg-slate-900 text-white shadow-sm'
             : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
         }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon container — grid for perfect centering */}
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
          {!collapsed && (
            <span className="min-w-0 flex-1 truncate leading-none">
              {item.label}
            </span>
          )}

          {/* Active dot */}
          {!collapsed && isActive && (
            <span className="mr-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white opacity-80" />
          )}
        </>
      )}
    </NavLink>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */

export default function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = isAdmin ? adminNavigation : userNavigation;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleCollapsedItemClick = () => setCollapsed(false);

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
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-200/80 bg-white
          shadow-[4px_0_24px_rgba(15,23,42,0.04)]
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${collapsed ? 'w-[68px]' : 'w-[248px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Brand header ─────────────────────────────────────────────── */}
        <div
          className={`
            flex h-[68px] shrink-0 items-center
            border-b border-slate-100 transition-all duration-300
            ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}
          `}
        >
          {/* Logo + wordmark */}
          <button
            type="button"
            onClick={() => {
              if (collapsed) { setCollapsed(false); return; }
              navigate('/dashboard');
            }}
            title={collapsed ? 'Expand sidebar' : 'Taskify'}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-indigo-50 ring-1 ring-indigo-100">
              <TIcon name="checks" size={20} className="text-indigo-600" />
            </div>

            {!collapsed && (
              <div className="text-left">
                <div className="text-[18px] font-bold tracking-[-0.02em] text-slate-900">
                  Taskify
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Task Management
                </div>
              </div>
            )}
          </button>

          {/* Collapse toggle */}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400
                         transition-all duration-200 hover:bg-slate-50 hover:text-slate-700"
            >
              <TIcon name="layout-sidebar-left-collapse" size={19} />
            </button>
          )}

          {/* Mobile close */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400
                         transition-colors hover:bg-slate-50 hover:text-slate-700 lg:hidden"
            >
              <TIcon name="x" size={18} />
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-2.5 py-5">

          {/* Section label */}
          {!collapsed ? (
            <div className="mb-2 flex items-center gap-2 px-2">
              <span className="h-1 w-1 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {isAdmin ? 'Supervision' : 'Workspace'}
              </span>
            </div>
          ) : (
            <div className="mb-3 flex justify-center">
              <span className="h-1 w-1 rounded-full bg-indigo-500" />
            </div>
          )}

          {/* Main nav */}
          <nav className="space-y-0.5">
            {navigation.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                onClose={onClose}
                onExpand={handleCollapsedItemClick}
              />
            ))}
          </nav>

          {/* ── Account section ────────────────────────────────────────── */}
          <div className="mt-6">
            {!collapsed ? (
              <div className="mb-2 flex items-center gap-2 px-2">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Account
                </span>
              </div>
            ) : (
              <div className="mb-3 flex justify-center">
                <span className="h-px w-5 bg-slate-200" />
              </div>
            )}

            <SidebarItem
              item={{
                label: 'My Profile',
                path: '/profile',
                icon: 'user-circle',
                bg: 'bg-slate-100',
                color: 'text-slate-600',
              }}
              collapsed={collapsed}
              onClose={onClose}
              onExpand={handleCollapsedItemClick}
            />
          </div>
        </div>

        {/* ── Footer / Logout ───────────────────────────────────────────── */}
        <div className={`shrink-0 border-t border-slate-100 ${collapsed ? 'p-2' : 'p-2.5'}`}>
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`
              group flex h-11 w-full items-center rounded-xl
              text-[13.5px] font-medium text-slate-600
              transition-all duration-200 hover:bg-red-50 hover:text-red-600
              ${collapsed ? 'justify-center' : 'gap-3 px-2'}
            `}
          >
            {/* Icon */}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg
                             bg-red-50 text-red-500 transition-transform duration-200
                             group-hover:scale-105">
              <TIcon name="logout" size={18} />
            </span>

            {!collapsed && <span className="leading-none">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}