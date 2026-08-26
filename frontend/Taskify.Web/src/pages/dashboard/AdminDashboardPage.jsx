import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';

function TIcon({ name, size = 18, className = '' }) {
  return (
    <i
      className={`ti ti-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
}

function getDateKey(date) {
  if (!date) return null;
  if (typeof date === 'string') {
    const part = date.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
  }
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return null;
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isTaskOverdue(task) {
  if (!task?.dueDate) return false;
  if (task.status === 'Completed' || task.status === 'Cancelled') return false;
  const due = getDateKey(task.dueDate);
  return due ? due < getTodayKey() : false;
}

function getPriorityName(priority) {
  if (typeof priority === 'number') {
    return ({ 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' }[priority] || 'Medium');
  }
  return priority || 'Medium';
}

function getStatusBadgeColor(status) {
  return ({
    Pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    InProgress: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    Completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Cancelled: 'bg-slate-100 text-slate-500 border border-slate-200',
  }[status] || 'bg-slate-100 text-slate-500 border border-slate-200');
}

function getPriorityBadgeColor(priority) {
  return ({
    Low: 'bg-blue-50 text-blue-600 border border-blue-200',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-200',
    High: 'bg-orange-50 text-orange-600 border border-orange-200',
    Urgent: 'bg-red-50 text-red-600 border border-red-200',
  }[priority] || 'bg-amber-50 text-amber-600 border border-amber-200');
}

function getStatusDot(status) {
  return ({
    Pending: 'bg-amber-400',
    InProgress: 'bg-indigo-500',
    Completed: 'bg-emerald-500',
    Cancelled: 'bg-slate-400',
  }[status] || 'bg-slate-400');
}

function getCategoryIcon(category) {
  return ({
    Work: 'briefcase',
    Frontend: 'code',
    Backend: 'server',
    DevOps: 'settings',
    Travel: 'plane',
    Personal: 'user',
    Design: 'palette',
    Finance: 'currency-dollar',
  }[category] || 'tag');
}

/* -------------------------------------------------------------------------- */
/* Calendar                                                                   */
/* -------------------------------------------------------------------------- */

function CalendarCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const monthShort = now.toLocaleDateString('en-US', { month: 'short' });

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const calCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) calCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calCells.push(i);

  return (
    <div className="calendar-card relative overflow-hidden rounded-[18px] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 text-white shadow-[0_14px_32px_rgba(79,70,229,0.22)]">
      <div className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
            <TIcon name="calendar" size={16} />
          </span>
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/65">Today</p>
            <p className="text-[12.5px] font-bold text-white">{weekday}</p>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-[72px] font-black leading-[0.8] tracking-[-0.07em]">{day}</span>
          <div className="pb-0.5">
            <p className="text-[13.5px] font-extrabold uppercase tracking-[0.12em]">{month}</p>
            <p className="mt-1 text-[11.5px] font-semibold text-white/60">{year}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="mb-2 text-center text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-white/50">
            {monthShort} {year}
          </p>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="grid h-6 w-6 place-items-center text-[8.5px] font-bold text-white/40">{d}</span>
            ))}
            {calCells.map((d, i) => (
              <span
                key={i}
                className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-semibold ${
                  d === now.getDate()
                    ? 'bg-white text-indigo-700 font-extrabold text-[13px]'
                    : d
                    ? 'text-white/70 hover:bg-white/10'
                    : ''
                }`}
              >
                {d || ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* KPI Cards                                                                  */
/* -------------------------------------------------------------------------- */

function KpiCard({ title, value, subtitle, icon, iconBg, iconColor, accent, cardBg = 'from-white to-slate-50' }) {
  return (
    <div className={`kpi-card group relative flex h-full overflow-hidden rounded-[14px] border border-slate-200/80 bg-gradient-to-br ${cardBg} px-3.5 py-3 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]`}>
      <div className={`absolute inset-y-0 left-0 w-[3px] ${accent}`} />
      <div className="flex h-full w-full flex-col justify-between gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{title}</p>
          <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-[10px] ${iconBg} ${iconColor} transition-all duration-200 group-hover:scale-110`}>
            <TIcon name={icon} size={12} />
          </div>
        </div>
        <div>
          <span className="text-[38px] font-black leading-none tracking-[-0.05em] text-slate-900 count-value">{value}</span>
          <p className="mt-0.5 text-[8.5px] font-medium text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function CompletionKpiCard({ counts }) {
  const rate = counts.all ? Math.round((counts.completed / counts.all) * 100) : 0;
  const circumference = 2 * Math.PI * 20;
  const dash = (rate / 100) * circumference;

  return (
    <div className="kpi-card group relative flex h-full overflow-hidden rounded-[14px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-3.5 py-3 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-violet-500 to-indigo-500" />
      <div className="flex h-full w-full flex-col justify-between gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-violet-500">Completion</p>
          <div className="relative h-6 w-6 shrink-0 transition-all duration-200 group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#ede9fe" strokeWidth="6" />
              <circle
                cx="24" cy="24" r="20" fill="none"
                stroke="url(#ringGrad)" strokeWidth="6"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div>
          <span className="text-[38px] font-black leading-none tracking-[-0.05em] text-violet-700 count-value">{rate}%</span>
          <p className="mt-0.5 text-[8.5px] font-medium text-violet-400">{counts.completed}/{counts.all} done</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Top Header — greeting + KPIs left, calendar right, no dead space          */
/* -------------------------------------------------------------------------- */

function TopHeader({ displayName, fetchDashboard, counts }) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-grid">

        {/* ── Left column: greeting banner + KPI cards ── */}
        <div className="dashboard-hero relative overflow-hidden rounded-[20px] border border-indigo-100/80 bg-gradient-to-r from-white via-indigo-50/45 to-violet-50/70 px-5 pt-4 pb-4 shadow-[0_5px_22px_rgba(15,23,42,0.025)]">
          <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-indigo-200/20 blur-3xl" />

          {/* Greeting row */}
          <div className="relative flex items-center justify-between gap-5 mb-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
                  <TIcon name="sparkles" size={12} />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-500">Admin Workspace</span>
              </div>
              <h1 className="truncate text-[25.5px] font-black leading-none tracking-[-0.045em] text-slate-900">
                Welcome back,{' '}
                <span className="text-indigo-600 inline-flex items-center gap-1.5">
                  <TIcon name="user-cog" size={24} className="text-indigo-500" />
                  <span className="text-indigo-600">{displayName}</span>
                </span>
                <span className="ml-2 inline-block">
                  <TIcon name="wave-hand" size={28} className="text-amber-400" />
                </span>
              </h1>
              <p className="mt-1 text-[10.5px] font-medium text-slate-400">Monitor tasks, workload and team activity from one place.</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-600">Operational</span>
              </div>
              <button
                type="button"
                onClick={fetchDashboard}
                title="Refresh dashboard"
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <TIcon name="refresh" size={14} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-3 h-px bg-indigo-100/60" />

          {/* KPI strip — 3×2 grid under greeting */}
          <div className="kpi-strip relative">
            <KpiCard title="All Tasks"   value={counts.all}        subtitle="Total"           icon="layout-kanban"   iconBg="bg-indigo-50"  iconColor="text-indigo-600"  accent="bg-indigo-500"  cardBg="from-white to-indigo-50/60" />
            <KpiCard title="Pending"     value={counts.pending}    subtitle="Awaiting"        icon="clock-pause"     iconBg="bg-amber-50"   iconColor="text-amber-600"   accent="bg-amber-500"   cardBg="from-white to-amber-50/45"  />
            <KpiCard title="In Progress" value={counts.inProgress} subtitle="Active"          icon="progress"        iconBg="bg-blue-50"    iconColor="text-blue-600"    accent="bg-blue-500"    cardBg="from-white to-blue-50/45"   />
            <KpiCard title="Completed"   value={counts.completed}  subtitle="Done"            icon="circle-check"    iconBg="bg-emerald-50" iconColor="text-emerald-600" accent="bg-emerald-500" cardBg="from-white to-emerald-50/45" />
            <KpiCard title="Overdue"     value={counts.overdue}    subtitle="Attention"       icon="alert-triangle"  iconBg="bg-red-50"     iconColor="text-red-500"     accent="bg-red-500"     cardBg="from-white to-red-50/40"    />
            <CompletionKpiCard counts={counts} />
          </div>
        </div>

        {/* ── Right column: calendar ── */}
        <CalendarCard />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Recently Added Tasks — Card Grid View                                      */
/* -------------------------------------------------------------------------- */

function RecentlyAddedTasks({ tasks }) {
  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const priorityConfig = {
    Low:    { color: 'bg-blue-500',   soft: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200' },
    Medium: { color: 'bg-amber-400',  soft: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200' },
    High:   { color: 'bg-orange-500', soft: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    Urgent: { color: 'bg-red-500',    soft: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200' },
  };

  return (
    <section className="dashboard-card rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <TIcon name="clock" size={15} />
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-500">Recent Activity</p>
            <h2 className="mt-0.5 text-[15.5px] font-black text-slate-800">Recently Added Tasks</h2>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-400">
          Last {recentTasks.length} tasks
        </span>
      </div>

      {recentTasks.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-slate-50">
          <p className="text-[12.5px] text-slate-400">No tasks yet</p>
        </div>
      ) : (
        <div className="recent-tasks-grid">
          {recentTasks.map((task, index) => {
            const priorityName = getPriorityName(task.priority);
            const pCfg = priorityConfig[priorityName] || priorityConfig.Medium;
            const overdue = isTaskOverdue(task);
            const catIcon = getCategoryIcon(task.category);

            return (
              <div
                key={task.id || index}
                className="task-card group relative flex flex-col overflow-hidden rounded-[14px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_12px_28px_rgba(99,102,241,0.1)]"
              >
                {/* Priority stripe */}
                <div className={`absolute inset-x-0 top-0 h-[3px] ${pCfg.color} opacity-70 group-hover:opacity-100 transition-opacity`} />

                {/* Index badge */}
                <span className="absolute right-3 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[9.5px] font-extrabold text-slate-400">
                  {index + 1}
                </span>

                {/* Category */}
                <div className="mb-3 mt-1 flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-500">
                    <TIcon name={catIcon} size={13} />
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                    {task.category || 'General'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-1 line-clamp-2 text-[13px] font-bold leading-snug text-slate-800 pr-6">
                  {task.title || 'Untitled Task'}
                </h3>

                {/* Assignee */}
                <p className="mb-3 text-[10.5px] text-slate-400">
                  <span className="font-medium text-slate-500">{task.assignedToName || 'Unassigned'}</span>
                  {task.dueDate && (
                    <>
                      {' · '}
                      <span className={overdue ? 'font-semibold text-red-500' : 'text-slate-400'}>
                        {overdue ? '⚠ ' : ''}Due {formatDate(task.dueDate)}
                      </span>
                    </>
                  )}
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${getStatusBadgeColor(task.status)}`}>
                    <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${getStatusDot(task.status)}`} />
                    {task.status === 'InProgress' ? 'In Progress' : task.status || 'Pending'}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${getPriorityBadgeColor(priorityName)}`}>
                    {priorityName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks({});
      if (response.success) {
        const raw = response.data;
        const items = Array.isArray(raw) ? raw : (raw?.items ?? []);
        setTasks(items);
      } else {
        setError(response.message || 'Failed to load dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const counts = useMemo(() => {
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'InProgress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const cancelled = tasks.filter(t => t.status === 'Cancelled').length;
    const overdue = tasks.filter(isTaskOverdue).length;
    return { all: tasks.length, pending, inProgress, completed, cancelled, overdue };
  }, [tasks]);

  const displayName = user?.fullName || user?.name || user?.username || 'Admin';

  if (loading) {
    return (
      <div className="dashboard-shell">
        <style>{dashboardStyles}</style>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto grid h-12 w-12 place-items-center">
              <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-600" />
              <TIcon name="layout-dashboard" size={17} className="text-indigo-500" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-slate-400">Loading workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell">
        <style>{dashboardStyles}</style>
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-500">
              <TIcon name="alert-circle" size={21} />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-slate-800">Unable to load dashboard</h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-400">{error}</p>
            <button
              type="button"
              onClick={fetchDashboard}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[13px] font-semibold text-white hover:bg-slate-800"
            >
              <TIcon name="refresh" size={13} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <style>{dashboardStyles}</style>

      <TopHeader displayName={displayName} fetchDashboard={fetchDashboard} counts={counts} />

      <div className="dashboard-content">
        {/* Recently Added Tasks — Card Grid */}
        <RecentlyAddedTasks tasks={tasks} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const dashboardStyles = `
  @keyframes dashboardFade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ---- Shell ---- */
  .dashboard-shell {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px 16px;
    background:
      radial-gradient(circle at 84% 0%, rgba(99,102,241,.065), transparent 27%),
      radial-gradient(circle at 5% 100%, rgba(6,182,212,.04), transparent 26%),
      #f7f9fc;
    color: #0f172a;
    animation: dashboardFade 180ms ease-out;
    box-sizing: border-box;
  }

  .dashboard-shell::-webkit-scrollbar { width: 6px; }
  .dashboard-shell::-webkit-scrollbar-track { background: transparent; }
  .dashboard-shell::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
  .dashboard-shell::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  .dashboard-shell { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
  .dashboard-shell, .dashboard-shell * { box-sizing: border-box; }
  .dashboard-shell > * { min-width: 0; flex-shrink: 0; }

  /* ---- Header Grid ---- */
  .dashboard-header-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    align-items: stretch;
    gap: 12px;
  }

  /* Hero: flex column, stretches to match calendar height */
  .dashboard-hero {
    display: flex;
    flex-direction: column;
  }

  /* KPI strip: 3 cols x 2 rows — cards breathe properly */
  .kpi-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(2, 1fr);
    gap: 6px;
    flex: 1;
    min-height: 0;
  }

  .kpi-card { min-height: 72px; }

  /* Special styling for count values */
  .count-value {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  .dashboard-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dashboard-content > * { flex-shrink: 0; }

  /* ---- Recent Tasks Card Grid ---- */
  .recent-tasks-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }

  .task-card { min-height: 160px; }

  /* ---- line-clamp ---- */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ---- 1300px ---- */
  @media (max-width: 1300px) {
    .dashboard-header-grid { grid-template-columns: minmax(0, 1fr) 340px; }
    .recent-tasks-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  /* ---- 1020px ---- */
  @media (max-width: 1020px) {
    .dashboard-header-grid { grid-template-columns: minmax(0, 1fr); }
    .kpi-strip { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .recent-tasks-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  /* ---- 700px ---- */
  @media (max-width: 700px) {
    .dashboard-shell { padding: 0 8px 8px; gap: 8px; }
    .dashboard-hero { border-radius: 16px !important; padding: 13px !important; }
    .dashboard-content { gap: 8px; }
    .kpi-strip { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
    .recent-tasks-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  /* ---- 480px ---- */
  @media (max-width: 480px) {
    .kpi-strip { grid-template-columns: minmax(0, 1fr); }
    .calendar-card { min-height: 140px; }
    .recent-tasks-grid { grid-template-columns: minmax(0, 1fr); }
  }
`;