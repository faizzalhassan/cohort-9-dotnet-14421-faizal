import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';

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
  High:   { bg: 'bg-red-50',    text: 'text-red-700',    icon: 'arrow-up',    dot: 'bg-red-500' },
  Medium: { bg: 'bg-amber-50',  text: 'text-amber-700',  icon: 'minus',       dot: 'bg-amber-500' },
  Low:    { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: 'arrow-down',  dot: 'bg-blue-500' },
  Urgent: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'urgent',      dot: 'bg-purple-500' },
};

function PriorityBadge({ priority }) {
  const style = priorityConfig[priority] || priorityConfig.Medium;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}>
      <TIcon name={style.icon} size={11} />
      {priority}
    </span>
  );
}

/* ─── Category colors ────────────────────────────────────────────────────── */
const categoryColors = {
  Work:     { badge: 'bg-indigo-100 text-indigo-700',   border: '#6366f1' },
  Personal: { badge: 'bg-emerald-100 text-emerald-700', border: '#10b981' },
  Study:    { badge: 'bg-purple-100 text-purple-700',   border: '#a855f7' },
  Meetings: { badge: 'bg-amber-100 text-amber-700',     border: '#f59e0b' },
  Finance:  { badge: 'bg-green-100 text-green-700',     border: '#22c55e' },
  Shopping: { badge: 'bg-pink-100 text-pink-700',       border: '#ec4899' },
  Health:   { badge: 'bg-red-100 text-red-700',         border: '#ef4444' },
  Home:     { badge: 'bg-orange-100 text-orange-700',   border: '#f97316' },
  Travel:   { badge: 'bg-cyan-100 text-cyan-700',       border: '#06b6d4' },
  Other:    { badge: 'bg-slate-100 text-slate-700',     border: '#94a3b8' },
};

