import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

/* ─── Icon ───────────────────────────────────────────────────────────────── */
function TIcon({ name, size = 18, className = '' }) {
  return <i className={`ti ti-${name} ${className}`} style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true" />;
}

/* ─── Avatar — initials with deterministic color ─────────────────────────── */
const avatarPalette = [
  ['bg-indigo-100','text-indigo-700'], ['bg-emerald-100','text-emerald-700'],
  ['bg-amber-100','text-amber-700'],   ['bg-rose-100','text-rose-700'],
  ['bg-violet-100','text-violet-700'], ['bg-cyan-100','text-cyan-700'],
  ['bg-orange-100','text-orange-700'], ['bg-teal-100','text-teal-700'],
  ['bg-pink-100','text-pink-700'],     ['bg-blue-100','text-blue-700'],
];
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
function avatarColor(name) {
  if (!name) return avatarPalette[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarPalette[Math.abs(h) % avatarPalette.length];
}
function Avatar({ name, size = 'md' }) {
  const [bg, text] = avatarColor(name);
  const sz = { lg: 'h-10 w-10 text-[13px]', md: 'h-8 w-8 text-[11px]', sm: 'h-6 w-6 text-[9px]' }[size] || 'h-8 w-8 text-[11px]';
  return (
    <div className={`grid shrink-0 place-items-center rounded-full font-bold ${sz} ${bg} ${text}`}>
      {getInitials(name)}
    </div>
  );
}

/* ─── Category colors ────────────────────────────────────────────────────── */
const categoryColors = {
  Development:    { badge: 'bg-indigo-100 text-indigo-700',   border: '#6366f1' },
  Reporting:      { badge: 'bg-blue-100 text-blue-700',       border: '#3b82f6' },
  Data:           { badge: 'bg-cyan-100 text-cyan-700',       border: '#06b6d4' },
  Content:        { badge: 'bg-purple-100 text-purple-700',   border: '#a855f7' },
  Documentation:  { badge: 'bg-amber-100 text-amber-700',     border: '#f59e0b' },
  Business:       { badge: 'bg-orange-100 text-orange-700',   border: '#f97316' },
  Testing:        { badge: 'bg-green-100 text-green-700',     border: '#22c55e' },
  Administration: { badge: 'bg-rose-100 text-rose-700',       border: '#f43f5e' },
  HR:             { badge: 'bg-pink-100 text-pink-700',       border: '#ec4899' },
  Security:       { badge: 'bg-red-100 text-red-700',         border: '#ef4444' },
  Infrastructure: { badge: 'bg-slate-100 text-slate-700',     border: '#64748b' },
  Finance:        { badge: 'bg-emerald-100 text-emerald-700', border: '#10b981' },
  Planning:       { badge: 'bg-violet-100 text-violet-700',   border: '#7c3aed' },
  Support:        { badge: 'bg-teal-100 text-teal-700',       border: '#14b8a6' },
  Work:           { badge: 'bg-indigo-100 text-indigo-700',   border: '#6366f1' },
  Personal:       { badge: 'bg-emerald-100 text-emerald-700', border: '#10b981' },
  Study:          { badge: 'bg-purple-100 text-purple-700',   border: '#a855f7' },
  Career:         { badge: 'bg-blue-100 text-blue-700',       border: '#3b82f6' },
  Maintenance:    { badge: 'bg-yellow-100 text-yellow-700',   border: '#eab308' },
  Household:      { badge: 'bg-orange-100 text-orange-700',   border: '#f97316' },
};
const defaultCat = { badge: 'bg-slate-100 text-slate-600', border: '#94a3b8' };

/* ─── Priority ───────────────────────────────────────────────────────────── */
const priorityConfig = {
  Low:    { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: 'arrow-down' },
  Medium: { bg: 'bg-amber-50',  text: 'text-amber-700',  icon: 'minus'      },
  High:   { bg: 'bg-red-50',    text: 'text-red-700',    icon: 'arrow-up'   },
  Urgent: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'urgent'     },
};

// Map priority enum values (1-4) to labels
const priorityEnumMap = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent'
};

const priorityOptions = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
  { value: 4, label: 'Urgent' },
];

