import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

/* ─── Tabler Icon Helper ─────────────────────────────────────────────────── */

function TIcon({ name, size = 18, className = '' }) {
  return (
    <i
      className={`ti ti-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
}

/* ─── Status Badge ────────────────────────────────────────────────────────── */

function StatusBadge({ isActive }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Inactive
    </span>
  );
}

/* ─── Role Badge ──────────────────────────────────────────────────────────── */

function RoleBadge({ role }) {
  const isAdmin = role?.toLowerCase() === 'admin';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        isAdmin
          ? 'bg-indigo-50 text-indigo-700'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      <TIcon
        name={isAdmin ? 'shield-check' : 'user'}
        size={11}
      />

      {role || 'User'}
    </span>
  );
}

/* ─── Avatar ──────────────────────────────────────────────────────────────── */

function UserAvatar({ user }) {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[12px] font-semibold text-slate-600">
      {initials}
    </div>
  );
}

/* ─── Sortable Table Header ──────────────────────────────────────────────── */

function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className = '',
}) {
  const isActive = currentSort.key === sortKey;

  return (
    <th className={`px-4 py-3 ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-800"
      >
        {label}

        <TIcon
          name={
            isActive
              ? currentSort.direction === 'asc'
                ? 'chevron-up'
                : 'chevron-down'
              : 'selector'
          }
          size={13}
          className={
            isActive
              ? 'text-indigo-500'
              : 'text-slate-300'
          }
        />
      </button>
    </th>
  );
}

/* ─── Action Menu ─────────────────────────────────────────────────────────── */

function UserActionMenu({
  user,
  isOpen,
  onToggle,
  onClose,
  onActivate,
  onDeactivate,
  onDelete,
  isUpdating,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={isUpdating}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <TIcon name="dots-vertical" size={17} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Account Actions
              </p>
            </div>

            {user.isActive ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeactivate(user);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <TIcon
                  name="user-off"
                  size={15}
                  className="text-amber-500"
                />

                Deactivate Account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onActivate(user);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <TIcon
                  name="user-check"
                  size={15}
                  className="text-emerald-500"
                />

                Activate Account
              </button>
            )}

            <div className="border-t border-slate-100" />

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(user);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <TIcon name="trash" size={15} />
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Confirmation Dialog ─────────────────────────────────────────────────── */

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText,
  confirmClassName,
  icon,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-slate-950/40"
        onClick={loading ? undefined : onClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-[390px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50">
            <TIcon
              name={icon}
              size={27}
              className="text-red-500"
            />
          </div>

          <h3 className="text-center text-[17px] font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1.5 text-center text-[13px] leading-relaxed text-slate-500">
            {message}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${confirmClassName}`}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </>
              ) : (
                <>
                  <TIcon name="check" size={15} />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────────────────────── */

function UserTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-4"
          >
            <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-36 animate-pulse rounded bg-slate-100" />
              <div className="h-2.5 w-48 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="hidden h-5 w-16 animate-pulse rounded-full bg-slate-100 md:block" />
            <div className="hidden h-5 w-16 animate-pulse rounded-full bg-slate-100 sm:block" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────────────────────── */

function EmptyState({ searchQuery }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-100">
        <TIcon
          name={searchQuery ? 'user-search' : 'users'}
          size={32}
          className="text-slate-400"
        />
      </div>

      <p className="mt-4 text-[16px] font-medium text-slate-700">
        {searchQuery ? 'No users found' : 'No users available'}
      </p>

      <p className="mt-1 text-[13px] text-slate-400">
        {searchQuery
          ? 'Try adjusting your search.'
          : 'There are no users to display.'}
      </p>
    </div>
  );
}

/* ─── Main Users Page ─────────────────────────────────────────────────────── */

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    type: null,
    user: null,
  });

  const [processing, setProcessing] = useState(false);

  /* ─── Sorting ───────────────────────────────────────────────────────────── */

  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction:
            current.direction === 'asc'
              ? 'desc'
              : 'asc',
        };
      }

      return {
        key,
        direction: 'asc',
      };
    });
  };

  /* ─── Fetch Users ───────────────────────────────────────────────────────── */

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/users');

      let userData =
        response.data?.data ??
        response.data;

      if (
        userData &&
        !Array.isArray(userData) &&
        userData.items
      ) {
        userData = userData.items;
      }

      if (!Array.isArray(userData)) {
        userData = [];
      }

      setUsers(userData);
    } catch (err) {
      console.error('Failed to load users:', err);

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        'Failed to load users.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ─── Filter + Sort Users ──────────────────────────────────────────────── */

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const fullName =
        `${user.firstName || ''} ${user.lastName || ''}`.trim();

      const matchesSearch =
        !query ||
        fullName.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      const matchesRole =
        roleFilter === 'all' ||
        user.role?.toLowerCase() ===
          roleFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });

    return [...filtered].sort((a, b) => {
      const direction =
        sortConfig.direction === 'asc'
          ? 1
          : -1;

      let valueA;
      let valueB;

      switch (sortConfig.key) {
        case 'name':
          valueA =
            `${a.firstName || ''} ${a.lastName || ''}`
              .trim()
              .toLowerCase();

          valueB =
            `${b.firstName || ''} ${b.lastName || ''}`
              .trim()
              .toLowerCase();

          break;

        case 'role':
          valueA = (a.role || 'User').toLowerCase();
          valueB = (b.role || 'User').toLowerCase();
          break;

        case 'tasks':
          valueA =
            a.taskCount ??
            a.tasksCount ??
            a.totalTasks ??
            0;

          valueB =
            b.taskCount ??
            b.tasksCount ??
            b.totalTasks ??
            0;

          break;

        case 'status':
          valueA = a.isActive ? 1 : 0;
          valueB = b.isActive ? 1 : 0;
          break;

        case 'createdAt':
          valueA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

          valueB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

          break;

        default:
          valueA = 0;
          valueB = 0;
      }

      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB) * direction;
      }

      return (valueA - valueB) * direction;
    });
  }, [
    users,
    searchQuery,
    statusFilter,
    roleFilter,
    sortConfig,
  ]);

  /* ─── Statistics ───────────────────────────────────────────────────────── */

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => user.isActive
    ).length;

    const inactive = users.filter(
      (user) => !user.isActive
    ).length;

    const admins = users.filter(
      (user) =>
        user.role?.toLowerCase() === 'admin'
    ).length;

    return {
      total,
      active,
      inactive,
      admins,
    };
  }, [users]);

  /* ─── Open Confirmation ────────────────────────────────────────────────── */

  const openConfirmation = (type, user) => {
    setConfirmation({
      isOpen: true,
      type,
      user,
    });
  };

  const closeConfirmation = () => {
    if (processing) return;

    setConfirmation({
      isOpen: false,
      type: null,
      user: null,
    });
  };

  /* ─── Account Actions ─────────────────────────────────────────────────── */

  const handleConfirmAction = async () => {
    const { type, user } = confirmation;

    if (!user) return;

    setProcessing(true);
    setError('');

    try {
      if (type === 'activate') {
        await api.patch(
          `/admin/users/${user.id}/activate`
        );

        setUsers((prev) =>
          prev.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  isActive: true,
                  updatedAt:
                    new Date().toISOString(),
                }
              : item
          )
        );
      }

      if (type === 'deactivate') {
        await api.patch(
          `/admin/users/${user.id}/deactivate`
        );

        setUsers((prev) =>
          prev.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  isActive: false,
                  updatedAt:
                    new Date().toISOString(),
                }
              : item
          )
        );
      }

      if (type === 'delete') {
        await api.delete(
          `/admin/users/${user.id}`
        );

        setUsers((prev) =>
          prev.filter(
            (item) => item.id !== user.id
          )
        );
      }

      closeConfirmation();
    } catch (err) {
      console.error(
        `Failed to ${type} user:`,
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        `Failed to ${type} account.`
      );
    } finally {
      setProcessing(false);
    }
  };

  /* ─── Confirmation Data ───────────────────────────────────────────────── */

  const confirmationData = useMemo(() => {
    const userName = confirmation.user
      ? `${confirmation.user.firstName || ''} ${
          confirmation.user.lastName || ''
        }`.trim()
      : 'this user';

    switch (confirmation.type) {
      case 'activate':
        return {
          title: 'Activate Account',
          message: `Are you sure you want to activate ${userName}'s account? They will be able to log in again.`,
          confirmText: 'Activate',
          confirmClassName:
            'bg-emerald-600 hover:bg-emerald-700',
          icon: 'user-check',
        };

      case 'deactivate':
        return {
          title: 'Deactivate Account',
          message: `Are you sure you want to deactivate ${userName}'s account? They will no longer be able to log in.`,
          confirmText: 'Deactivate',
          confirmClassName:
            'bg-amber-600 hover:bg-amber-700',
          icon: 'user-off',
        };

      case 'delete':
        return {
          title: 'Delete Account',
          message: `Are you sure you want to delete ${userName}'s account? This will soft delete the account and remove it from the active users list.`,
          confirmText: 'Delete',
          confirmClassName:
            'bg-red-600 hover:bg-red-700',
          icon: 'trash',
        };

      default:
        return {
          title: '',
          message: '',
          confirmText: 'Confirm',
          confirmClassName: 'bg-slate-900',
          icon: 'check',
        };
    }
  }, [confirmation]);

  /* ─── Reset Filters ────────────────────────────────────────────────────── */

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    roleFilter !== 'all';

  /* ─── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">

      {/* ── Statistics Badges ────────────────────────────────────────────── */}

      <div className="flex flex-wrap items-center gap-2.5">

        {/* Total Users */}

        <div className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-white shadow-sm">
          <TIcon
            name="users"
            size={16}
            className="text-white"
          />

          <span className="text-[12px] font-semibold">
            Total Users
          </span>

          <span className="inline-flex min-w-[27px] items-center justify-center rounded-full bg-white/15 px-2 py-1 text-[11px] font-bold">
            {statistics.total}
          </span>
        </div>

        {/* Active */}

        <div className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-3.5 text-white shadow-sm">
          <TIcon
            name="user-check"
            size={16}
            className="text-white"
          />

          <span className="text-[12px] font-semibold">
            Active
          </span>

          <span className="inline-flex min-w-[27px] items-center justify-center rounded-full bg-white/20 px-2 py-1 text-[11px] font-bold">
            {statistics.active}
          </span>
        </div>

        {/* Inactive */}

        <div className="inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-3.5 text-white shadow-sm">
          <TIcon
            name="user-off"
            size={16}
            className="text-white"
          />

          <span className="text-[12px] font-semibold">
            Inactive
          </span>

          <span className="inline-flex min-w-[27px] items-center justify-center rounded-full bg-white/20 px-2 py-1 text-[11px] font-bold">
            {statistics.inactive}
          </span>
        </div>

        {/* Admins */}

        <div className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-white shadow-sm">
          <TIcon
            name="shield-check"
            size={16}
            className="text-white"
          />

          <span className="text-[12px] font-semibold">
            Admins
          </span>

          <span className="inline-flex min-w-[27px] items-center justify-center rounded-full bg-white/20 px-2 py-1 text-[11px] font-bold">
            {statistics.admins}
          </span>
        </div>

      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <TIcon
            name="circle-x"
            size={16}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <div className="flex-1">
            <p className="text-[13px] font-medium text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-400 transition-colors hover:text-red-600"
          >
            <TIcon name="x" size={15} />
          </button>
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────────────────── */}

      <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">

        {/* Search */}

        <div className="relative flex-1">
          <TIcon
            name="search"
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search users by name or email..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12px] text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Status */}

        <div className="relative min-w-[145px]">
          <TIcon
            name="activity"
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-[12px] font-medium text-slate-700 transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <TIcon
            name="chevron-down"
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Role */}

        <div className="relative min-w-[135px]">
          <TIcon
            name="shield"
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          />

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-[12px] font-medium text-slate-700 transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">
              All Roles
            </option>

            <option value="Admin">
              Admin
            </option>

            <option value="User">
              User
            </option>
          </select>

          <TIcon
            name="chevron-down"
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Clear */}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12px] font-medium text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700"
          >
            <TIcon name="x" size={13} />
            Clear
          </button>
        )}
      </div>

      {/* ── Results Count ────────────────────────────────────────────────── */}

      {!loading && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-slate-400">
            Showing{' '}
            <span className="font-semibold text-slate-600">
              {filteredUsers.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-600">
              {users.length}
            </span>{' '}
            users
          </p>
        </div>
      )}

      {/* ── Users Table ───────────────────────────────────────────────────── */}

      {loading ? (
        <UserTableSkeleton />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">

                <SortableHeader
                  label="User"
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Role"
                  sortKey="role"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Tasks"
                  sortKey="tasks"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  className="text-center"
                />

                <SortableHeader
                  label="Status"
                  sortKey="status"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Joined"
                  sortKey="createdAt"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />

                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.map((user) => {
                const fullName =
                  `${user.firstName || ''} ${
                    user.lastName || ''
                  }`.trim() ||
                  'Unknown User';

                const taskCount =
                  user.taskCount ??
                  user.tasksCount ??
                  user.totalTasks ??
                  0;

                return (
                  <tr
                    key={user.id}
                    className="group transition-colors duration-150 hover:bg-slate-50/60"
                  >

                    {/* User */}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-slate-900">
                            {fullName}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}

                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Tasks */}

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-[30px] items-center justify-center rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                        {taskCount}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-4 py-3">
                      <StatusBadge
                        isActive={user.isActive}
                      />
                    </td>

                    {/* Joined */}

                    <td className="px-4 py-3">
                      <span className="text-[12px] text-slate-500">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-4 py-3">
                      <UserActionMenu
                        user={user}
                        isOpen={
                          actionMenuOpen === user.id
                        }
                        onToggle={() =>
                          setActionMenuOpen(
                            actionMenuOpen ===
                              user.id
                              ? null
                              : user.id
                          )
                        }
                        onClose={() =>
                          setActionMenuOpen(null)
                        }
                        onActivate={(selectedUser) =>
                          openConfirmation(
                            'activate',
                            selectedUser
                          )
                        }
                        onDeactivate={(selectedUser) =>
                          openConfirmation(
                            'deactivate',
                            selectedUser
                          )
                        }
                        onDelete={(selectedUser) =>
                          openConfirmation(
                            'delete',
                            selectedUser
                          )
                        }
                        isUpdating={
                          processing &&
                          confirmation.user?.id ===
                            user.id
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Confirmation Dialog ───────────────────────────────────────────── */}

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        title={confirmationData.title}
        message={confirmationData.message}
        confirmText={confirmationData.confirmText}
        confirmClassName={
          confirmationData.confirmClassName
        }
        icon={confirmationData.icon}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        loading={processing}
      />
    </div>
  );
}