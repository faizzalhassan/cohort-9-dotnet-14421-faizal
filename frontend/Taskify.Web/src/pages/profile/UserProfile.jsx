import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

/* ─── Tabler Icon ───────────────────────────────────────────────────────── */

function TIcon({ name, size = 18, className = '' }) {
  return (
    <i
      className={`ti ti-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    />
  );
}

/* ─── Password Requirements ─────────────────────────────────────────────── */

const passwordRequirements = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'lowercase',
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    key: 'number',
    label: 'One number',
    test: (password) => /\d/.test(password),
  },
  {
    key: 'special',
    label: 'One special character',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

/* ─── Password Input ────────────────────────────────────────────────────── */

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  autoComplete = 'new-password',
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="
            h-12 w-full rounded-xl border border-slate-200
            bg-white px-4 pr-12 text-[14px] text-slate-800
            outline-none transition-all font-medium
            placeholder:text-slate-400
            focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50
            disabled:cursor-not-allowed disabled:bg-slate-50
          "
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="
            absolute right-0 top-0 grid h-12 w-12
            place-items-center text-slate-400
            transition-colors hover:text-slate-700
          "
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <TIcon
            name={visible ? 'eye-off' : 'eye'}
            size={18}
          />
        </button>
      </div>
    </div>
  );
}

/* ─── Section Header ────────────────────────────────────────────────────── */

function AccordionHeader({
  icon,
  title,
  description,
  open,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full items-center gap-4 px-5 py-4
        text-left transition-colors hover:bg-slate-50/70
      "
    >
      <span
        className="
          grid h-10 w-10 shrink-0 place-items-center
          rounded-lg bg-indigo-50 text-indigo-600
        "
      >
        <TIcon name={icon} size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-slate-900">
          {title}
        </span>

        <span className="mt-0.5 block text-[12px] font-medium text-slate-400">
          {description}
        </span>
      </span>

      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400">
        <TIcon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={17}
        />
      </span>
    </button>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */

export default function UserProfile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [fullName, setFullName] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /* ─── Load Profile ──────────────────────────────────────────────────── */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/profile');

      const data = response.data?.data;

      setProfile(data);
      setFullName(data?.fullName || '');
    } catch (err) {
      console.error('Failed to load profile:', err);

      setError(
        err.response?.data?.message ||
          'Unable to load your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─── Avatar Initials ───────────────────────────────────────────────── */

  const initials = useMemo(() => {
    if (!profile?.fullName) {
      return 'U';
    }

    const parts = profile.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [profile]);

  /* ─── Full Name Changed ─────────────────────────────────────────────── */

  const nameChanged =
    fullName.trim() !== (profile?.fullName || '');

  /* ─── Password Requirements ─────────────────────────────────────────── */

  const requirementResults = useMemo(() => {
    return passwordRequirements.map((requirement) => ({
      ...requirement,
      valid: requirement.test(newPassword),
    }));
  }, [newPassword]);

  const passwordValid =
    requirementResults.every((requirement) => requirement.valid);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const canUpdatePassword =
    currentPassword.trim().length > 0 &&
    passwordValid &&
    passwordsMatch;

  /* ─── Update Full Name ──────────────────────────────────────────────── */

  const handleUpdateName = async () => {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError('Full name is required.');
      return;
    }

    const parts = trimmedName.split(/\s+/);

    if (parts.length < 2) {
      setError('Please provide both first name and last name.');
      return;
    }

    try {
      setSavingName(true);
      setError('');
      setMessage('');

      await api.put('/profile/name', {
        fullName: trimmedName,
      });

      setProfile((previous) => ({
        ...previous,
        fullName: trimmedName,
      }));

      setFullName(trimmedName);

      setMessage('Full name updated successfully.');
    } catch (err) {
      console.error('Failed to update full name:', err);

      setError(
        err.response?.data?.message ||
          'Unable to update your full name.'
      );
    } finally {
      setSavingName(false);
    }
  };

  /* ─── Change Password ───────────────────────────────────────────────── */

  const handleChangePassword = async () => {
    if (!canUpdatePassword) {
      return;
    }

    try {
      setSavingPassword(true);
      setError('');
      setMessage('');

      await api.put('/profile/password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setMessage(
        'Password changed successfully. Please sign in again.'
      );
    } catch (err) {
      console.error('Failed to change password:', err);

      setError(
        err.response?.data?.message ||
          'Unable to change your password.'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  /* ─── Deactivate Account ────────────────────────────────────────────── */

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your account? You will need to reactivate it before you can use Taskify again.'
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');

      await api.patch('/profile/deactivate');

      localStorage.removeItem('taskify_token');
      localStorage.removeItem('taskify_user');

      window.location.href = '/login';
    } catch (err) {
      console.error('Failed to deactivate account:', err);

      setError(
        err.response?.data?.message ||
          'Unable to deactivate your account.'
      );

      setActionLoading(false);
    }
  };

  /* ─── Delete Account ────────────────────────────────────────────────── */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');

      await api.delete('/profile');

      localStorage.removeItem('taskify_token');
      localStorage.removeItem('taskify_user');

      window.location.href = '/login';
    } catch (err) {
      console.error('Failed to delete account:', err);

      setError(
        err.response?.data?.message ||
          'Unable to delete your account.'
      );

      setActionLoading(false);
    }
  };

  /* ─── Loading ────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 py-3">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="h-[380px] rounded-2xl border border-slate-200 bg-white" />

            <div className="space-y-5">
              <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
              <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-slate-50 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500">
              <TIcon name="alert-circle" size={22} />
            </div>

            <h2 className="text-[15px] font-semibold text-slate-900">
              Unable to load profile
            </h2>

            <p className="mt-1 text-[13px] font-medium text-slate-500">
              {error || 'Something went wrong while loading your profile.'}
            </p>

            <button
              type="button"
              onClick={loadProfile}
              className="
                mt-5 inline-flex h-10 items-center gap-2
                rounded-lg bg-slate-900 px-5
                text-[13px] font-semibold text-white
                transition hover:bg-slate-800
              "
            >
              <TIcon name="refresh" size={15} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Render ────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-full bg-slate-50 py-3">
      <div className="mx-auto max-w-7xl px-0">

        {/* ── Feedback ────────────────────────────────────────────────── */}

        {(message || error) && (
          <div
            className={`
              mb-5 mx-4 flex items-center gap-3 rounded-xl border
              px-5 py-3.5 text-[13px] font-medium
              ${
                error
                  ? 'border-red-100 bg-red-50 text-red-700'
                  : 'border-emerald-100 bg-emerald-50 text-emerald-700'
              }
            `}
          >
            <TIcon
              name={error ? 'alert-circle' : 'circle-check'}
              size={18}
            />

            <span className="flex-1">
              {error || message}
            </span>

            <button
              type="button"
              onClick={() => {
                setError('');
                setMessage('');
              }}
              className="text-current opacity-60 transition hover:opacity-100"
            >
              <TIcon name="x" size={16} />
            </button>
          </div>
        )}

        {/* ── Main Layout ─────────────────────────────────────────────── */}

        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">

          {/* ============================================================
              LEFT PROFILE CARD - STICKY
          ============================================================ */}

          <div className="lg:sticky lg:top-4 px-4 lg:px-0">
            <div className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="p-6">

                {/* Avatar */}

                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700 ring-8 ring-indigo-50">
                  {initials}
                </div>

                {/* Name */}

                <div className="mt-5 text-center">
                  <h2 className="truncate text-[19px] font-bold text-slate-900">
                    {profile.fullName}
                  </h2>

                  <p className="mt-1.5 truncate text-[13px] font-medium text-slate-500">
                    {profile.email}
                  </p>
                </div>

              </div>

              {/* Account information */}

              <div className="border-t border-slate-100 px-6 py-5">

                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500">
                    <TIcon name="calendar-plus" size={17} />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      Account created
                    </p>

                    <p className="mt-1 text-[13px] font-medium text-slate-700">
                      {new Date(
                        profile.accountCreatedOn
                      ).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">

                  <span
                    className={`
                      grid h-9 w-9 shrink-0 place-items-center
                      rounded-lg
                      ${
                        profile.isActive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }
                    `}
                  >
                    <TIcon
                      name={
                        profile.isActive
                          ? 'circle-check'
                          : 'clock'
                      }
                      size={17}
                    />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      Account status
                    </p>

                    <p
                      className={`
                        mt-1 text-[13px] font-medium
                        ${
                          profile.isActive
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }
                      `}
                    >
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* ============================================================
              RIGHT CONTENT
          ============================================================ */}

          <div className="space-y-5 px-4 lg:px-0">

            {/* ==========================================================
                PROFILE DETAILS
            ========================================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <AccordionHeader
                icon="user"
                title="Profile details"
                description="View and update your personal information."
                open={detailsOpen}
                onClick={() =>
                  setDetailsOpen((current) => !current)
                }
              />

              {detailsOpen && (
                <div className="border-t border-slate-100 p-5">

                  <div className="grid grid-cols-2 gap-5">

                    {/* Full Name */}

                    <div className="col-span-2 lg:col-span-1">

                      <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                        Full name
                      </label>

                      <div className="relative">

                        <input
                          type="text"
                          value={fullName}
                          onChange={(event) => {
                            setFullName(event.target.value);
                            setError('');
                            setMessage('');
                          }}
                          className="
                            h-12 w-full rounded-xl
                            border border-slate-200 bg-white
                            px-4 pr-14 text-[14px] font-medium text-slate-800
                            outline-none transition-all
                            placeholder:text-slate-400
                            focus:border-indigo-400
                            focus:ring-4 focus:ring-indigo-50
                          "
                        />

                        {nameChanged && (
                          <button
                            type="button"
                            onClick={handleUpdateName}
                            disabled={savingName}
                            className="
                              absolute right-1.5 top-1.5
                              flex h-9 items-center gap-2
                              rounded-lg bg-slate-900 px-4
                              text-[12px] font-semibold text-white
                              transition-all
                              hover:bg-slate-800
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {savingName ? (
                              <>
                                <span
                                  className="
                                    h-3.5 w-3.5 animate-spin
                                    rounded-full border-2
                                    border-white/30 border-t-white
                                  "
                                />

                                <span className="hidden sm:inline">
                                  Saving
                                </span>
                              </>
                            ) : (
                              <>
                                <TIcon name="check" size={14} />

                                <span className="hidden sm:inline">
                                  Update
                                </span>
                              </>
                            )}
                          </button>
                        )}

                      </div>

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        Your full name is displayed throughout Taskify.
                      </p>

                    </div>

                    {/* Email */}

                    <div className="col-span-2 lg:col-span-1">

                      <label className="mb-2 block text-[13px] font-semibold text-slate-700">
                        Email address
                      </label>

                      <div className="relative">

                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="
                            h-12 w-full rounded-xl
                            border border-slate-200
                            bg-slate-50 px-4 pr-12
                            text-[14px] font-medium text-slate-500
                            outline-none
                          "
                        />

                        <span
                          className="
                            absolute right-0 top-0
                            grid h-12 w-12 place-items-center
                            text-slate-400
                          "
                        >
                          <TIcon name="lock" size={16} />
                        </span>

                      </div>

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        Email address cannot be changed.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </section>

            {/* ==========================================================
                PASSWORD
            ========================================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <AccordionHeader
                icon="lock"
                title="Password & security"
                description="Change your password and keep your account secure."
                open={passwordOpen}
                onClick={() =>
                  setPasswordOpen((current) => !current)
                }
              />

              {passwordOpen && (
                <div className="border-t border-slate-100 p-5">

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Current Password */}

                    <div className="sm:col-span-2">

                      <PasswordInput
                        label="Current password"
                        value={currentPassword}
                        onChange={(value) => {
                          setCurrentPassword(value);
                          setError('');
                          setMessage('');
                        }}
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                      />

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        Your current password is required to make a change.
                      </p>

                    </div>

                    {/* New Password */}

                    <div>

                      <PasswordInput
                        label="New password"
                        value={newPassword}
                        onChange={(value) => {
                          setNewPassword(value);
                          setError('');
                          setMessage('');
                        }}
                        placeholder="Enter a new password"
                        autoComplete="new-password"
                      />

                      {/* Requirements */}

                      {newPassword.length > 0 && (
                        <div className="mt-3 space-y-1.5">

                          {requirementResults.map((requirement) => (
                            <div
                              key={requirement.key}
                              className={`
                                flex items-center gap-2
                                text-[11px] font-medium
                                ${
                                  requirement.valid
                                    ? 'text-emerald-600'
                                    : 'text-slate-400'
                                }
                              `}
                            >
                              <span
                                className="
                                  grid h-4 w-4 shrink-0
                                  place-items-center
                                "
                              >
                                <TIcon
                                  name={
                                    requirement.valid
                                      ? 'circle-check'
                                      : 'circle'
                                  }
                                  size={13}
                                />
                              </span>

                              <span>
                                {requirement.label}
                              </span>
                            </div>
                          ))}

                        </div>
                      )}

                    </div>

                    {/* Confirm Password */}

                    <div>

                      <PasswordInput
                        label="Confirm new password"
                        value={confirmPassword}
                        onChange={(value) => {
                          setConfirmPassword(value);
                          setError('');
                          setMessage('');
                        }}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                      />

                      {confirmPassword.length > 0 && (
                        <div
                          className={`
                            mt-2 flex items-center gap-1.5
                            text-[11px] font-medium
                            ${
                              passwordsMatch
                                ? 'text-emerald-600'
                                : 'text-red-500'
                            }
                          `}
                        >
                          <TIcon
                            name={
                              passwordsMatch
                                ? 'circle-check'
                                : 'alert-circle'
                            }
                            size={13}
                          />

                          <span>
                            {passwordsMatch
                              ? 'Passwords match.'
                              : 'Passwords do not match.'}
                          </span>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Password update */}

                  <div
                    className="
                      mt-5 flex flex-col gap-3
                      border-t border-slate-100 pt-5
                      sm:flex-row sm:items-center
                      sm:justify-between
                    "
                  >

                    <div>
                      <p className="text-[12px] font-semibold text-slate-600">
                        Make sure you remember your new password.
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        Changing your password will sign you out of your
                        current sessions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={
                        !canUpdatePassword ||
                        savingPassword
                      }
                      className="
                        inline-flex h-11 min-w-[160px]
                        shrink-0 items-center justify-center gap-2
                        rounded-xl bg-slate-900 px-5
                        text-[13px] font-semibold text-white
                        transition-all
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:bg-slate-200
                        disabled:text-slate-400
                      "
                    >
                      {savingPassword ? (
                        <>
                          <span
                            className="
                              h-3.5 w-3.5 animate-spin
                              rounded-full border-2
                              border-white/30 border-t-white
                            "
                          />

                          Updating...
                        </>
                      ) : (
                        <>
                          <TIcon name="key" size={16} />
                          Update password
                        </>
                      )}
                    </button>

                  </div>

                </div>
              )}

            </section>

            {/* ==========================================================
                DANGER ZONE
            ========================================================== */}

            <section
              className="
                overflow-hidden rounded-2xl
                border border-red-100 bg-white shadow-sm
              "
            >

              <div className="border-b border-red-100 bg-red-50/40 px-5 py-4">

                <div className="flex items-center gap-4">

                  <span
                    className="
                      grid h-10 w-10 shrink-0 place-items-center
                      rounded-lg bg-red-50 text-red-500
                    "
                  >
                    <TIcon name="alert-triangle" size={19} />
                  </span>

                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900">
                      Danger zone
                    </h3>

                    <p className="mt-0.5 text-[12px] font-medium text-slate-400">
                      Actions here affect your account access.
                    </p>
                  </div>

                </div>

              </div>

              <div className="divide-y divide-slate-100">

                {/* Deactivate */}

                <div
                  className="
                    flex flex-col gap-3 px-5 py-4
                    sm:flex-row sm:items-center
                    sm:justify-between
                  "
                >

                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      Deactivate account
                    </p>

                    <p
                      className="
                        mt-1 max-w-xl text-[11px]
                        font-medium leading-5 text-slate-400
                      "
                    >
                      Temporarily disable your account. Your information
                      will remain stored and you can be handled according
                      to the application's account recovery process.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeactivate}
                    disabled={actionLoading}
                    className="
                      flex h-10 min-w-[120px]
                      shrink-0 items-center justify-center gap-2
                      rounded-lg bg-slate-900 px-4
                      text-[12px] font-semibold text-white
                      transition-colors
                      hover:bg-slate-800
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {actionLoading ? (
                      <>
                        <span
                          className="
                            h-3.5 w-3.5 animate-spin
                            rounded-full border-2
                            border-white/30 border-t-white
                          "
                        />

                        Loading...
                      </>
                    ) : (
                      'Deactivate'
                    )}
                  </button>

                </div>

                {/* Delete */}

                <div
                  className="
                    flex flex-col gap-3 px-5 py-4
                    sm:flex-row sm:items-center
                    sm:justify-between
                  "
                >

                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      Delete account
                    </p>

                    <p
                      className="
                        mt-1 max-w-xl text-[11px]
                        font-medium leading-5 text-slate-400
                      "
                    >
                      Permanently remove your account from Taskify.
                      This action cannot be undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="
                      flex h-10 min-w-[120px]
                      shrink-0 items-center justify-center gap-2
                      rounded-lg bg-slate-900 px-4
                      text-[12px] font-semibold text-white
                      transition-colors
                      hover:bg-slate-800
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {actionLoading ? (
                      <>
                        <span
                          className="
                            h-3.5 w-3.5 animate-spin
                            rounded-full border-2
                            border-white/30 border-t-white
                          "
                        />

                        Loading...
                      </>
                    ) : (
                      'Delete account'
                    )}
                  </button>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>
    </div>
  );
}