function PriorityBadge({ priority }) {
  const priorityLabel = typeof priority === 'number' ? priorityEnumMap[priority] || 'Medium' : priority;
  const s = priorityConfig[priorityLabel] || priorityConfig.Medium;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}>
      <TIcon name={s.icon} size={11} />{priorityLabel}
    </span>
  );
}

/* ─── Status ─────────────────────────────────────────────────────────────── */
const statusConfig = {
  Pending:    { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'clock-pause'  },
  InProgress: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: 'progress'     },
  Completed:  { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'circle-check' },
  Cancelled:  { bg: 'bg-slate-100',  text: 'text-slate-600',   icon: 'circle-x'     },
};

// Map status enum values (1-4) to labels
const statusEnumMap = {
  1: 'Pending',
  2: 'InProgress',
  3: 'Completed',
  4: 'Cancelled'
};

const statusOptions = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'In Progress' },
  { value: 3, label: 'Completed' },
  { value: 4, label: 'Cancelled' },
];

function StatusBadge({ status }) {
  const statusLabel = typeof status === 'number' ? statusEnumMap[status] || 'Pending' : status;
  const displayLabel = statusLabel === 'InProgress' ? 'In Progress' : statusLabel;
  const s = statusConfig[statusLabel] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text}`}>
      <TIcon name={s.icon} size={11} />{displayLabel}
    </span>
  );
}

/* ─── Stat pills (top row) ───────────────────────────────────────────────── */
const pillDef = [
  { key: 'pending',    label: 'Pending',     icon: 'clock-pause',   bg: 'bg-amber-500'   },
  { key: 'inProgress', label: 'In Progress', icon: 'progress',      bg: 'bg-indigo-600'  },
  { key: 'completed',  label: 'Completed',   icon: 'circle-check',  bg: 'bg-emerald-600' },
  { key: 'cancelled',  label: 'Cancelled',   icon: 'circle-x',      bg: 'bg-slate-600'   },
  { key: 'overdue',    label: 'Overdue',     icon: 'alert-triangle', bg: 'bg-red-600'    },
];

/* ─── Filter options ─────────────────────────────────────────────────────── */
const filterOptions = [
  { value: 'all',        label: 'All',           icon: 'list'          },
  { value: 'Pending',    label: 'Pending',        icon: 'clock-pause'   },
  { value: 'InProgress', label: 'In Progress',    icon: 'progress'      },
  { value: 'Completed',  label: 'Completed',      icon: 'circle-check'  },
  { value: 'Cancelled',  label: 'Cancelled',      icon: 'circle-x'      },
  { value: 'overdue',    label: 'Overdue',        icon: 'alert-triangle'},
  { value: 'High',       label: 'High Priority',  icon: 'arrow-up'      },
];

/* ─── Sortable header ────────────────────────────────────────────────────── */
function SortableHeader({ label, field, icon, sort, onSort }) {
  const active = sort.field === field;
  return (
    <th className="px-4 py-3">
      <button
        onClick={() => onSort(field)}
        className={`group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {icon && <TIcon name={icon} size={13} className={active ? 'text-indigo-500' : 'text-slate-400'} />}
        {label}
        <span className="ml-0.5 flex flex-col">
          <TIcon name="chevron-up"   size={9} className={active && sort.direction === 'asc'  ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'} />
          <TIcon name="chevron-down" size={9} className={active && sort.direction === 'desc' ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'} />
        </span>
      </button>
    </th>
  );
}

