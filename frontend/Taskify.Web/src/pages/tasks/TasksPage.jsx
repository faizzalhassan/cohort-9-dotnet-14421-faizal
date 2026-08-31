import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';

/* ─── Date helpers ───────────────────────────────────────────────────────── */

/*
 * Treat dueDate as a calendar date, not a timestamp.
 *
 * Example:
 * dueDate = "2026-08-23"
 * today   = "2026-08-23"
 * => NOT overdue
 *
 * It becomes overdue when:
 * dueDate < today
 */
function getDateKey(date) {
  if (!date) return null;

  // If the API gives us an ISO date/timestamp, always use the date
  // portion directly instead of allowing JS to convert it to UTC.
  if (typeof date === 'string') {
    const datePart = date.split('T')[0];

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDaysToDateKey(dateKey, days) {
  if (!dateKey) return null;

  const [year, month, day] = dateKey.split('-').map(Number);

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  const resultYear = date.getFullYear();
  const resultMonth = String(date.getMonth() + 1).padStart(2, '0');
  const resultDay = String(date.getDate()).padStart(2, '0');

  return `${resultYear}-${resultMonth}-${resultDay}`;
}

function getDateFromToday(daysToAdd) {
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isTaskOverdue(task) {
  if (!task?.dueDate) return false;

  if (task.status === 'Completed' || task.status === 'Cancelled') {
    return false;
  }

  const dueDateKey = getDateKey(task.dueDate);
  const todayKey = getTodayKey();

  if (!dueDateKey) return false;

  return dueDateKey < todayKey;
}

function getDaysUntilDue(task) {
  if (!task?.dueDate) return null;

  const dueDateKey = getDateKey(task.dueDate);
  const todayKey = getTodayKey();

  if (!dueDateKey || dueDateKey < todayKey) {
    return null;
  }

  const [dueYear, dueMonth, dueDay] = dueDateKey.split('-').map(Number);
  const [todayYear, todayMonth, todayDay] = todayKey.split('-').map(Number);

  const dueDate = new Date(dueYear, dueMonth - 1, dueDay);
  const today = new Date(todayYear, todayMonth - 1, todayDay);

  const diff = dueDate.getTime() - today.getTime();

  return Math.round(diff / (1000 * 60 * 60 * 24));
}

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

const taskStatusOptions = [
  {
    value: 'Pending',
    label: 'Pending',
    icon: 'clock-pause',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    value: 'InProgress',
    label: 'In Progress',
    icon: 'progress',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  {
    value: 'Completed',
    label: 'Completed',
    icon: 'circle-check',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
    icon: 'circle-x',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
  },
];

function PriorityBadge({ priority }) {
  const style = priorityConfig[priority] || priorityConfig.Medium;

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
    viewBg: 'bg-indigo-50',
    viewText: 'text-indigo-700',
  },
  Personal: {
    badge: 'bg-emerald-100 text-emerald-700',
    border: '#10b981',
    viewBg: 'bg-emerald-50',
    viewText: 'text-emerald-700',
  },
  Study: {
    badge: 'bg-purple-100 text-purple-700',
    border: '#a855f7',
    viewBg: 'bg-purple-50',
    viewText: 'text-purple-700',
  },
  Meetings: {
    badge: 'bg-amber-100 text-amber-700',
    border: '#f59e0b',
    viewBg: 'bg-amber-50',
    viewText: 'text-amber-700',
  },
  Finance: {
    badge: 'bg-green-100 text-green-700',
    border: '#22c55e',
    viewBg: 'bg-green-50',
    viewText: 'text-green-700',
  },
  Shopping: {
    badge: 'bg-pink-100 text-pink-700',
    border: '#ec4899',
    viewBg: 'bg-pink-50',
    viewText: 'text-pink-700',
  },
  Health: {
    badge: 'bg-red-100 text-red-700',
    border: '#ef4444',
    viewBg: 'bg-red-50',
    viewText: 'text-red-700',
  },
  Home: {
    badge: 'bg-orange-100 text-orange-700',
    border: '#f97316',
    viewBg: 'bg-orange-50',
    viewText: 'text-orange-700',
  },
  Travel: {
    badge: 'bg-cyan-100 text-cyan-700',
    border: '#06b6d4',
    viewBg: 'bg-cyan-50',
    viewText: 'text-cyan-700',
  },
  Other: {
    badge: 'bg-slate-100 text-slate-700',
    border: '#94a3b8',
    viewBg: 'bg-slate-100',
    viewText: 'text-slate-600',
  },
};

/* ─── Quick Date Buttons ─────────────────────────────────────────────────── */
const QUICK_DATE_OPTIONS = [
  { label: 'Today', days: 0 },
  { label: '2 Days', days: 2 },
  { label: '4 Days', days: 4 },
  { label: '6 Days', days: 6 },
  { label: '7 Days', days: 7 },
];

function QuickDateButtons({ onSelect, currentDate, disabled = false }) {
  const isSelected = (dateKey) => {
    return currentDate === dateKey;
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {QUICK_DATE_OPTIONS.map((option) => {
        const dateKey = getDateFromToday(option.days);
        const selected = isSelected(dateKey);

        return (
          <button
            key={option.days}
            type="button"
            onClick={() => onSelect(dateKey)}
            disabled={disabled}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-md transition-all duration-200 ${
              selected
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── View/Edit Drawer ───────────────────────────────────────────────────── */
function ViewEditDrawer({
  isOpen,
  onClose,
  task,
  mode,
  onSave,
  onStatusChange,
  isAdmin,
  onDelete,
  canEdit,
  canDelete,
}) {
  const [isVisible, setIsVisible] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    dueDate: '',
    assignedToUserId: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true))
      );
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (task && mode === 'edit') {
      setForm({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedToUserId: task.assignedToUserId || '',
        status: task.status || 'Pending',
      });
    } else if (mode === 'view') {
      setForm({
        title: task?.title || '',
        description: task?.description || '',
        category: task?.category || '',
        priority: task?.priority || 'Medium',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
        assignedToUserId: task?.assignedToUserId || '',
        status: task?.status || 'Pending',
      });
    }

    setErrors({});
    setServerError('');
  }, [task, mode, isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setServerError('');
  };

  const handleQuickDateSelect = (dateKey) => {
    setForm((prev) => ({
      ...prev,
      dueDate: dateKey,
    }));
    setErrors((prev) => ({
      ...prev,
      dueDate: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!form.category) {
      newErrors.category = 'Category is required';
    }

    if (!form.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (isAdmin && !form.assignedToUserId) {
      newErrors.assignedToUserId = 'Please assign a user';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const priorityMap = {
        Low: 1,
        Medium: 2,
        High: 3,
        Urgent: 4,
      };

      const originalStatus = task?.status || 'Pending';

      const data = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        priority: priorityMap[form.priority] ?? 2,
        dueDate: form.dueDate,
      };

      if (isAdmin && form.assignedToUserId) {
        data.assignedToUserId = form.assignedToUserId;
      }

      const detailsChanged =
        form.title.trim() !== (task?.title || '').trim() ||
        (form.description.trim() || '') !==
          (task?.description || '').trim() ||
        form.category !== (task?.category || '') ||
        form.priority !== (task?.priority || 'Medium') ||
        form.dueDate !==
          (task?.dueDate ? task.dueDate.split('T')[0] : '') ||
        (isAdmin &&
          String(form.assignedToUserId || '') !==
            String(task?.assignedToUserId || ''));

      let savedTask = task;

      if (detailsChanged) {
        const response = await taskService.updateTask(task.id, data);

        if (!response.success) {
          setServerError(response.message || 'Failed to save task');
          return;
        }

        savedTask = response.data;
      }

      if (form.status !== originalStatus) {
        const statusResponse = await taskService.updateTaskStatus(
          task.id,
          form.status
        );

        if (!statusResponse.success) {
          setServerError(
            statusResponse.message || 'Failed to update task status'
          );
          return;
        }

        savedTask = {
          ...(savedTask || task),
          ...(statusResponse.data || {}),
          status: statusResponse.data?.status || form.status,
        };
      }

      onSave(savedTask);
      handleClose();
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && task) {
      onDelete(task);
      handleClose();
    }
  };

  if (!isOpen || !task) return null;

  const catStyle =
    categoryColors[task.category] || categoryColors.Other;

  const priorityStyle =
    priorityConfig[task.priority] || priorityConfig.Medium;

  const isOverdue = isTaskOverdue(task);

  const formatDate = (d) => {
    if (!d) return '—';

    const dateKey = getDateKey(d);

    if (!dateKey) return '—';

    const [year, month, day] = dateKey.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
    statusConfig[task.status] || statusConfig.Pending;

  const categoryOptions = [
    'Work',
    'Personal',
    'Study',
    'Meetings',
    'Finance',
    'Shopping',
    'Health',
    'Home',
    'Travel',
    'Other',
  ];

  const priorityOptions = ['High', 'Medium', 'Low', 'Urgent'];

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200';

  const inputNormal = 'border-slate-200';

  const inputError =
    'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100';

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  const getHeaderInfo = () => {
    if (isViewMode) {
      return {
        title: 'Task Details',
        subtitle: 'Read-only view',
        icon: 'eye',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
      };
    }

    return {
      title: 'Edit Task',
      subtitle: 'Update task details',
      icon: 'pencil',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        style={{
          backgroundColor: isVisible
            ? 'rgba(2,6,23,0.5)'
            : 'transparent',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 z-[9999] flex flex-col w-full max-w-[440px] bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <div
          style={{
            borderTop: isViewMode
              ? `3px solid ${catStyle.border}`
              : '3px solid #1e293b',
          }}
          className="shrink-0"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-9 w-9 place-items-center rounded-xl ${headerInfo.iconBg}`}
              >
                <TIcon
                  name={headerInfo.icon}
                  size={18}
                  className={headerInfo.iconColor}
                />
              </div>

              <div>
                <h2 className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {headerInfo.title}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {headerInfo.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
            >
              <TIcon name="x" size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
              <TIcon
                name="circle-x"
                size={16}
                className="mt-0.5 shrink-0 text-red-500"
              />
              <span className="text-[13px] text-red-700">
                {serverError}
              </span>
            </div>
          )}

          {isViewMode ? (
            <>
              <div className="pb-4 border-b border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  Title
                </p>

                <h3 className="text-[17px] font-bold text-slate-900 leading-snug">
                  {task.title}
                </h3>

                {task.description ? (
                  <p className="mt-2 text-[13px] text-slate-500 leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-2 text-[12px] text-slate-400 italic flex items-center gap-1">
                    <TIcon name="file-description" size={13} />
                    No description provided
                  </p>
                )}
              </div>

              <div className="py-4 border-b border-slate-100 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Details
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400">
                      Category
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold self-start ${catStyle.badge}`}
                    >
                      <TIcon name="folder" size={11} />
                      {task.category || '—'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400">
                      Priority
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold self-start ${priorityStyle.bg} ${priorityStyle.text}`}
                    >
                      <TIcon name={priorityStyle.icon} size={11} />
                      {task.priority}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400">
                      Status
                    </span>

                    <div className="relative">
                      <select
                        value={task.status || 'Pending'}
                        onChange={(e) =>
                          onStatusChange &&
                          onStatusChange(task, e.target.value)
                        }
                        className={`w-full appearance-none rounded-md border border-slate-200 bg-white px-2 py-1.5 pr-7 text-[11px] font-semibold focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200 ${statusStyle.text}`}
                      >
                        {taskStatusOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <TIcon
                        name="chevron-down"
                        size={12}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-4 border-b border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">
                  Due Date
                </p>

                <div
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ${
                    isOverdue
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-slate-50 border border-slate-200'
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
                    {formatDate(task.dueDate)}
                  </span>

                  {isOverdue && (
                    <span className="ml-1 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                      Overdue
                    </span>
                  )}
                </div>
              </div>

              <div className="py-4 border-b border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">
                  People
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white border border-slate-200">
                      <TIcon
                        name="user"
                        size={13}
                        className="text-slate-400"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Created by
                      </p>
                      <p className="text-[13px] font-semibold text-slate-700">
                        {task.createdByName || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {task.assignedToName && (
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white border border-slate-200">
                        <TIcon
                          name="user-check"
                          size={13}
                          className="text-slate-400"
                        />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Assigned to
                        </p>
                        <p className="text-[13px] font-semibold text-slate-700">
                          {task.assignedToName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(task.createdAt || task.updatedAt) && (
                <div className="py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">
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
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
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
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
                  Task Title <span className="text-red-400">*</span>
                </label>

                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="What needs to be done?"
                  className={`${inputBase} ${
                    errors.title ? inputError : inputNormal
                  }`}
                />

                {errors.title && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500">
                    <TIcon name="alert-circle" size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-slate-600">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Add details (optional)"
                  rows={3}
                  className={`${inputBase} resize-none ${inputNormal}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
                    Category <span className="text-red-400">*</span>
                  </label>

                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`${inputBase} appearance-none pr-10 ${
                        errors.category
                          ? inputError
                          : inputNormal
                      }`}
                    >
                      <option value="">Select...</option>

                      {categoryOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>

                    <TIcon
                      name="chevron-down"
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {errors.category && (
                    <p className="flex items-center gap-1 text-[11px] text-red-500">
                      <TIcon name="alert-circle" size={12} />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-slate-600">
                    Priority
                  </label>

                  <div className="relative">
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className={`${inputBase} appearance-none pr-10 ${inputNormal}`}
                    >
                      {priorityOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>

                    <TIcon
                      name="chevron-down"
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-slate-600">
                  Status
                </label>

                <div className="relative">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`${inputBase} appearance-none pr-10 ${inputNormal}`}
                  >
                    {taskStatusOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <TIcon
                    name="chevron-down"
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
                  Due Date <span className="text-red-400">*</span>
                </label>

                <input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={`${inputBase} ${
                    errors.dueDate ? inputError : inputNormal
                  }`}
                />

                <QuickDateButtons
                  onSelect={handleQuickDateSelect}
                  currentDate={form.dueDate}
                />

                {errors.dueDate && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500">
                    <TIcon name="alert-circle" size={12} />
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {isAdmin && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
                    Assign To <span className="text-red-400">*</span>
                  </label>

                  <div className="relative">
                    <select
                      name="assignedToUserId"
                      value={form.assignedToUserId}
                      onChange={handleChange}
                      className={`${inputBase} appearance-none pr-10 ${
                        errors.assignedToUserId
                          ? inputError
                          : inputNormal
                      }`}
                    >
                      <option value="">Select user...</option>
                      <option value="user-1">John Doe</option>
                      <option value="user-2">Jane Smith</option>
                    </select>

                    <TIcon
                      name="chevron-down"
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {errors.assignedToUserId && (
                    <p className="flex items-center gap-1 text-[11px] text-red-500">
                      <TIcon name="alert-circle" size={12} />
                      {errors.assignedToUserId}
                    </p>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-4 bg-white">
          {isViewMode ? (
            <div className="space-y-2">
              {canEdit && (
                <button
                  onClick={() => {
                    const editHandler = window.__switchToEditMode;

                    if (editHandler) {
                      editHandler(task);
                    }
                  }}
                  className="w-full rounded-xl bg-slate-900 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <TIcon name="pencil" size={16} />
                  Edit Task
                </button>
              )}

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full rounded-xl bg-red-600 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <TIcon name="trash" size={16} />
                  Delete Task
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all duration-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <TIcon name="check" size={16} />
                    Update Task
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Edit/Create Drawer ─────────────────────────────────────────────────── */
function EditDrawer({
  isOpen,
  onClose,
  task,
  mode,
  onSave,
  isAdmin,
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    dueDate: '',
    assignedToUserId: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true))
      );
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (task && mode === 'edit') {
      setForm({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate
          ? task.dueDate.split('T')[0]
          : '',
        assignedToUserId: task.assignedToUserId || '',
        status: task.status || 'Pending',
      });
    } else {
      setForm({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        dueDate: '',
        assignedToUserId: '',
        status: 'Pending',
      });
    }

    setErrors({});
    setServerError('');
  }, [task, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setServerError('');
  };

  const handleQuickDateSelect = (dateKey) => {
    setForm((prev) => ({
      ...prev,
      dueDate: dateKey,
    }));
    setErrors((prev) => ({
      ...prev,
      dueDate: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!form.category) {
      newErrors.category = 'Category is required';
    }

    if (!form.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (isAdmin && !form.assignedToUserId) {
      newErrors.assignedToUserId = 'Please assign a user';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const priorityMap = {
        Low: 1,
        Medium: 2,
        High: 3,
        Urgent: 4,
      };

      const data = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        priority: priorityMap[form.priority] ?? 2,
        dueDate: form.dueDate,
      };

      if (isAdmin && form.assignedToUserId) {
        data.assignedToUserId = form.assignedToUserId;
      }

      if (mode === 'edit') {
        const originalStatus = task?.status || 'Pending';

        const detailsChanged =
          form.title.trim() !== (task?.title || '').trim() ||
          (form.description.trim() || '') !==
            (task?.description || '').trim() ||
          form.category !== (task?.category || '') ||
          form.priority !== (task?.priority || 'Medium') ||
          form.dueDate !==
            (task?.dueDate ? task.dueDate.split('T')[0] : '') ||
          (isAdmin &&
            String(form.assignedToUserId || '') !==
              String(task?.assignedToUserId || ''));

        let savedTask = task;

        if (detailsChanged) {
          const response = await taskService.updateTask(
            task.id,
            data
          );

          if (!response.success) {
            setServerError(
              response.message || 'Failed to update task'
            );
            return;
          }

          savedTask = response.data;
        }

        if (form.status !== originalStatus) {
          const statusResponse =
            await taskService.updateTaskStatus(
              task.id,
              form.status
            );

          if (!statusResponse.success) {
            setServerError(
              statusResponse.message ||
                'Failed to update task status'
            );
            return;
          }

          savedTask = {
            ...(savedTask || task),
            ...(statusResponse.data || {}),
            status:
              statusResponse.data?.status || form.status,
          };
        }

        onSave(savedTask);
      } else {
        const response = await taskService.createTask(data);

        if (response.success) {
          onSave(response.data);
        } else {
          setServerError(
            response.message || 'Failed to create task'
          );
        }
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  const categoryOptions = [
    'Work',
    'Personal',
    'Study',
    'Meetings',
    'Finance',
    'Shopping',
    'Health',
    'Home',
    'Travel',
    'Other',
  ];

  const priorityOptions = ['High', 'Medium', 'Low', 'Urgent'];

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200';

  const inputNormal = 'border-slate-200';

  const inputError =
    'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100';

  return (
    <>
      <div
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        style={{
          backgroundColor: isVisible
            ? 'rgba(2,6,23,0.5)'
            : 'transparent',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 z-[9999] flex flex-col w-full max-w-[440px] bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-9 w-9 place-items-center rounded-xl ${
                mode === 'edit'
                  ? 'bg-amber-50'
                  : 'bg-emerald-50'
              }`}
            >
              <TIcon
                name={mode === 'edit' ? 'pencil' : 'plus'}
                size={18}
                className={
                  mode === 'edit'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }
              />
            </div>

            <h2 className="text-[16px] font-semibold text-slate-900">
              {mode === 'edit' ? 'Edit Task' : 'New Task'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
          >
            <TIcon name="x" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <TIcon
                name="circle-x"
                size={16}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <span className="text-[13px] text-red-700">
                {serverError}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
              Task Title <span className="text-red-400">*</span>
            </label>

            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`${inputBase} ${
                errors.title ? inputError : inputNormal
              }`}
            />

            {errors.title && (
              <p className="flex items-center gap-1 text-[11px] text-red-500">
                <TIcon name="alert-circle" size={12} />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-slate-600">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details (optional)"
              rows={3}
              className={`${inputBase} resize-none ${inputNormal}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
                Category <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`${inputBase} appearance-none pr-10 ${
                    errors.category
                      ? inputError
                      : inputNormal
                  }`}
                >
                  <option value="">Select...</option>

                  {categoryOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

                <TIcon
                  name="chevron-down"
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {errors.category && (
                <p className="flex items-center gap-1 text-[11px] text-red-500">
                  <TIcon name="alert-circle" size={12} />
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-slate-600">
                Priority
              </label>

              <div className="relative">
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={`${inputBase} appearance-none pr-10 ${inputNormal}`}
                >
                  {priorityOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>

                <TIcon
                  name="chevron-down"
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {mode === 'edit' && (
            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-slate-600">
                Status
              </label>

              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`${inputBase} appearance-none pr-10 ${inputNormal}`}
                >
                  {taskStatusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <TIcon
                  name="chevron-down"
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
              Due Date <span className="text-red-400">*</span>
            </label>

            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className={`${inputBase} ${
                errors.dueDate ? inputError : inputNormal
              }`}
            />

            <QuickDateButtons
              onSelect={handleQuickDateSelect}
              currentDate={form.dueDate}
            />

            {errors.dueDate && (
              <p className="flex items-center gap-1 text-[11px] text-red-500">
                <TIcon name="alert-circle" size={12} />
                {errors.dueDate}
              </p>
            )}
          </div>

          {isAdmin && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">
                Assign To <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <select
                  name="assignedToUserId"
                  value={form.assignedToUserId}
                  onChange={handleChange}
                  className={`${inputBase} appearance-none pr-10 ${
                    errors.assignedToUserId
                      ? inputError
                      : inputNormal
                  }`}
                >
                  <option value="">Select user...</option>
                  <option value="user-1">John Doe</option>
                  <option value="user-2">Jane Smith</option>
                </select>

                <TIcon
                  name="chevron-down"
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {errors.assignedToUserId && (
                <p className="flex items-center gap-1 text-[11px] text-red-500">
                  <TIcon name="alert-circle" size={12} />
                  {errors.assignedToUserId}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-4 bg-white">
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all duration-200"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <TIcon
                    name={mode === 'edit' ? 'check' : 'plus'}
                    size={16}
                  />
                  {mode === 'edit'
                    ? 'Update Task'
                    : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Delete Confirm Dialog ──────────────────────────────────────────────── */
function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] bg-slate-950/40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50">
            <TIcon
              name="alert-triangle"
              size={28}
              className="text-red-500"
            />
          </div>

          <h3 className="text-center text-[17px] font-semibold text-slate-900">
            Delete Task
          </h3>

          <p className="mt-1.5 text-center text-[13px] text-slate-500">
            Are you sure you want to delete "
            {taskTitle || 'this task'}"? This action cannot be
            undone.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.97] transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Kanban Card ────────────────────────────────────────────────────────── */
function KanbanCard({ task, onView }) {
  const dueDateKey = getDateKey(task.dueDate);
  const todayKey = getTodayKey();

  const isOverdue = isTaskOverdue(task);

  const daysLeft = getDaysUntilDue(task);

  const formatDate = (d) => {
    if (!d) return '-';

    const dateKey = getDateKey(d);

    if (!dateKey) return '-';

    const [year, month, day] = dateKey.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      }
    );
  };

  const catStyle =
    categoryColors[task.category] || categoryColors.Other;

  const hasDescription =
    task.description &&
    task.description.trim().length > 0;

  const formatCreatedDate = (d) => {
    if (!d) return '';

    const createdDate = new Date(d);

    if (Number.isNaN(createdDate.getTime())) {
      return '';
    }

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const createdDay = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );

    const diffDays = Math.floor(
      (startOfToday.getTime() - createdDay.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return createdDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group relative"
      style={{
        borderLeft: `3px solid ${catStyle.border}`,
      }}
      onClick={() => onView(task)}
    >
      <div className="flex items-start justify-between gap-1.5 mb-1">
        <div className="flex-1 min-w-0">
          {task.category && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium mb-1 ${catStyle.badge}`}
            >
              <TIcon name="folder" size={10} />
              {task.category}
            </span>
          )}

          <h4 className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2">
            {task.title}
          </h4>
        </div>

        {/* Arrow icon on top right */}
        <div className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <TIcon
            name="chevron-right"
            size={16}
            className="text-slate-400"
          />
        </div>
      </div>

      <div className="mb-2">
        {hasDescription ? (
          <p className="text-[12px] text-slate-500 line-clamp-2 leading-snug">
            {task.description}
          </p>
        ) : (
          <p className="text-[11px] text-slate-400 italic flex items-center gap-1">
            <TIcon name="file-description" size={12} />
            No description
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mb-1.5">
        <PriorityBadge priority={task.priority} />

        {isOverdue ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
            <TIcon name="alert-circle" size={11} />
            Overdue
          </span>
        ) : daysLeft !== null && daysLeft >= 0 ? (
          <span
            className={`text-[10px] font-medium ${
              daysLeft <= 2
                ? 'text-red-600'
                : daysLeft <= 5
                ? 'text-amber-600'
                : 'text-slate-500'
            }`}
          >
            {daysLeft === 0
              ? 'Due today'
              : `${daysLeft}d left`}
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <TIcon name="clock" size={10} />
          <span className="italic">
            {formatCreatedDate(task.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <TIcon name="calendar" size={10} />
          <span className="italic">
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Kanban Column ──────────────────────────────────────────────────────── */
function KanbanColumn({
  title,
  icon,
  headerColor,
  headerBg,
  tasks,
  onView,
}) {
  return (
    <div className="flex flex-col flex-1 min-w-[220px]">
      <div
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 mb-2.5 ${headerBg}`}
      >
        <TIcon
          name={icon}
          size={14}
          className={headerColor}
        />

        <span
          className={`text-[11px] font-semibold uppercase tracking-wide ${headerColor}`}
        >
          {title}
        </span>
      </div>

      <div
        className="flex flex-col gap-2 flex-1 pr-0.5"
        style={{ overflowX: 'visible' }}
      >
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-6 flex items-center justify-center">
            <span className="text-[11px] text-slate-400">
              No tasks
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Kanban View ────────────────────────────────────────────────────────── */
function KanbanView({ tasks, onView }) {
  const columns = [
    {
      key: 'Pending',
      title: 'Pending',
      icon: 'clock-pause',
      headerColor: 'text-amber-700',
      headerBg: 'bg-amber-50',
    },
    {
      key: 'InProgress',
      title: 'In Progress',
      icon: 'progress',
      headerColor: 'text-indigo-700',
      headerBg: 'bg-indigo-50',
    },
    {
      key: 'Completed',
      title: 'Completed',
      icon: 'circle-check',
      headerColor: 'text-emerald-700',
      headerBg: 'bg-emerald-50',
    },
    {
      key: 'Cancelled',
      title: 'Cancelled',
      icon: 'circle-x',
      headerColor: 'text-slate-600',
      headerBg: 'bg-slate-100',
    },
    {
      key: 'Overdue',
      title: 'Overdue',
      icon: 'alert-triangle',
      headerColor: 'text-red-700',
      headerBg: 'bg-red-50',
    },
  ];

  /*
   * IMPORTANT:
   *
   * Overdue is NOT a real status.
   * It is derived from dueDate.
   *
   * Therefore:
   * - Pending + overdue => Overdue column
   * - InProgress + overdue => Overdue column
   * - Completed => Completed
   * - Cancelled => Cancelled
   *
   * This prevents overdue tasks from appearing in both their normal
   * status column and the Overdue column.
   */
  const grouped = columns.reduce((acc, col) => {
    if (col.key === 'Overdue') {
      acc[col.key] = tasks.filter((task) =>
        isTaskOverdue(task)
      );
    } else {
      acc[col.key] = tasks.filter(
        (task) =>
          !isTaskOverdue(task) &&
          (task.status === col.key ||
            task.status?.toLowerCase() ===
              col.key.toLowerCase())
      );
    }

    return acc;
  }, {});

  return (
    <div
      className="flex gap-3"
      style={{
        overflowX: 'auto',
        overflowY: 'visible',
        paddingBottom: 4,
      }}
    >
      {columns.map((col) => (
        <KanbanColumn
          key={col.key}
          title={col.title}
          icon={col.icon}
          headerColor={col.headerColor}
          headerBg={col.headerBg}
          tasks={grouped[col.key] || []}
          onView={onView}
        />
      ))}
    </div>
  );
}

/* ─── Filter Select ──────────────────────────────────────────────────────── */
function FilterSelect({
  icon,
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative inline-flex items-center flex-1 min-w-[90px]">
      {icon && (
        <TIcon
          name={icon}
          size={14}
          className="absolute left-2.5 text-slate-400 pointer-events-none z-10"
        />
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-[12px] font-medium text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100/50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <TIcon
        name="chevron-down"
        size={13}
        className="absolute right-2.5 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

/* ─── TasksPage ──────────────────────────────────────────────────────────── */
export default function TasksPage() {
  const { user, isAdmin } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewEditDrawerOpen, setViewEditDrawerOpen] =
    useState(false);

  const [editDrawerOpen, setEditDrawerOpen] =
    useState(false);

  const [activeTask, setActiveTask] = useState(null);

  const [drawerMode, setDrawerMode] = useState('view');

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);

  const [dueFilter, setDueFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] =
    useState('all');
  const [taskTypeFilter, setTaskTypeFilter] =
    useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await taskService.getTasks({});

      if (response.success) {
        setTasks(response.data || []);
      } else {
        setError(
          response.message || 'Failed to load tasks'
        );
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    const todayKey = getTodayKey();
    const tomorrowKey = addDaysToDateKey(todayKey, 1);

    const todayDate = new Date();

    const dayOfWeek = todayDate.getDay();

    /*
     * Keep the existing "end of week" behavior.
     * Sunday = 0, Saturday = 6.
     */
    const daysUntilSaturday = 6 - dayOfWeek;

    const endOfWeekKey = addDaysToDateKey(
      todayKey,
      daysUntilSaturday
    );

    let result = [...tasks];

    if (dueFilter !== 'all') {
      result = result.filter((task) => {
        if (!task.dueDate) return false;

        const dueDateKey = getDateKey(task.dueDate);

        if (!dueDateKey) return false;

        switch (dueFilter) {
          case 'overdue':
            return isTaskOverdue(task);

          case 'today':
            return dueDateKey === todayKey;

          case 'tomorrow':
            return dueDateKey === tomorrowKey;

          case 'thisWeek':
            return (
              dueDateKey >= todayKey &&
              dueDateKey <= endOfWeekKey
            );

          default:
            return true;
        }
      });
    }

    if (priorityFilter !== 'all') {
      result = result.filter(
        (task) => task.priority === priorityFilter
      );
    }

    if (taskTypeFilter === 'myTasks') {
      result = result.filter(
        (task) => task.createdByUserId === user?.id
      );
    } else if (taskTypeFilter === 'assignedToMe') {
      result = result.filter(
        (task) => task.assignedToUserId === user?.id
      );
    }

    const priorityOrder = {
      Urgent: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;

      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case 'dueEarliest':
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          const aDate = getDateKey(a.dueDate);
          const bDate = getDateKey(b.dueDate);

          return aDate.localeCompare(bDate);
        });
        break;

      case 'dueLatest':
        result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          const aDate = getDateKey(a.dueDate);
          const bDate = getDateKey(b.dueDate);

          return bDate.localeCompare(aDate);
        });
        break;

      case 'priorityHighest':
        result.sort(
          (a, b) =>
            (priorityOrder[b.priority] || 0) -
            (priorityOrder[a.priority] || 0)
        );
        break;

      case 'priorityLowest':
        result.sort(
          (a, b) =>
            (priorityOrder[a.priority] || 0) -
            (priorityOrder[b.priority] || 0)
        );
        break;

      case 'titleAZ':
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case 'titleZA':
        result.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    tasks,
    dueFilter,
    priorityFilter,
    taskTypeFilter,
    sortBy,
    user,
  ]);

  const isFilterActive =
    dueFilter !== 'all' ||
    priorityFilter !== 'all' ||
    taskTypeFilter !== 'all' ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setDueFilter('all');
    setPriorityFilter('all');
    setTaskTypeFilter('all');
    setSortBy('newest');
  };

  const handleCreateTask = () => {
    setActiveTask(null);
    setEditDrawerOpen(true);
  };

  const handleViewTask = (task) => {
    setActiveTask(task);
    setDrawerMode('view');
    setViewEditDrawerOpen(true);
  };

  const handleEditTask = (task) => {
    setActiveTask(task);
    setDrawerMode('edit');
    setViewEditDrawerOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      const response = await taskService.deleteTask(
        taskToDelete.id
      );

      if (response.success) {
        setTasks((prev) =>
          prev.filter(
            (t) => t.id !== taskToDelete.id
          )
        );

        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    } catch (err) {
      setError(
        err.message || 'Failed to delete task'
      );
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (
      !task ||
      !newStatus ||
      newStatus === task.status
    ) {
      return;
    }

    try {
      const response =
        await taskService.updateTaskStatus(
          task.id,
          newStatus
        );

      if (!response.success) {
        setError(
          response.message ||
            'Failed to update task status'
        );
        return;
      }

      const updatedTask = {
        ...task,
        ...(response.data || {}),
        status:
          response.data?.status || newStatus,
      };

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? updatedTask : t
        )
      );

      setActiveTask((prev) =>
        prev && prev.id === task.id
          ? updatedTask
          : prev
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          err.message ||
          'Failed to update task status'
      );
    }
  };

  const handleTaskSaved = (savedTask) => {
    if (drawerMode === 'edit' || editDrawerOpen) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === savedTask.id ? savedTask : t
        )
      );
    } else {
      setTasks((prev) => [savedTask, ...prev]);
    }

    setViewEditDrawerOpen(false);
    setEditDrawerOpen(false);
    setActiveTask(null);
  };

  useEffect(() => {
    if (
      viewEditDrawerOpen &&
      drawerMode === 'view'
    ) {
      window.__switchToEditMode = (task) => {
        handleEditTask(task);
      };
    }

    return () => {
      delete window.__switchToEditMode;
    };
  }, [viewEditDrawerOpen, drawerMode]);

  /*
   * Status counts:
   *
   * Pending / InProgress remain based on the actual status.
   * Overdue is a derived count based on dueDate.
   *
   * Therefore a Pending task that became overdue will:
   * - still count as Pending
   * - also count as Overdue
   */
  const statusCounts = {
    All: tasks.length,

    Pending: tasks.filter(
      (t) => t.status === 'Pending'
    ).length,

    InProgress: tasks.filter(
      (t) => t.status === 'InProgress'
    ).length,

    Completed: tasks.filter(
      (t) => t.status === 'Completed'
    ).length,

    Cancelled: tasks.filter(
      (t) => t.status === 'Cancelled'
    ).length,

    Overdue: tasks.filter((t) =>
      isTaskOverdue(t)
    ).length,
  };

  const canEdit = (task) =>
    isAdmin || task?.createdByUserId === user?.id;

  const canDelete = (task) =>
    isAdmin || task?.createdByUserId === user?.id;

  const statusBadges = [
    {
      key: 'Pending',
      label: 'Pending',
      icon: 'clock-pause',
      color: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      key: 'InProgress',
      label: 'In Progress',
      icon: 'progress',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      key: 'Completed',
      label: 'Completed',
      icon: 'circle-check',
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      key: 'Cancelled',
      label: 'Cancelled',
      icon: 'circle-x',
      color: 'bg-slate-600 hover:bg-slate-700',
    },
    {
      key: 'Overdue',
      label: 'Overdue',
      icon: 'alert-triangle',
      color: 'bg-red-600 hover:bg-red-700',
    },
  ];

  const dueOptions = [
    {
      value: 'all',
      label: 'All Due Dates',
    },
    {
      value: 'overdue',
      label: 'Overdue',
    },
    {
      value: 'today',
      label: 'Due Today',
    },
    {
      value: 'tomorrow',
      label: 'Due Tomorrow',
    },
    {
      value: 'thisWeek',
      label: 'Due This Week',
    },
  ];

  const priorityOptions = [
    {
      value: 'all',
      label: 'All Priorities',
    },
    {
      value: 'Urgent',
      label: 'Urgent',
    },
    {
      value: 'High',
      label: 'High',
    },
    {
      value: 'Medium',
      label: 'Medium',
    },
    {
      value: 'Low',
      label: 'Low',
    },
  ];

  const taskTypeOptions = [
    {
      value: 'all',
      label: 'All Tasks',
    },
    {
      value: 'myTasks',
      label: 'My Tasks',
    },
    {
      value: 'assignedToMe',
      label: 'Assigned to Me',
    },
  ];

  const sortOptions = [
    {
      value: 'newest',
      label: 'Newest First',
    },
    {
      value: 'oldest',
      label: 'Oldest First',
    },
    {
      value: 'dueEarliest',
      label: 'Due Date: Earliest',
    },
    {
      value: 'dueLatest',
      label: 'Due Date: Latest',
    },
    {
      value: 'priorityHighest',
      label: 'Priority: Highest',
    },
    {
      value: 'priorityLowest',
      label: 'Priority: Lowest',
    },
    {
      value: 'titleAZ',
      label: 'Title: A–Z',
    },
    {
      value: 'titleZA',
      label: 'Title: Z–A',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-indigo-600 animate-pulse" />
          </div>
        </div>

        <p className="mt-4 text-[13px] text-slate-400 animate-pulse">
          Loading tasks...
        </p>
      </div>
    );
  }

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
          className="mt-4 rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (
    tasks.length > 0 &&
    filteredTasks.length === 0
  ) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {statusBadges.map((badge) => (
            <div
              key={badge.key}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default ${badge.color}`}
            >
              <TIcon name={badge.icon} size={14} />

              <span className="text-[12px] font-semibold">
                {badge.label}
              </span>

              <span className="ml-0.5 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
                {statusCounts[badge.key] || 0}
              </span>
            </div>
          ))}

          <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-[200px]">
            <FilterSelect
              icon="calendar"
              value={dueFilter}
              onChange={setDueFilter}
              options={dueOptions}
            />

            <FilterSelect
              icon="flag"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={priorityOptions}
            />

            <FilterSelect
              icon="users"
              value={taskTypeFilter}
              onChange={setTaskTypeFilter}
              options={taskTypeOptions}
            />

            <FilterSelect
              icon="sort-descending"
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />

            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200"
                title="Clear filters"
              >
                <TIcon name="x" size={14} />
              </button>
            )}
          </div>

          <button
            onClick={handleCreateTask}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-white shadow-md transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:scale-105 active:scale-[0.97] shrink-0"
          >
            <TIcon name="plus" size={14} />

            <span className="text-[12px] font-semibold">
              New Task
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-100">
            <TIcon
              name="filter-off"
              size={32}
              className="text-slate-400"
            />
          </div>

          <p className="mt-4 text-[16px] font-medium text-slate-700">
            No matching tasks
          </p>

          <p className="mt-1 text-[13px] text-slate-400">
            Try changing or clearing your filters.
          </p>

          <button
            onClick={resetFilters}
            className="mt-6 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] transition-all duration-200"
          >
            <TIcon name="refresh" size={16} />
            Clear Filters
          </button>
        </div>

        <ViewEditDrawer
          isOpen={viewEditDrawerOpen}
          onClose={() => {
            setViewEditDrawerOpen(false);
            setActiveTask(null);
          }}
          task={activeTask}
          mode={drawerMode}
          onSave={handleTaskSaved}
          onStatusChange={handleStatusChange}
          isAdmin={isAdmin}
          onDelete={handleDeleteClick}
          canEdit={
            activeTask
              ? canEdit(activeTask)
              : false
          }
          canDelete={
            activeTask
              ? canDelete(activeTask)
              : false
          }
        />

        <EditDrawer
          isOpen={editDrawerOpen}
          onClose={() => {
            setEditDrawerOpen(false);
            setActiveTask(null);
          }}
          task={activeTask}
          mode="create"
          onSave={handleTaskSaved}
          isAdmin={isAdmin}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          taskTitle={taskToDelete?.title}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {statusBadges.map((badge) => (
          <div
            key={badge.key}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default ${badge.color}`}
          >
            <TIcon name={badge.icon} size={14} />

            <span className="text-[12px] font-semibold">
              {badge.label}
            </span>

            <span className="ml-0.5 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
              {statusCounts[badge.key] || 0}
            </span>
          </div>
        ))}

        <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-[200px]">
          <FilterSelect
            icon="calendar"
            value={dueFilter}
            onChange={setDueFilter}
            options={dueOptions}
          />

          <FilterSelect
            icon="flag"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
          />

          <FilterSelect
            icon="users"
            value={taskTypeFilter}
            onChange={setTaskTypeFilter}
            options={taskTypeOptions}
          />

          <FilterSelect
            icon="sort-descending"
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />

          {isFilterActive && (
            <button
              onClick={resetFilters}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200"
              title="Clear filters"
            >
              <TIcon name="x" size={14} />
            </button>
          )}
        </div>

        <button
          onClick={handleCreateTask}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-white shadow-md transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:scale-105 active:scale-[0.97] shrink-0"
        >
          <TIcon name="plus" size={14} />

          <span className="text-[12px] font-semibold">
            New Task
          </span>
        </button>
      </div>

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
            No tasks yet
          </p>

          <p className="mt-1 text-[13px] text-slate-400">
            Create your first task to get started
          </p>

          <button
            onClick={handleCreateTask}
            className="mt-6 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] transition-all duration-200"
          >
            <TIcon name="plus" size={16} />
            Create Task
          </button>
        </div>
      ) : (
        <KanbanView
          tasks={filteredTasks}
          onView={handleViewTask}
        />
      )}

      <ViewEditDrawer
        isOpen={viewEditDrawerOpen}
        onClose={() => {
          setViewEditDrawerOpen(false);
          setActiveTask(null);
        }}
        task={activeTask}
        mode={drawerMode}
        onSave={handleTaskSaved}
        onStatusChange={handleStatusChange}
        isAdmin={isAdmin}
        onDelete={handleDeleteClick}
        canEdit={
          activeTask
            ? canEdit(activeTask)
            : false
        }
        canDelete={
          activeTask
            ? canDelete(activeTask)
            : false
        }
      />

      <EditDrawer
        isOpen={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setActiveTask(null);
        }}
        task={activeTask}
        mode="create"
        onSave={handleTaskSaved}
        isAdmin={isAdmin}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}