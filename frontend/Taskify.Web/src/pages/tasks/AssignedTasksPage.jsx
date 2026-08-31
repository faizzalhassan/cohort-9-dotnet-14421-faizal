import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import {
  startSignalRConnection,
  getSignalRConnection,
} from '../../services/signalRService'; // Add this import

/* ─── Tabler icon helper ─────────────────────────────────────────────────── */
function TIcon({ name, size = 18, className = '' }) {
  return (
    <i
      className={`ti ti-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
}

/* ─── Date Helpers ───────────────────────────────────────────────────────── */

/*
 * Returns a calendar date key in YYYY-MM-DD format.
 *
 * Important:
 * We intentionally compare calendar dates instead of timestamps.
 *
 * Example:
 * Due Date = August 31
 * Today    = August 31
 * Result   = NOT overdue
 *
 * It becomes overdue on September 1.
 */
function getDateKey(dateValue) {
  if (!dateValue) return null;

  if (typeof dateValue === 'string') {
    const match = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);

    if (match) {
      return match[1];
    }
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isTaskOverdue(task) {
  if (!task?.dueDate) return false;

  if (
    task.status === 'Completed' ||
    task.status === 'Cancelled'
  ) {
    return false;
  }

  const dueDateKey = getDateKey(task.dueDate);
  const todayKey = getTodayKey();

  if (!dueDateKey) return false;

  return dueDateKey < todayKey;
}

function getDaysBetweenDates(fromKey, toKey) {
  if (!fromKey || !toKey) return 0;

  const from = new Date(`${fromKey}T00:00:00`);
  const to = new Date(`${toKey}T00:00:00`);

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime())
  ) {
    return 0;
  }

  return Math.round(
    (to.getTime() - from.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

/* ─── Priority config ────────────────────────────────────────────────────── */
const priorityConfig = {
  High: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: 'arrow-up',
    dot: 'bg-red-500',
  },

  Medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: 'minus',
    dot: 'bg-amber-500',
  },

  Low: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'arrow-down',
    dot: 'bg-blue-500',
  },

  Urgent: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: 'urgent',
    dot: 'bg-purple-500',
  },
};

function PriorityBadge({ priority }) {
  const style =
    priorityConfig[priority] ||
    priorityConfig.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      <TIcon name={style.icon} size={11} />
      {priority}
    </span>
  );
}

/* ─── Category colors ────────────────────────────────────────────────────── */
const categoryColors = {
  Work: {
    badge: 'bg-indigo-100 text-indigo-700',
    border: '#6366f1',
  },

  Personal: {
    badge: 'bg-emerald-100 text-emerald-700',
    border: '#10b981',
  },

  Study: {
    badge: 'bg-purple-100 text-purple-700',
    border: '#a855f7',
  },

  Meetings: {
    badge: 'bg-amber-100 text-amber-700',
    border: '#f59e0b',
  },

  Finance: {
    badge: 'bg-green-100 text-green-700',
    border: '#22c55e',
  },

  Shopping: {
    badge: 'bg-pink-100 text-pink-700',
    border: '#ec4899',
  },

  Health: {
    badge: 'bg-red-100 text-red-700',
    border: '#ef4444',
  },

  Home: {
    badge: 'bg-orange-100 text-orange-700',
    border: '#f97316',
  },

  Travel: {
    badge: 'bg-cyan-100 text-cyan-700',
    border: '#06b6d4',
  },

  Other: {
    badge: 'bg-slate-100 text-slate-700',
    border: '#94a3b8',
  },
};

/* ─── Status Badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const config = {
    Pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: 'clock-pause',
    },

    InProgress: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      icon: 'progress',
    },

    Completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      icon: 'circle-check',
    },

    Cancelled: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      icon: 'circle-x',
    },
  };

  const style =
    config[status] || config.Pending;

  const displayName =
    status === 'InProgress'
      ? 'In Progress'
      : status;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      <TIcon name={style.icon} size={11} />
      {displayName}
    </span>
  );
}

/* ─── Status Dropdown for Table ─────────────────────────────────────────── */
function StatusDropdown({
  task,
  onStatusChange,
  canChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const [dropdownPosition, setDropdownPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const buttonRef = useRef(null);

  const statusOptions = [
    'Pending',
    'InProgress',
    'Completed',
    'Cancelled',
  ];

  const handleChange = async (newStatus) => {
    if (
      newStatus === task.status ||
      !canChange ||
      changing
    ) {
      return;
    }

    setChanging(true);

    try {
      await onStatusChange(task.id, newStatus);
    } finally {
      setChanging(false);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (
      !isOpen &&
      buttonRef.current
    ) {
      const rect =
        buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top:
          rect.bottom +
          window.scrollY +
          4,

        left:
          rect.left +
          window.scrollX,
      });
    }

    setIsOpen((previous) => !previous);
  };

  if (!canChange) {
    return (
      <StatusBadge status={task.status} />
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        disabled={changing}
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all duration-200 hover:ring-2 hover:ring-indigo-200 ${
          changing
            ? 'cursor-wait opacity-50'
            : 'cursor-pointer'
        } ${
          task.status === 'Pending'
            ? 'bg-amber-50 text-amber-700'
            : task.status === 'InProgress'
              ? 'bg-indigo-50 text-indigo-700'
              : task.status === 'Completed'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
        }`}
      >
        <TIcon
          name={
            task.status === 'Pending'
              ? 'clock-pause'
              : task.status === 'InProgress'
                ? 'progress'
                : task.status === 'Completed'
                  ? 'circle-check'
                  : 'circle-x'
          }
          size={11}
        />

        {task.status === 'InProgress'
          ? 'In Progress'
          : task.status}

        <TIcon
          name="chevron-down"
          size={10}
          className="ml-0.5"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[99999]"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed z-[99999] min-w-[130px] rounded-xl border border-slate-200 bg-white py-1 shadow-2xl"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {statusOptions
              .filter(
                (status) =>
                  status !== task.status
              )
              .map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleChange(status)
                  }
                  disabled={changing}
                  className="flex w-full items-center whitespace-nowrap px-3 py-1.5 text-[12px] text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  {status === 'InProgress'
                    ? 'In Progress'
                    : status}
                </button>
              ))}
          </div>
        </>
      )}
    </>
  );
}