/* ─── Status Badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const config = {
    Pending:    { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'clock-pause' },
    InProgress: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: 'progress' },
    Completed:  { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'circle-check' },
    Cancelled:  { bg: 'bg-slate-100',  text: 'text-slate-600',   icon: 'circle-x' },
  };
  const style = config[status] || config.Pending;
  const displayName = status === 'InProgress' ? 'In Progress' : status;

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}>
      <TIcon name={style.icon} size={11} />
      {displayName}
    </span>
  );
}

/* ─── Status Dropdown for Table ─────────────────────────────────────────── */
function StatusDropdown({ task, onStatusChange, canChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const statusOptions = ['Pending', 'InProgress', 'Completed', 'Cancelled'];

  const handleChange = async (newStatus) => {
    if (newStatus === task.status || !canChange) return;
    setChanging(true);
    try {
      await onStatusChange(task.id, newStatus);
    } finally {
      setChanging(false);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  if (!canChange) {
    return <StatusBadge status={task.status} />;
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        disabled={changing}
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all duration-200 hover:ring-2 hover:ring-indigo-200 ${
          changing ? 'opacity-50 cursor-wait' : 'cursor-pointer'
        } ${
          task.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
          task.status === 'InProgress' ? 'bg-indigo-50 text-indigo-700' :
          task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
          'bg-slate-100 text-slate-600'
        }`}
      >
        <TIcon name={
          task.status === 'Pending' ? 'clock-pause' :
          task.status === 'InProgress' ? 'progress' :
          task.status === 'Completed' ? 'circle-check' :
          'circle-x'
        } size={11} />
        {task.status === 'InProgress' ? 'In Progress' : task.status}
        <TIcon name="chevron-down" size={10} className="ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)} />
          <div 
            className="fixed z-[99999] min-w-[130px] rounded-xl border border-slate-200 bg-white py-1 shadow-2xl"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            {statusOptions
              .filter(s => s !== task.status)
              .map(status => (
                <button
                  key={status}
                  onClick={() => handleChange(status)}
                  className="flex w-full items-center px-3 py-1.5 text-[12px] text-slate-600 transition-colors hover:bg-slate-50 whitespace-nowrap"
                >
                  {status === 'InProgress' ? 'In Progress' : status}
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
  const inProgressCount = tasks.filter(t => t.status === 'InProgress').length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default bg-blue-600">
        <TIcon name="progress" size={14} />
        <span className="text-[12px] font-semibold">In Progress</span>
        <span className="ml-0.5 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
          {inProgressCount}
        </span>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Dialog ──────────────────────────────────────────────── */
function DeleteConfirmDialog({ isOpen, onClose, onConfirm, taskTitle }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-slate-950/40" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50">
            <TIcon name="alert-triangle" size={28} className="text-red-500" />
          </div>
          <h3 className="text-center text-[17px] font-semibold text-slate-900">Delete Task</h3>
          <p className="mt-1.5 text-center text-[13px] text-slate-500">Are you sure you want to delete "{taskTitle || 'this task'}"? This action cannot be undone.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-all duration-200">Cancel</button>
            <button onClick={onConfirm} className="rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.97] transition-all duration-200">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Premium View/Edit Drawer ───────────────────────────────────────────────── */
function ViewEditDrawer({ isOpen, onClose, task, onStatusChange, canChangeStatus, isOwnTask, onDelete, onSave }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState('view'); // 'view' or 'edit'
  const [changingStatus, setChangingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');
  
  // Edit form state
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium', dueDate: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
    setErrors({});
    setServerError('');
    setMode('view');
  }, [task, isOpen]);

  useEffect(() => {
    setChangingStatus(false);
    setStatusError('');
  }, [task]);

  if (!isOpen || !task) return null;

  const catStyle = categoryColors[task.category] || categoryColors.Other;
  const priorityStyle = priorityConfig[task.priority] || priorityConfig.Medium;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed' && task.status !== 'Cancelled';
  
  const getDaysRemaining = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateMessage = () => {
    if (!task.dueDate) return null;
    if (isOverdue) {
      const daysOverdue = Math.ceil((today.getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      return {
        message: `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`,
        icon: 'alert-triangle',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200'
      };
    }
    const daysLeft = getDaysRemaining();
    if (daysLeft === 0) {
      return {
        message: 'Due today',
        icon: 'clock',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200'
      };
    }
    if (daysLeft === 1) {
      return {
        message: '1 day remaining',
        icon: 'calendar-clock',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      };
    }
    if (daysLeft <= 3) {
      return {
        message: `${daysLeft} days remaining`,
        icon: 'calendar-clock',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      };
    }
    if (daysLeft <= 7) {
      return {
        message: `${daysLeft} days remaining`,
        icon: 'calendar',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200'
      };
    }
    return {
      message: `${daysLeft} days remaining`,
      icon: 'calendar',
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200'
    };
  };

  const dueDateInfo = getDueDateMessage();

  const statusConfig = {
    Pending:    { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'clock-pause' },
    InProgress: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: 'progress' },
    Completed:  { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'circle-check' },
    Cancelled:  { bg: 'bg-slate-100',  text: 'text-slate-600',   icon: 'circle-x' },
  };
  const statusStyle = statusConfig[task.status] || statusConfig.Pending;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const statusOptions = ['Pending', 'InProgress', 'Completed', 'Cancelled'];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status) return;
    setChangingStatus(true);
    setStatusError('');
    try {
      await onStatusChange(task.id, newStatus);
      onClose();
    } catch {
      setStatusError('Failed to update status');
    } finally {
      setChangingStatus(false);
    }
  };

  // Edit form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setServerError('');
    try {
      const priorityMap = { Low: 1, Medium: 2, High: 3, Urgent: 4 };
      const data = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        priority: priorityMap[form.priority] ?? 2,
        dueDate: form.dueDate
      };
      
      const response = await taskService.updateTask(task.id, data);
      
      if (response.success) {
        onSave(response.data);
        setMode('view');
        onClose();
      } else {
        setServerError(response.message || 'Failed to save task');
      }
    } catch (err) {
      setServerError(err?.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setMode('edit');
  };

  const handleClose = () => {
    setMode('view');
    onClose();
  };

  const inputBase = `w-full rounded-xl border bg-white px-4 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200`;
  const inputNormal = 'border-slate-200';
  const inputError = 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100';

  const categoryOptions = ['Work', 'Personal', 'Study', 'Meetings', 'Finance', 'Shopping', 'Health', 'Home', 'Travel', 'Other'];
  const priorityOptions = ['High', 'Medium', 'Low', 'Urgent'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        style={{
          backgroundColor: isVisible ? 'rgba(2,6,23,0.5)' : 'transparent',
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[9999] flex flex-col w-full max-w-[440px] bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>

        {/* Header */}
        <div style={{ borderTop: `3px solid ${mode === 'edit' ? '#1e293b' : catStyle.border}` }} className="shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {mode === 'edit' ? (
                <>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50">
                    <TIcon name="pencil" size={18} className="text-amber-600" />
                  </div>
                  <h2 className="text-[16px] font-semibold text-slate-900">Edit Task</h2>
                </>
              ) : (
                <h2 className="text-[16px] font-semibold text-slate-900">{task.title}</h2>
              )}
            </div>
            <button onClick={handleClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200">
              <TIcon name="x" size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {statusError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
              <TIcon name="circle-x" size={16} className="mt-0.5 shrink-0 text-red-500" />
              <span className="text-[13px] text-red-700">{statusError}</span>
            </div>
          )}

          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
              <TIcon name="circle-x" size={16} className="mt-0.5 shrink-0 text-red-500" />
              <span className="text-[13px] text-red-700">{serverError}</span>
            </div>
          )}

          {mode === 'edit' ? (
            // Edit Mode
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">Task Title <span className="text-red-400">*</span></label>
                <input name="title" type="text" value={form.title} onChange={handleFormChange} placeholder="What needs to be done?" className={`${inputBase} ${errors.title ? inputError : inputNormal}`} />
                {errors.title && <p className="flex items-center gap-1 text-[11px] text-red-500"><TIcon name="alert-circle" size={12} />{errors.title}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-slate-600">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Add details (optional)" rows={3} className={`${inputBase} resize-none ${inputNormal}`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">Category <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select name="category" value={form.category} onChange={handleFormChange} className={`${inputBase} appearance-none pr-10 ${errors.category ? inputError : inputNormal}`}>
                      <option value="">Select...</option>
                      {categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <TIcon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {errors.category && <p className="flex items-center gap-1 text-[11px] text-red-500"><TIcon name="alert-circle" size={12} />{errors.category}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-slate-600">Priority</label>
                  <div className="relative">
                    <select name="priority" value={form.priority} onChange={handleFormChange} className={`${inputBase} appearance-none pr-10 ${inputNormal}`}>
                      {priorityOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <TIcon name="chevron-down" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-[12px] font-medium text-slate-600">Due Date <span className="text-red-400">*</span></label>
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleFormChange} className={`${inputBase} ${errors.dueDate ? inputError : inputNormal}`} />
                {errors.dueDate && <p className="flex items-center gap-1 text-[11px] text-red-500"><TIcon name="alert-circle" size={12} />{errors.dueDate}</p>}
              </div>
            </form>
          ) : (
            // View Mode
            <>
              {task.description && (
                <div className="pb-4 border-b border-slate-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Description</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{task.description}</p>
                </div>
              )}

              <div className="py-4 border-b border-slate-100 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Details</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400">Category</span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold self-start ${catStyle.badge}`}>
                      <TIcon name="folder" size={11} />
                      {task.category || '—'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400">Priority</span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold self-start ${priorityStyle.bg} ${priorityStyle.text}`}>
                      <TIcon name={priorityStyle.icon} size={11} />
                      {task.priority}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-medium text-slate-400">Status</span>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold self-start ${statusStyle.bg} ${statusStyle.text}`}>
                      <TIcon name={statusStyle.icon} size={11} />
                      {task.status === 'InProgress' ? 'In Progress' : task.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Due Date with spacing */}
              <div className="py-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Due Date</p>
                <div className="space-y-2">
                  <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 mr-2 ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
                    <TIcon name="calendar" size={15} className={isOverdue ? 'text-red-500' : 'text-slate-400'} />
                    <span className={`text-[13px] font-medium ${isOverdue ? 'text-red-700' : 'text-slate-700'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                    {isOverdue && (
                      <span className="ml-1 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">Overdue</span>
                    )}
                  </div>
                  
                  {/* Due Date Indicator Message */}
                  {dueDateInfo && task.status !== 'Completed' && task.status !== 'Cancelled' && (
                    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border ${dueDateInfo.bg} ${dueDateInfo.border}`}>
                      <TIcon name={dueDateInfo.icon} size={15} className={dueDateInfo.color} />
                      <span className={`text-[12px] font-medium ${dueDateInfo.color}`}>
                        {dueDateInfo.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(task.createdAt || task.updatedAt) && (
                <div className="py-4 border-t border-slate-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Timeline</p>
                  <div className="space-y-1.5">
                    {task.createdAt && (
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <TIcon name="clock" size={13} className="text-slate-400" />
                        <span className="text-slate-400">Created:</span>
                        <span className="font-medium">{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                    {task.updatedAt && (
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <TIcon name="refresh" size={13} className="text-slate-400" />
                        <span className="text-slate-400">Updated:</span>
                        <span className="font-medium">{new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4 bg-white">
          {mode === 'edit' ? (
            // Edit Mode Footer
            <div className="flex items-center justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => setMode('view')} 
                disabled={isSubmitting} 
                className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleFormSubmit} 
                disabled={isSubmitting} 
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting
                  ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving...</>
                  : <><TIcon name="check" size={16} />Update Task</>
                }
              </button>
            </div>
          ) : (
            // View Mode Footer
            <>
              {isOwnTask ? (
                // Own task - Show Edit and Delete buttons
                <div className="space-y-2">
                  <button
                    onClick={handleEditClick}
                    className="w-full rounded-xl bg-slate-900 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <TIcon name="pencil" size={16} />
                    Edit Task
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="w-full rounded-xl bg-red-600 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <TIcon name="trash" size={16} />
                    Delete Task
                  </button>
                </div>
              ) : (
                // Assigned task - Show Change Status
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Change Status</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Current Status - Highlighted with border */}
                    <button
                      disabled
                      className={`rounded-xl px-4 py-2 text-[12px] font-medium cursor-default border-2 border-indigo-300 ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <TIcon name={statusStyle.icon} size={12} />
                        {task.status === 'InProgress' ? 'In Progress' : task.status}
                      </span>
                    </button>
                    {/* Other Status Options */}
                    {statusOptions
                      .filter((status) => status !== task.status)
                      .map((status) => {
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={changingStatus}
                            className={`rounded-xl border border-slate-200 px-4 py-2 text-[12px] font-medium text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50`}
                          >
                            {status === 'InProgress' ? 'In Progress' : status}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Sortable Table Header ───────────────────────────────────────────────── */
function SortableHeader({ label, field, currentSort, onSort, icon, align = 'left' }) {
  const isActive = currentSort.field === field;
  const direction = isActive ? currentSort.direction : null;

  return (
    <th className="px-4 py-3">
      <button
        onClick={() => onSort(field)}
        className={`group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
          isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-800'
        }`}
        style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
      >
        {icon && <TIcon name={icon} size={13} className={isActive ? 'text-indigo-500' : 'text-slate-500'} />}
        {label}
        <div className="relative flex flex-col items-center ml-0.5">
          <TIcon 
            name="chevron-up" 
            size={10} 
            className={`transition-all duration-200 -mb-0.5 ${
              isActive && direction === 'asc' ? 'text-indigo-600 opacity-100' : 'text-slate-400 opacity-60 group-hover:opacity-100'
            }`}
          />
          <TIcon 
            name="chevron-down" 
            size={10} 
            className={`transition-all duration-200 -mt-0.5 ${
              isActive && direction === 'desc' ? 'text-indigo-600 opacity-100' : 'text-slate-400 opacity-60 group-hover:opacity-100'
            }`}
          />
        </div>
      </button>
    </th>
  );
}

/* ─── Premium Table View with Sorting ────────────────────────────────────── */
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
      ? new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—';

  // Sort tasks based on sortConfig
  const sortedTasks = useMemo(() => {
    if (!sortConfig.field) return tasks;

    const sorted = [...tasks];
    const { field, direction } = sortConfig;

    sorted.sort((a, b) => {
      let valueA, valueB;

      switch (field) {
        case 'title':
          valueA = (a.title || '').toLowerCase();
          valueB = (b.title || '').toLowerCase();
          break;
        case 'category':
          valueA = (a.category || '').toLowerCase();
          valueB = (b.category || '').toLowerCase();
          break;
        case 'priority': {
          const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        }
        case 'status': {
          const statusOrder = { Pending: 1, InProgress: 2, Completed: 3, Cancelled: 4 };
          valueA = statusOrder[a.status] || 0;
          valueB = statusOrder[b.status] || 0;
          break;
        }
        case 'dueDate':
          valueA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          valueB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [tasks, sortConfig]);

  if (sortedTasks.length === 0) return null;

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
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== 'Completed' &&
                task.status !== 'Cancelled';

              const catStyle = categoryColors[task.category] || categoryColors.Other;
              const isAssigned = task.createdByUserId !== task.assignedToUserId && task.assignedToUserId;

              return (
                <tr
                  key={task.id}
                  className="transition-colors duration-150 hover:bg-slate-50/60 group cursor-pointer"
                  onClick={() => onView(task)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-6 w-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: catStyle.border }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="block truncate text-[13px] font-medium text-slate-900">
                            {task.title}
                          </span>
                          {isAssigned && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-semibold text-blue-700 shrink-0">
                              <TIcon name="user-check" size={9} />
                              Assigned
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <span className="block truncate text-[11px] text-slate-400">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${catStyle.badge}`}>
                      <TIcon name="folder" size={10} />
                      {task.category || '—'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      task={task}
                      onStatusChange={onStatusChange}
                      canChange={canChangeStatus(task)}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <TIcon 
                        name="calendar" 
                        size={12} 
                        className={isOverdue ? 'text-red-400' : 'text-slate-400'} 
                      />
                      <span
                        className={`text-[12px] ${
                          isOverdue ? 'font-medium text-red-500' : 'text-slate-500'
                        }`}
                      >
                        {formatDate(task.dueDate)}
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

      {/* Table footer with count */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
        <p className="text-[11px] text-slate-400">
          Showing {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          {sortConfig.field && (
            <span className="ml-1">
              sorted by <span className="font-medium text-slate-600 capitalize">{sortConfig.field}</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ─── InProgressTasksPage ────────────────────────────────────────────────── */
export default function InProgressTasksPage() {
  const { user, isAdmin } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({ field: '', direction: 'asc' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Fetch In Progress Tasks                                                */
  /* ─────────────────────────────────────────────────────────────────────── */

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await taskService.getInProgressTasks({});

      if (response.success) {
        setTasks(response.data || []);
      } else {
        setError(response.message || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ─────────────────────────────────────────────────────────────────────── */
  /* View Task                                                               */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleViewTask = (task) => {
    setViewingTask(task);
    setDrawerOpen(true);
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Change Status                                                           */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleStatusChange = async (taskId, newStatus) => {
    const response = await taskService.updateTaskStatus(taskId, newStatus);

    if (response.success) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } else {
      throw new Error(response.message || 'Failed to update status');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Delete Handlers                                                        */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      const response = await taskService.deleteTask(taskToDelete.id);
      if (response.success) {
        setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
        setDrawerOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Task Save Handler                                                      */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleTaskSaved = (savedTask) => {
    setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
    setDrawerOpen(false);
    setViewingTask(null);
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Sorting                                                                */
  /* ─────────────────────────────────────────────────────────────────────── */

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, direction: 'asc' };
    });
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  /* Status Permission                                                       */
  /* ─────────────────────────────────────────────────────────────────────── */

  const canChangeStatus = (task) =>
    isAdmin ||
    task.createdByUserId === user?.id ||
    task.assignedToUserId === user?.id;

  const isOwnTask = (task) => task.createdByUserId === user?.id;

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
        <p className="mt-4 animate-pulse text-[13px] text-slate-400">Loading tasks...</p>
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
          <TIcon name="alert-circle" size={28} className="text-red-500" />
        </div>
        <p className="mt-4 text-[15px] font-medium text-slate-700">Failed to load tasks</p>
        <p className="mt-1 text-[13px] text-slate-400">{error}</p>
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
  /* Main                                                                     */
  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Status Badges */}
      {tasks.length > 0 && <StatusBadgesRow tasks={tasks} />}

      {/* Table */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-100">
            <TIcon name="inbox" size={32} className="text-slate-400" />
          </div>
          <p className="mt-4 text-[16px] font-medium text-slate-700">Nothing in progress</p>
          <p className="mt-1 text-[13px] text-slate-400">No tasks are currently being worked on</p>
        </div>
      ) : (
        <TableView
          tasks={tasks}
          onView={handleViewTask}
          onStatusChange={handleStatusChange}
          canChangeStatus={canChangeStatus}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}

      {/* View/Edit Drawer */}
      <ViewEditDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setViewingTask(null);
        }}
        task={viewingTask}
        onStatusChange={handleStatusChange}
        canChangeStatus={viewingTask ? canChangeStatus(viewingTask) : false}
        isOwnTask={viewingTask ? isOwnTask(viewingTask) : false}
        onDelete={handleDeleteClick}
        onSave={handleTaskSaved}
      />

      {/* Delete Confirm Dialog */}
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