/* ─── User Search Dropdown ──────────────────────────────────────────────── */
function UserSearchDropdown({ users, selectedUser, onSelect, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u =>
      (u.fullName || u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  return (
    <div className="relative">
      {/* Selected user display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {selectedUser ? (
          <div className="flex items-center gap-2">
            <Avatar name={selectedUser.fullName || selectedUser.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-slate-800">{selectedUser.fullName || selectedUser.name}</p>
              <p className="truncate text-[10px] text-slate-400">{selectedUser.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[13px] text-slate-400">
            <TIcon name="user" size={15} />
            <span>Select user to assign</span>
          </div>
        )}
        <TIcon name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} className="shrink-0 text-slate-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Search input */}
          <div className="border-b border-slate-100 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <TIcon name="search" size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* User list */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-slate-400">
                <TIcon name="user-off" size={20} />
                <span className="text-[12px]">No users found</span>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onSelect(user);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                    selectedUser?.id === user.id ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <Avatar name={user.fullName || user.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-slate-800">{user.fullName || user.name}</p>
                    <p className="truncate text-[10px] text-slate-400">{user.email}</p>
                  </div>
                  {selectedUser?.id === user.id && (
                    <TIcon name="check" size={14} className="text-indigo-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inline Status Dropdown ────────────────────────────────────────────── */
function InlineStatusDropdown({ task, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const currentStatus = typeof task.status === 'number' ? statusEnumMap[task.status] : task.status;
  const displayLabel = currentStatus === 'InProgress' ? 'In Progress' : currentStatus;

  const handleStatusChange = async (statusValue) => {
    setUpdating(true);
    try {
      await api.patch(`/admin/tasks/${task.id}/status`, { status: statusValue });
      onStatusChange();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all hover:opacity-80 disabled:opacity-50"
      >
        <StatusBadge status={task.status} />
        <TIcon name="chevron-down" size={10} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Change Status
          </div>
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStatusChange(opt.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-slate-50 ${
                currentStatus === opt.label ? 'bg-indigo-50/50' : ''
              }`}
            >
              <StatusBadge status={opt.label} />
              {currentStatus === opt.label && (
                <TIcon name="check" size={12} className="text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Inline Priority Dropdown ──────────────────────────────────────────── */
function InlinePriorityDropdown({ task, onPriorityChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const currentPriority = typeof task.priority === 'number' ? priorityEnumMap[task.priority] : task.priority;

  const handlePriorityChange = async (priorityValue) => {
    setUpdating(true);
    try {
      await api.patch(`/admin/tasks/${task.id}/priority`, { priority: priorityValue });
      onPriorityChange();
    } catch (err) {
      console.error('Failed to update priority:', err);
    } finally {
      setUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all hover:opacity-80 disabled:opacity-50"
      >
        <PriorityBadge priority={task.priority} />
        <TIcon name="chevron-down" size={10} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Change Priority
          </div>
          {priorityOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handlePriorityChange(opt.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-slate-50 ${
                currentPriority === opt.label ? 'bg-indigo-50/50' : ''
              }`}
            >
              <PriorityBadge priority={opt.label} />
              {currentPriority === opt.label && (
                <TIcon name="check" size={12} className="text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Combined Drawer (View + Edit) ────────────────────────────────────── */
function TaskDrawer({ task, open, mode, onClose, onSuccess, onDelete, fetchStatistics }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode || 'view');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 2,
    status: 1,
    dueDate: '',
    assignedToUserId: null,
    assignedToName: ''
  });

  const isEdit = currentMode === 'edit';

  // Load users for dropdown - UPDATED to handle the API response correctly
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/admin/tasks/users', { params: { pageSize: 100 } });
      // Handle different response structures
      let userData = res.data.data;
      
      // If data is an object with items property, use items
      if (userData && typeof userData === 'object' && userData.items) {
        userData = userData.items;
      }
      
      // If data is an array, use it directly
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else {
        // Fallback: try to use data as is or empty array
        setUsers(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      const priorityMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Urgent': 4 };
      const statusMap = { 'Pending': 1, 'InProgress': 2, 'Completed': 3, 'Cancelled': 4 };
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        priority: typeof task.priority === 'number' ? task.priority : (priorityMap[task.priority] || 2),
        status: typeof task.status === 'number' ? task.status : (statusMap[task.status] || 1),
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        assignedToUserId: task.assignedToUserId || null,
        assignedToName: task.assignedToName || ''
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 2,
        status: 1,
        dueDate: '',
        assignedToUserId: null,
        assignedToName: ''
      });
    }
  }, [task]);

  // Show/hide animation with proper open/close control
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      if (currentMode === 'edit') {
        loadUsers();
      }
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      // Unlock body scroll
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, currentMode, loadUsers]);

  // Update mode when prop changes
  useEffect(() => {
    if (mode) {
      setCurrentMode(mode);
    }
  }, [mode]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      assignedToUserId: user.id,
      assignedToName: user.fullName || user.name || ''
    }));
  };

  // Quick date presets
  const setQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData(prev => ({ ...prev, dueDate: date.toISOString().substring(0, 10) }));
  };

  // Submit form - UPDATED to use correct endpoints
  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!formData.category) {
      setError('Category is required.');
      return;
    }
    if (!formData.assignedToUserId) {
      setError('Please assign a user to the task.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        assignedToUserId: formData.assignedToUserId
      };

      if (task) {
        // Update existing task - use PUT for full update
        await api.put(`/admin/tasks/${task.id}`, payload);
        
        // Also update status if changed
        if (formData.status !== (typeof task.status === 'number' ? task.status : statusEnumMap[task.status])) {
          await api.patch(`/admin/tasks/${task.id}/status`, { status: formData.status });
        }
      } else {
        // Create new task - use POST
        await api.post('/admin/tasks', payload);
      }

      onSuccess();
      fetchStatistics();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/tasks/${task.id}`);
      onDelete();
      onClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Switch to edit mode
  const switchToEditMode = () => {
    setCurrentMode('edit');
    loadUsers();
  };

  // Cancel edit
  const cancelEdit = () => {
    setCurrentMode('view');
    // Reset form data to original task data
    if (task) {
      const priorityMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Urgent': 4 };
      const statusMap = { 'Pending': 1, 'InProgress': 2, 'Completed': 3, 'Cancelled': 4 };
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        priority: typeof task.priority === 'number' ? task.priority : (priorityMap[task.priority] || 2),
        status: typeof task.status === 'number' ? task.status : (statusMap[task.status] || 1),
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        assignedToUserId: task.assignedToUserId || null,
        assignedToName: task.assignedToName || ''
      });
    }
  };

  if (!task && currentMode === 'view') return null;

  const cat = task ? categoryColors[task.category] || defaultCat : defaultCat;
  const prio = task ? priorityConfig[typeof task.priority === 'number' ? priorityEnumMap[task.priority] : task.priority] || priorityConfig.Medium : priorityConfig.Medium;
  const stat = task ? statusConfig[typeof task.status === 'number' ? statusEnumMap[task.status] : task.status] || statusConfig.Pending : statusConfig.Pending;

  const priorityLabel = task && typeof task.priority === 'number' ? priorityEnumMap[task.priority] : task?.priority;
  const statusLabel = task && typeof task.status === 'number' ? statusEnumMap[task.status] : task?.status;

  const fmtLong = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isOverdue = task && task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'Completed' &&
    task.status !== 'Cancelled';

  const dueDateInfo = (() => {
    if (!task?.dueDate) return null;
    if (isOverdue) {
      const d = Math.ceil((today - new Date(task.dueDate)) / 86400000);
      return { msg: `${d} day${d > 1 ? 's' : ''} overdue`, icon: 'alert-triangle', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0);
    const d = Math.ceil((due - today) / 86400000);
    if (d === 0) return { msg: 'Due today',            icon: 'clock',          color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200'  };
    if (d <= 3)  return { msg: `${d} days remaining`,  icon: 'calendar-clock', color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   };
    if (d <= 7)  return { msg: `${d} days remaining`,  icon: 'calendar-clock', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    return             { msg: `${d} days remaining`,  icon: 'calendar',       color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-200'  };
  })();

  const catOptions = Object.keys(categoryColors);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] transition-opacity duration-300"
          style={{ backgroundColor: visible ? 'rgba(2,6,23,0.45)' : 'transparent', pointerEvents: visible ? 'auto' : 'none' }}
          onClick={currentMode === 'view' ? onClose : cancelEdit}
        />
      )}

      {/* Drawer */}
      {open && (
        <div className={`fixed inset-y-0 right-0 z-[9999] flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          
          {/* Header */}
          <div style={currentMode === 'view' ? { borderTop: `3px solid ${cat.border}` } : {}} className="shrink-0">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div className="min-w-0">
                {currentMode === 'view' ? (
                  <>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Task Details</p>
                    <h2 className="text-[15px] font-semibold leading-snug text-slate-900">{task?.title}</h2>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50">
                        <TIcon name={task ? 'edit' : 'plus'} size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-[15px] font-semibold text-slate-900">{task ? 'Edit Task' : 'New Task'}</h2>
                        <p className="text-[11px] text-slate-400">{task ? 'Update task details' : 'Create and assign a new task'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={currentMode === 'view' ? onClose : cancelEdit}
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <TIcon name="x" size={18} />
              </button>
            </div>
          </div>

          {/* Body with custom scroll */}
          <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
            
            {currentMode === 'view' ? (
              /* ─── VIEW MODE ─── */
              <div className="space-y-5">
                {/* Description */}
                {task?.description && (
                  <div className="border-b border-slate-100 pb-4">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Description</p>
                    <p className="text-[13px] leading-relaxed text-slate-500">{task.description}</p>
                  </div>
                )}

                {/* Details grid */}
                <div className="border-b border-slate-100 pb-4">
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Details</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-[10px] font-medium text-slate-400">Category</span>
                      <span className={`inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-[11px] font-semibold ${cat.badge}`}>
                        <TIcon name="folder" size={11} />{task?.category || '—'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-[10px] font-medium text-slate-400">Priority</span>
                      <span className={`inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-[11px] font-semibold ${prio.bg} ${prio.text}`}>
                        <TIcon name={prio.icon} size={11} />{priorityLabel}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-[10px] font-medium text-slate-400">Status</span>
                      <span className={`inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-[11px] font-semibold ${stat.bg} ${stat.text}`}>
                        <TIcon name={stat.icon} size={11} />{statusLabel === 'InProgress' ? 'In Progress' : statusLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="border-b border-slate-100 pb-4">
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Assigned To</p>
                  {task?.assignedToName ? (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                      <Avatar name={task.assignedToName} size="lg" />
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{task.assignedToName}</p>
                        <p className="text-[11px] text-slate-400">Assignee</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-slate-400">Unassigned</p>
                  )}
                </div>

                {/* Created By */}
                {task?.createdByName && (
                  <div className="border-b border-slate-100 pb-4">
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Created By</p>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                      <Avatar name={task.createdByName} size="lg" />
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{task.createdByName}</p>
                        <p className="text-[11px] text-slate-400">Creator</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="border-b border-slate-100 pb-4">
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Due Date</p>
                  <div className="flex flex-wrap gap-2">
                    <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                      <TIcon name="calendar" size={14} className={isOverdue ? 'text-red-500' : 'text-slate-400'} />
                      <span className={`text-[13px] font-medium ${isOverdue ? 'text-red-700' : 'text-slate-700'}`}>{fmtLong(task?.dueDate)}</span>
                      {isOverdue && <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">Overdue</span>}
                    </div>
                    {dueDateInfo && task?.status !== 'Completed' && task?.status !== 'Cancelled' && (
                      <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 ${dueDateInfo.bg} ${dueDateInfo.border}`}>
                        <TIcon name={dueDateInfo.icon} size={14} className={dueDateInfo.color} />
                        <span className={`text-[12px] font-medium ${dueDateInfo.color}`}>{dueDateInfo.msg}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                {(task?.createdAt || task?.updatedAt) && (
                  <div>
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Timeline</p>
                    <div className="space-y-1.5">
                      {task?.createdAt && (
                        <div className="flex items-center gap-2 text-[12px]">
                          <TIcon name="clock" size={13} className="text-slate-400" />
                          <span className="text-slate-400">Created:</span>
                          <span className="font-medium text-slate-600">{fmtLong(task.createdAt)}</span>
                        </div>
                      )}
                      {task?.updatedAt && (
                        <div className="flex items-center gap-2 text-[12px]">
                          <TIcon name="refresh" size={13} className="text-slate-400" />
                          <span className="text-slate-400">Updated:</span>
                          <span className="font-medium text-slate-600">{fmtLong(task.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ─── EDIT MODE ─── */
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Add details (optional)"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select...</option>
                    {catOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Priority
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {priorityOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange('priority', opt.value)}
                        className={`flex items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-[11px] font-medium transition-all ${
                          formData.priority === opt.value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <TIcon name={priorityConfig[opt.label]?.icon || 'flag'} size={11} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status - Only for Edit mode with existing task */}
                {task && (
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                      Status
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleChange('status', opt.value)}
                          className={`flex items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-[11px] font-medium transition-all ${
                            formData.status === opt.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <TIcon name={statusConfig[opt.label]?.icon || 'circle'} size={11} />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assign User */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <UserSearchDropdown
                    users={users}
                    selectedUser={formData.assignedToUserId ? {
                      id: formData.assignedToUserId,
                      fullName: formData.assignedToName
                    } : null}
                    onSelect={handleUserSelect}
                    loading={usersLoading}
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Search and select the user to assign this task to
                  </p>
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(3)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      In 3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(7)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      In 7 Days
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                    <TIcon name="alert-circle" size={15} className="shrink-0 text-red-500" />
                    <p className="text-[12px] text-red-600">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-slate-100 px-5 py-4">
            {currentMode === 'view' ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={switchToEditMode}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  <TIcon name="edit" size={16} /> Edit Task
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
                >
                  <TIcon name="trash" size={16} /> Delete Task
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <TIcon name={task ? 'check' : 'plus'} size={16} />
                      <span>{task ? 'Update Task' : 'Create Task'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-100">
                <TIcon name="alert-triangle" size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-slate-900">Delete Task</h3>
                <p className="mt-1 text-[13px] text-slate-500">
                  Are you sure you want to delete "{task?.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function AdminTasksPage() {
  const [tasks,        setTasks]        = useState([]);
  const [statistics,   setStatistics]   = useState(null);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [totalPages,   setTotalPages]   = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [sort,         setSort]         = useState({ field: '', direction: 'asc' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerMode,   setDrawerMode]   = useState('view');
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');

  const tasksPerPage = 20;

  /* ── Fetch tasks ── */
  const fetchTasks = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/tasks', { params: { page, pageSize: tasksPerPage } });
      const { items, totalCount, totalPages } = res.data.data;
      setTasks(items);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Fetch statistics ── */
  const fetchStatistics = useCallback(async () => {
    try {
      const res = await api.get('/admin/tasks/statistics');
      setStatistics(res.data.data);
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => { fetchTasks(currentPage); }, [currentPage, fetchTasks]);
  useEffect(() => { fetchStatistics(); },      [fetchStatistics]);

  /* ── Filter + sort pipeline (client-side on the current page) ── */
  const now = useMemo(() => new Date(), []);

  const filteredAndSorted = useMemo(() => {
    let list = [...tasks];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(term) ||
        (t.description || '').toLowerCase().includes(term) ||
        (t.category || '').toLowerCase().includes(term) ||
        (t.assignedToName || '').toLowerCase().includes(term) ||
        (t.createdByName || '').toLowerCase().includes(term)
      );
    }

    // Filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'overdue') {
        list = list.filter(t =>
          t.dueDate && new Date(t.dueDate) < now &&
          t.status !== 'Completed' && t.status !== 'Cancelled'
        );
      } else if (activeFilter === 'High') {
        list = list.filter(t => {
          const priorityLabel = typeof t.priority === 'number' ? priorityEnumMap[t.priority] : t.priority;
          return priorityLabel === 'High' || priorityLabel === 'Urgent';
        });
      } else {
        const filterStatusLabel = activeFilter === 'InProgress' ? 'InProgress' : activeFilter;
        list = list.filter(t => {
          const statusLabel = typeof t.status === 'number' ? statusEnumMap[t.status] : t.status;
          return statusLabel === filterStatusLabel;
        });
      }
    }

    // Sort
    if (sort.field) {
      list.sort((a, b) => {
        let va, vb;
        switch (sort.field) {
          case 'title':      va = (a.title || '').toLowerCase();          vb = (b.title || '').toLowerCase();          break;
          case 'createdBy':  va = (a.createdByName || '').toLowerCase();  vb = (b.createdByName || '').toLowerCase();  break;
          case 'assignedTo': va = (a.assignedToName || '').toLowerCase(); vb = (b.assignedToName || '').toLowerCase(); break;
          case 'category':   va = (a.category || '').toLowerCase();       vb = (b.category || '').toLowerCase();       break;
          case 'priority':  va = typeof a.priority === 'number' ? a.priority : 0; vb = typeof b.priority === 'number' ? b.priority : 0; break;
          case 'status':    { const o = { 'Pending':1, 'InProgress':2, 'Completed':3, 'Cancelled':4 }; va = o[statusEnumMap[a.status]]||0; vb = o[statusEnumMap[b.status]]||0; break; }
          case 'dueDate':    va = a.dueDate ? new Date(a.dueDate).getTime() : Infinity; vb = b.dueDate ? new Date(b.dueDate).getTime() : Infinity; break;
          default: return 0;
        }
        if (va < vb) return sort.direction === 'asc' ? -1 : 1;
        if (va > vb) return sort.direction === 'asc' ?  1 : -1;
        return 0;
      });
    }
    return list;
  }, [tasks, activeFilter, sort, now, searchTerm]);

  const handleSort = (field) =>
    setSort(prev =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );

  /* ── Pagination ── */
  const startItem   = totalCount === 0 ? 0 : (currentPage - 1) * tasksPerPage + 1;
  const endItem     = Math.min(currentPage * tasksPerPage, totalCount);
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const fmtShort = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const activeFilterLabel = filterOptions.find(f => f.value === activeFilter)?.label || 'All';

  // Handle task created/updated
  const handleTaskSuccess = () => {
    fetchTasks(currentPage);
  };

  // Handle delete from view drawer
  const handleDeleteFromView = () => {
    fetchTasks(currentPage);
    fetchStatistics();
  };

  // Open drawer for viewing/editing
  const openDrawer = (task, mode = 'view') => {
    setSelectedTask(task);
    setDrawerMode(mode);
    setDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedTask(null);
      setDrawerMode('view');
    }, 300);
  };

  // Handle create new task
  const handleCreateTask = () => {
    setSelectedTask(null);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  // Handle inline status change
  const handleStatusChange = () => {
    fetchTasks(currentPage);
    fetchStatistics();
  };

  // Handle inline priority change
  const handlePriorityChange = () => {
    fetchTasks(currentPage);
  };

  return (
    <div className="space-y-4">

      {/* ── Stat pills ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {pillDef.map(({ key, label, icon, bg }) => (
          <div
            key={key}
            className={`inline-flex cursor-default items-center gap-1.5 rounded-lg px-3 py-1.5 text-white shadow-sm ${bg}`}
          >
            <TIcon name={icon} size={14} />
            <span className="text-[12px] font-semibold">{label}</span>
            <span className="ml-0.5 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
              {statistics ? (statistics[key] ?? 0) : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {filterOptions.map(({ value, label, icon }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              onClick={() => { setActiveFilter(value); setCurrentPage(1); }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <TIcon name={icon} size={13} />{label}
            </button>
          );
        })}
        {activeFilter !== 'all' && (
          <button
            onClick={() => setActiveFilter('all')}
            className="ml-1 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            <TIcon name="x" size={12} /> Clear
          </button>
        )}
      </div>

      {/* ── Table card ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Card header - no title, just search and button */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="relative flex-1 max-w-sm">
            <TIcon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="button"
            onClick={handleCreateTask}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <TIcon name="plus" size={16} /> Create task
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-600" />
              </div>
            </div>
            <p className="mt-4 animate-pulse text-[13px] text-slate-400">Loading tasks…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-red-50">
              <TIcon name="alert-circle" size={26} className="text-red-500" />
            </div>
            <p className="text-[14px] font-medium text-slate-700">{error}</p>
            <button
              onClick={() => fetchTasks(currentPage)}
              className="mt-1 rounded-xl border border-slate-200 px-4 py-2 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
            <TIcon name="clipboard-off" size={32} />
            <p className="text-sm font-medium">No tasks found{searchTerm ? ' matching your search' : ''}{activeFilter !== 'all' ? ' for this filter' : ''}.</p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-1 text-xs text-indigo-600 underline hover:text-indigo-800"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredAndSorted.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <SortableHeader label="Title"       field="title"      icon="text-size" sort={sort} onSort={handleSort} />
                  <SortableHeader label="Created By"   field="createdBy"  icon="user-plus" sort={sort} onSort={handleSort} />
                  <SortableHeader label="Assigned To"  field="assignedTo" icon="user"      sort={sort} onSort={handleSort} />
                  <SortableHeader label="Category"    field="category"   icon="folder"    sort={sort} onSort={handleSort} />
                  <SortableHeader label="Priority"    field="priority"   icon="flag"      sort={sort} onSort={handleSort} />
                  <SortableHeader label="Status"      field="status"     icon="checklist" sort={sort} onSort={handleSort} />
                  <SortableHeader label="Due Date"    field="dueDate"    icon="calendar"  sort={sort} onSort={handleSort} />
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSorted.map((task) => {
                  const cat = categoryColors[task.category] || defaultCat;
                  const isOverdue =
                    task.dueDate && new Date(task.dueDate) < now &&
                    task.status !== 'Completed' && task.status !== 'Cancelled';
                  
                  // Check if created by and assigned to are the same
                  const isSamePerson = task.createdByName && task.assignedToName && 
                    task.createdByName.toLowerCase() === task.assignedToName.toLowerCase();

                  return (
                    <tr
                      key={task.id}
                      onClick={() => openDrawer(task, 'view')}
                      className="group cursor-pointer transition-colors hover:bg-slate-50/70"
                    >
                      {/* Title */}
                      <td className="min-w-[200px] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-0.5 shrink-0 rounded-full" style={{ backgroundColor: cat.border }} />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-slate-900">{task.title}</p>
                            {task.description && (
                              <p className="max-w-[240px] truncate text-[11px] text-slate-400">{task.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Created By — avatar + name (always shown) */}
                      <td className="px-4 py-3">
                        {task.createdByName ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={task.createdByName} size="sm" />
                            <span className="whitespace-nowrap text-[12px] font-medium text-slate-700">
                              {task.createdByName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-slate-400">—</span>
                        )}
                      </td>

                      {/* Assigned To — avatar + name (show hyphen if same as created by) */}
                      <td className="px-4 py-3">
                        {task.assignedToName && !isSamePerson ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={task.assignedToName} size="sm" />
                            <span className="whitespace-nowrap text-[12px] font-medium text-slate-700">
                              {task.assignedToName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-slate-400">—</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${cat.badge}`}>
                          <TIcon name="folder" size={10} />{task.category || '—'}
                        </span>
                      </td>

                      {/* Priority - Inline dropdown */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <InlinePriorityDropdown 
                          task={task} 
                          onPriorityChange={handlePriorityChange} 
                        />
                      </td>

                      {/* Status - Inline dropdown */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <InlineStatusDropdown 
                          task={task} 
                          onStatusChange={handleStatusChange} 
                        />
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <TIcon name="calendar" size={12} className={isOverdue ? 'text-red-400' : 'text-slate-400'} />
                          <span className={`text-[12px] ${isOverdue ? 'font-medium text-red-500' : 'text-slate-500'}`}>
                            {fmtShort(task.dueDate)}
                          </span>
                          {isOverdue && (
                            <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-600">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Chevron */}
                      <td className="px-3 py-3">
                        <div className="grid h-7 w-7 place-items-center rounded-lg text-slate-300 transition-colors group-hover:bg-slate-100 group-hover:text-slate-600">
                          <TIcon name="chevron-right" size={15} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination — only shown when no filter is active */}
        {!loading && !error && totalPages > 0 && activeFilter === 'all' && !searchTerm && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">
              Showing <span className="font-semibold text-slate-700">{startItem}</span>
              {' '}–{' '}
              <span className="font-semibold text-slate-700">{endItem}</span>
              {' '}of{' '}
              <span className="font-semibold text-slate-700">{totalCount}</span> tasks
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <TIcon name="chevron-left" size={15} />
              </button>
              {pageNumbers.map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-[11px] font-semibold transition-colors ${
                    currentPage === page ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <TIcon name="chevron-right" size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Filtered count footer */}
        {!loading && !error && filteredAndSorted.length > 0 && (activeFilter !== 'all' || searchTerm) && (
          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-[11px] text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filteredAndSorted.length}</span> task{filteredAndSorted.length !== 1 ? 's' : ''}
              {searchTerm ? ' matching your search' : ''}
              {activeFilter !== 'all' ? ' for this filter' : ''}
            </p>
          </div>
        )}
      </div>

      {/* ── Combined Drawer ─────────────────────────────────────────────── */}
      <TaskDrawer
        task={selectedTask}
        open={drawerOpen}
        mode={drawerMode}
        onClose={closeDrawer}
        onSuccess={handleTaskSuccess}
        onDelete={handleDeleteFromView}
        fetchStatistics={fetchStatistics}
      />
    </div>
  );
}