/* ─── Status Badges Row ──────────────────────────────────────────────────── */
function StatusBadgesRow({ tasks }) {
  const statusCounts = {
    Pending: tasks.filter(
      (task) =>
        task.status === 'Pending'
    ).length,

    InProgress: tasks.filter(
      (task) =>
        task.status === 'InProgress'
    ).length,

    Completed: tasks.filter(
      (task) =>
        task.status === 'Completed'
    ).length,

    Cancelled: tasks.filter(
      (task) =>
        task.status === 'Cancelled'
    ).length,

    /*
     * Overdue is derived from the due date.
     *
     * A task due today is NOT overdue.
     * A task becomes overdue the day after its due date.
     */
    Overdue: tasks.filter((task) =>
      isTaskOverdue(task)
    ).length,
  };

  const badges = [
    {
      key: 'Pending',
      label: 'Pending',
      icon: 'clock-pause',
      color:
        'bg-amber-600 hover:bg-amber-700',
    },

    {
      key: 'InProgress',
      label: 'In Progress',
      icon: 'progress',
      color:
        'bg-blue-600 hover:bg-blue-700',
    },

    {
      key: 'Completed',
      label: 'Completed',
      icon: 'circle-check',
      color:
        'bg-emerald-600 hover:bg-emerald-700',
    },

    {
      key: 'Cancelled',
      label: 'Cancelled',
      icon: 'circle-x',
      color:
        'bg-slate-600 hover:bg-slate-700',
    },

    {
      key: 'Overdue',
      label: 'Overdue',
      icon: 'alert-triangle',
      color:
        'bg-red-600 hover:bg-red-700',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge) => (
        <div
          key={badge.key}
          className={`inline-flex cursor-default items-center gap-1.5 rounded-lg px-3 py-1.5 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${badge.color}`}
        >
          <TIcon
            name={badge.icon}
            size={14}
          />

          <span className="text-[12px] font-semibold">
            {badge.label}
          </span>

          <span className="ml-0.5 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
            {statusCounts[badge.key] || 0}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Premium View Drawer ───────────────────────────────────────────────── */
function ViewDrawer({
  isOpen,
  onClose,
  task,
  onStatusChange,
  canChangeStatus,
}) {
  const [isVisible, setIsVisible] =
    useState(false);

  const [changingStatus, setChangingStatus] =
    useState(false);

  const [statusError, setStatusError] =
    useState('');

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setIsVisible(true)
        )
      );
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setChangingStatus(false);
    setStatusError('');
  }, [task]);

  if (!isOpen || !task) {
    return null;
  }

  const catStyle =
    categoryColors[task.category] ||
    categoryColors.Other;

  const priorityStyle =
    priorityConfig[task.priority] ||
    priorityConfig.Medium;

  const isOverdue =
    isTaskOverdue(task);

  const todayKey = getTodayKey();
  const dueDateKey = getDateKey(
    task.dueDate
  );

  const getDaysRemaining = () => {
    if (!dueDateKey) {
      return null;
    }

    return getDaysBetweenDates(
      todayKey,
      dueDateKey
    );
  };

  const getDueDateMessage = () => {
    if (!task.dueDate) {
      return null;
    }

    if (isOverdue) {
      const daysOverdue =
        getDaysBetweenDates(
          dueDateKey,
          todayKey
        );

      return {
        message: `${daysOverdue} day${
          daysOverdue !== 1
            ? 's'
            : ''
        } overdue`,

        icon: 'alert-triangle',

        color: 'text-red-600',

        bg: 'bg-red-50',

        border: 'border-red-200',
      };
    }

    const daysLeft =
      getDaysRemaining();

    if (daysLeft === 0) {
      return {
        message: 'Due today',
        icon: 'clock',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    }

    if (daysLeft === 1) {
      return {
        message: '1 day remaining',
        icon: 'calendar-clock',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      };
    }

    if (
      daysLeft !== null &&
      daysLeft <= 3
    ) {
      return {
        message: `${daysLeft} days remaining`,
        icon: 'calendar-clock',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      };
    }

    if (
      daysLeft !== null &&
      daysLeft <= 7
    ) {
      return {
        message: `${daysLeft} days remaining`,
        icon: 'calendar',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
      };
    }

    return {
      message: `${daysLeft} days remaining`,
      icon: 'calendar',
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
    };
  };

  const dueDateInfo =
    getDueDateMessage();

  const statusConfig = {
    Pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: 'clock-pause',
    },

    InProgress: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      icon: 'progress',
    },

    Completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      icon: 'circle-check',
    },

    Cancelled: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      icon: 'circle-x',
    },
  };

  const statusStyle =
    statusConfig[task.status] ||
    statusConfig.Pending;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )
      : '—';

  const statusOptions = [
    'Pending',
    'InProgress',
    'Completed',
    'Cancelled',
  ];

  const handleStatusChange = async (
    newStatus
  ) => {
    if (
      newStatus === task.status ||
      changingStatus
    ) {
      return;
    }

    setChangingStatus(true);
    setStatusError('');

    try {
      await onStatusChange(
        task.id,
        newStatus
      );

      onClose();
    } catch (error) {
      setStatusError(
        error?.message ||
          'Failed to update status'
      );
    } finally {
      setChangingStatus(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        style={{
          backgroundColor: isVisible
            ? 'rgba(2,6,23,0.5)'
            : 'transparent',

          pointerEvents: isVisible
            ? 'auto'
            : 'none',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[9999] flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        {/* Header */}
        <div
          style={{
            borderTop: `3px solid ${catStyle.border}`,
          }}
          className="shrink-0"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-[16px] font-semibold text-slate-900">
              {task.title}
            </h2>

            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
            >
              <TIcon
                name="x"
                size={18}
              />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {statusError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <TIcon
                name="circle-x"
                size={16}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <span className="text-[13px] text-red-700">
                {statusError}
              </span>
            </div>
          )}

          {task.description && (
            <div className="border-b border-slate-100 pb-4">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Description
              </p>

              <p className="text-[13px] leading-relaxed text-slate-500">
                {task.description}
              </p>
            </div>
          )}

          <div className="space-y-3 border-b border-slate-100 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Details
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] font-medium text-slate-400">
                  Category
                </span>

                <span
                  className={`inline-flex self-start items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${catStyle.badge}`}
                >
                  <TIcon
                    name="folder"
                    size={11}
                  />

                  {task.category || '—'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] font-medium text-slate-400">
                  Priority
                </span>

                <span
                  className={`inline-flex self-start items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}
                >
                  <TIcon
                    name={priorityStyle.icon}
                    size={11}
                  />

                  {task.priority}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] font-medium text-slate-400">
                  Status
                </span>

                <span
                  className={`inline-flex self-start items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <TIcon
                    name={statusStyle.icon}
                    size={11}
                  />

                  {task.status ===
                  'InProgress'
                    ? 'In Progress'
                    : task.status}
                </span>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="py-4">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Due Date
            </p>

            <div className="space-y-2">
              <div
                className={`mr-2 inline-flex items-center gap-2 rounded-xl px-3 py-2 ${
                  isOverdue
                    ? 'border border-red-200 bg-red-50'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <TIcon
                  name="calendar"
                  size={15}
                  className={
                    isOverdue
                      ? 'text-red-500'
                      : 'text-slate-400'
                  }
                />

                <span
                  className={`text-[13px] font-medium ${
                    isOverdue
                      ? 'text-red-700'
                      : 'text-slate-700'
                  }`}
                >
                  {formatDate(
                    task.dueDate
                  )}
                </span>

                {isOverdue && (
                  <span className="ml-1 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                    Overdue
                  </span>
                )}
              </div>

              {dueDateInfo &&
                task.status !==
                  'Completed' &&
                task.status !==
                  'Cancelled' && (
                  <div
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 ${dueDateInfo.bg} ${dueDateInfo.border}`}
                  >
                    <TIcon
                      name={dueDateInfo.icon}
                      size={15}
                      className={
                        dueDateInfo.color
                      }
                    />

                    <span
                      className={`text-[12px] font-medium ${dueDateInfo.color}`}
                    >
                      {
                        dueDateInfo.message
                      }
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Timeline */}
          {(task.createdAt ||
            task.updatedAt) && (
            <div className="border-t border-slate-100 py-4">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Timeline
              </p>

              <div className="space-y-1.5">
                {task.createdAt && (
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <TIcon
                      name="clock"
                      size={13}
                      className="text-slate-400"
                    />

                    <span className="text-slate-400">
                      Created:
                    </span>

                    <span className="font-medium">
                      {new Date(
                        task.createdAt
                      ).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )}

                {task.updatedAt && (
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <TIcon
                      name="refresh"
                      size={13}
                      className="text-slate-400"
                    />

                    <span className="text-slate-400">
                      Updated:
                    </span>

                    <span className="font-medium">
                      {new Date(
                        task.updatedAt
                      ).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4">
          {canChangeStatus ? (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Change Status
              </p>

              <div className="flex flex-wrap gap-2">
                {/* Current Status */}
                <button
                  disabled
                  className={`cursor-default rounded-xl border-2 border-indigo-300 px-4 py-2 text-[12px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <span className="flex items-center gap-1.5">
                    <TIcon
                      name={
                        statusStyle.icon
                      }
                      size={12}
                    />

                    {task.status ===
                    'InProgress'
                      ? 'In Progress'
                      : task.status}
                  </span>
                </button>

                {/* Other Status Options */}
                {statusOptions
                  .filter(
                    (status) =>
                      status !==
                      task.status
                  )
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(
                          status
                        )
                      }
                      disabled={
                        changingStatus
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2 text-[12px] font-medium text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {status ===
                      'InProgress'
                        ? 'In Progress'
                        : status}
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-900 px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-lg active:scale-[0.97]"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Sortable Table Header ─────────────────────────────────────────────── */
function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
  icon,
  align = 'left',
}) {
  const isActive =
    currentSort.field === field;

  const direction = isActive
    ? currentSort.direction
    : null;

  return (
    <th className="px-4 py-3">
      <button
        onClick={() => onSort(field)}
        className={`group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
          isActive
            ? 'text-indigo-600'
            : 'text-slate-600 hover:text-slate-800'
        }`}
        style={{
          justifyContent:
            align === 'right'
              ? 'flex-end'
              : 'flex-start',
        }}
      >
        {icon && (
          <TIcon
            name={icon}
            size={13}
            className={
              isActive
                ? 'text-indigo-500'
                : 'text-slate-500'
            }
          />
        )}

        {label}

        <div className="relative ml-0.5 flex flex-col items-center">
          <TIcon
            name="chevron-up"
            size={10}
            className={`-mb-0.5 transition-all duration-200 ${
              isActive &&
              direction === 'asc'
                ? 'text-indigo-600 opacity-100'
                : 'text-slate-400 opacity-60 group-hover:opacity-100'
            }`}
          />

          <TIcon
            name="chevron-down"
            size={10}
            className={`-mt-0.5 transition-all duration-200 ${
              isActive &&
              direction === 'desc'
                ? 'text-indigo-600 opacity-100'
                : 'text-slate-400 opacity-60 group-hover:opacity-100'
            }`}
          />
        </div>
      </button>
    </th>
  );
}

/* ─── Premium Table View ────────────────────────────────────────────────── */
function TableView({
  tasks,
  onView,
  onStatusChange,
  canChangeStatus,
  sortConfig,
  onSort,
}) {
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }
        )
      : '—';

  const sortedTasks = useMemo(() => {
    if (!sortConfig.field) {
      return tasks;
    }

    const sorted = [...tasks];

    const {
      field,
      direction,
    } = sortConfig;

    sorted.sort((a, b) => {
      let valueA;
      let valueB;

      switch (field) {
        case 'title':
          valueA = (
            a.title || ''
          ).toLowerCase();

          valueB = (
            b.title || ''
          ).toLowerCase();

          break;

        case 'category':
          valueA = (
            a.category || ''
          ).toLowerCase();

          valueB = (
            b.category || ''
          ).toLowerCase();

          break;

        case 'priority': {
          const priorityOrder = {
            Urgent: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };

          valueA =
            priorityOrder[
              a.priority
            ] || 0;

          valueB =
            priorityOrder[
              b.priority
            ] || 0;

          break;
        }

        case 'status': {
          const statusOrder = {
            Pending: 1,
            InProgress: 2,
            Completed: 3,
            Cancelled: 4,
          };

          valueA =
            statusOrder[a.status] ||
            0;

          valueB =
            statusOrder[b.status] ||
            0;

          break;
        }

        case 'dueDate':
          valueA = a.dueDate
            ? new Date(
                a.dueDate
              ).getTime()
            : Infinity;

          valueB = b.dueDate
            ? new Date(
                b.dueDate
              ).getTime()
            : Infinity;

          break;

        default:
          return 0;
      }

      if (valueA < valueB) {
        return direction === 'asc'
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return direction === 'asc'
          ? 1
          : -1;
      }

      return 0;
    });

    return sorted;
  }, [tasks, sortConfig]);

  if (sortedTasks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <SortableHeader
                label="Title"
                field="title"
                currentSort={sortConfig}
                onSort={onSort}
                icon="text-size"
              />

              <SortableHeader
                label="Category"
                field="category"
                currentSort={sortConfig}
                onSort={onSort}
                icon="folder"
              />

              <SortableHeader
                label="Priority"
                field="priority"
                currentSort={sortConfig}
                onSort={onSort}
                icon="flag"
              />

              <SortableHeader
                label="Status"
                field="status"
                currentSort={sortConfig}
                onSort={onSort}
                icon="checklist"
              />

              <SortableHeader
                label="Due Date"
                field="dueDate"
                currentSort={sortConfig}
                onSort={onSort}
                icon="calendar"
              />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedTasks.map((task) => {
              const isOverdue =
                isTaskOverdue(task);

              const catStyle =
                categoryColors[
                  task.category
                ] ||
                categoryColors.Other;

              return (
                <tr
                  key={task.id}
                  className="group cursor-pointer transition-colors duration-150 hover:bg-slate-50/60"
                  onClick={() =>
                    onView(task)
                  }
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-0.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            catStyle.border,
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-slate-900">
                          {task.title}
                        </span>

                        {task.description && (
                          <span className="block truncate text-[11px] text-slate-400">
                            {
                              task.description
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${catStyle.badge}`}
                    >
                      <TIcon
                        name="folder"
                        size={10}
                      />

                      {task.category ||
                        '—'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <PriorityBadge
                      priority={
                        task.priority
                      }
                    />
                  </td>

                  <td
                    className="px-4 py-3"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <StatusDropdown
                      task={task}
                      onStatusChange={
                        onStatusChange
                      }
                      canChange={canChangeStatus(
                        task
                      )}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <TIcon
                        name="calendar"
                        size={12}
                        className={
                          isOverdue
                            ? 'text-red-400'
                            : 'text-slate-400'
                        }
                      />

                      <span
                        className={`text-[12px] ${
                          isOverdue
                            ? 'font-medium text-red-500'
                            : 'text-slate-500'
                        }`}
                      >
                        {formatDate(
                          task.dueDate
                        )}
                      </span>

                      {isOverdue && (
                        <span className="ml-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-600">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
        <p className="text-[11px] text-slate-400">
          Showing{' '}
          {sortedTasks.length}{' '}
          task
          {sortedTasks.length !== 1
            ? 's'
            : ''}

          {sortConfig.field && (
            <span className="ml-1">
              sorted by{' '}
              <span className="font-medium capitalize text-slate-600">
                {sortConfig.field}
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ─── AssignedTasksPage ─────────────────────────────────────────────────── */
export default function AssignedTasksPage() {
  const {
    user,
    isAdmin,
  } = useAuth();

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [sortConfig, setSortConfig] =
    useState({
      field: '',
      direction: 'asc',
    });

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [viewingTask, setViewingTask] =
    useState(null);

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Fetch Assigned Tasks                                                    */
  /* ─────────────────────────────────────────────────────────────────────── */

  const fetchTasks = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await taskService.getAssignedTasks(
            {}
          );

        if (response.success) {
          setTasks(
            response.data || []
          );
        } else {
          setError(
            response.message ||
              'Failed to load assigned tasks'
          );
        }
      } catch (err) {
        setError(
          err?.response?.data
            ?.message ||
            err.message ||
            'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ─────────────────────────────────────────────────────────────────────── */
  /* SignalR: Real-time Task Updates                                         */
  /* ─────────────────────────────────────────────────────────────────────── */

  useEffect(() => {
    let isMounted = true;

    /**
     * Handle a task that was assigned/updated via SignalR.
     * - If the task already exists in the list, update it in place.
     * - If it is new (admin just assigned it to this user), prepend it.
     */
    const handleTaskAssigned = (incomingTask) => {
      console.info('SignalR AssignedTasksPage: TaskAssigned received:', incomingTask);

      if (!isMounted || !incomingTask?.id) return;

      setTasks((prevTasks) => {
        const exists = prevTasks.some((t) => t.id === incomingTask.id);
        
        if (exists) {
          return prevTasks.map((t) => 
            t.id === incomingTask.id ? incomingTask : t
          );
        }
        
        return [incomingTask, ...prevTasks];
      });
    };

    /**
     * Register the SignalR listener.
     * Reuse the connection that AuthContext already started.
     * startSignalRConnection() is idempotent — it returns the
     * existing connected instance if one already exists.
     */
    const registerListener = async () => {
      try {
        const conn = await startSignalRConnection();
        if (!isMounted || !conn) return;
        
        conn.on('TaskAssigned', handleTaskAssigned);
      } catch (err) {
        console.error('SignalR AssignedTasksPage: failed to register listener:', err);
      }
    };

    registerListener();

    return () => {
      isMounted = false;
      
      // Remove only this component's listener; do NOT stop the connection —
      // AuthContext owns the connection lifecycle.
      const conn = getSignalRConnection();
      if (conn) {
        conn.off('TaskAssigned', handleTaskAssigned);
      }
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────────────── */
  /* View Task                                                               */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleViewTask = (
    task
  ) => {
    setViewingTask(task);
    setDrawerOpen(true);
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Change Status                                                           */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    if (!taskId || !newStatus) {
      throw new Error(
        'Invalid status update'
      );
    }

    const response =
      await taskService.updateTaskStatus(
        taskId,
        newStatus
      );

    if (!response.success) {
      throw new Error(
        response.message ||
          'Failed to update status'
      );
    }

    /*
     * Prefer the task returned by the API.
     * This keeps the local task synchronized
     * with backend-generated values such as
     * UpdatedAt or other updated properties.
     */
    const updatedTask = {
      ...(response.data || {}),
    };

    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          ...updatedTask,
          status:
            response.data?.status ||
            newStatus,
        };
      })
    );

    setViewingTask((previousTask) => {
      if (
        !previousTask ||
        previousTask.id !== taskId
      ) {
        return previousTask;
      }

      return {
        ...previousTask,
        ...updatedTask,
        status:
          response.data?.status ||
          newStatus,
      };
    });

    return response;
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Sorting                                                                 */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleSort = (field) => {
    setSortConfig((previous) => {
      if (
        previous.field === field
      ) {
        return {
          field,
          direction:
            previous.direction ===
            'asc'
              ? 'desc'
              : 'asc',
        };
      }

      return {
        field,
        direction: 'asc',
      };
    });
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Status Permission                                                       */
  /* ─────────────────────────────────────────────────────────────────────── */

  /*
   * Assigned users can change status.
   *
   * Task creators can also change status.
   * Admins can change status as well.
   *
   * Editing other task fields is NOT handled
   * by this page.
   */
  const canChangeStatus = (
    task
  ) =>
    isAdmin ||
    task?.createdByUserId ===
      user?.id ||
    task?.assignedToUserId ===
      user?.id;

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Loading                                                                 */
  /* ─────────────────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-600" />
          </div>
        </div>

        <p className="mt-4 animate-pulse text-[13px] text-slate-400">
          Loading tasks...
        </p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Error                                                                   */
  /* ─────────────────────────────────────────────────────────────────────── */

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-red-50">
          <TIcon
            name="alert-circle"
            size={28}
            className="text-red-500"
          />
        </div>

        <p className="mt-4 text-[15px] font-medium text-slate-700">
          Failed to load tasks
        </p>

        <p className="mt-1 text-[13px] text-slate-400">
          {error}
        </p>

        <button
          onClick={fetchTasks}
          className="mt-4 rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Main                                                                    */
  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Status Badges */}
      {tasks.length > 0 && (
        <StatusBadgesRow
          tasks={tasks}
        />
      )}

      {/* Table */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-100">
            <TIcon
              name="inbox"
              size={32}
              className="text-slate-400"
            />
          </div>

          <p className="mt-4 text-[16px] font-medium text-slate-700">
            No assigned tasks
          </p>

          <p className="mt-1 text-[13px] text-slate-400">
            You have no tasks assigned
            to you
          </p>
        </div>
      ) : (
        <TableView
          tasks={tasks}
          onView={handleViewTask}
          onStatusChange={
            handleStatusChange
          }
          canChangeStatus={
            canChangeStatus
          }
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}

      {/* View Drawer */}
      <ViewDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setViewingTask(null);
        }}
        task={viewingTask}
        onStatusChange={
          handleStatusChange
        }
        canChangeStatus={
          viewingTask
            ? canChangeStatus(
                viewingTask
              )
            : false
        }
      />
    </div>
  );
}