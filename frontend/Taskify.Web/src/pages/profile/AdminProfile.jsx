import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

/* ─────────────────────────────────────────────────────────────
   Tabler Icon
───────────────────────────────────────────────────────────── */

function TIcon({ name, size = 18, className = '' }) {
  return (
    <i
      className={`ti ti-${name} ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
      }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Password Requirements
───────────────────────────────────────────────────────────── */

const PASSWORD_REQUIREMENTS = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    key: 'lowercase',
    label: 'One lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    key: 'number',
    label: 'One number',
    test: (value) => /[0-9]/.test(value),
  },
  {
    key: 'special',
    label: 'One special character',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

/* ─────────────────────────────────────────────────────────────
   Password Input
───────────────────────────────────────────────────────────── */

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="new-password"
          className="
            h-12 w-full rounded-xl
            border border-slate-200
            bg-white px-4 pr-12
            text-[14px] font-medium text-slate-800
            outline-none transition-all
            placeholder:text-slate-400
            focus:border-indigo-400
            focus:ring-4 focus:ring-indigo-50
          "
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="
            absolute right-0 top-0
            grid h-12 w-12
            place-items-center
            text-slate-400
            transition-colors
            hover:text-slate-700
          "
          aria-label={
            showPassword
              ? 'Hide password'
              : 'Show password'
          }
        >
          <TIcon
            name={showPassword ? 'eye-off' : 'eye'}
            size={18}
          />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Accordion Header
───────────────────────────────────────────────────────────── */

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
        flex w-full items-center gap-4
        px-5 py-4 text-left
        transition-colors
        hover:bg-slate-50
      "
    >
      <span
        className="
          grid h-10 w-10 shrink-0
          place-items-center rounded-lg
          bg-indigo-50 text-indigo-600
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

      <span className="grid h-8 w-8 place-items-center text-slate-400">
        <TIcon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={17}
        />
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Admin Profile Page
───────────────────────────────────────────────────────────── */

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /* ─────────────────────────────────────────────────────────
     Load Profile
  ───────────────────────────────────────────────────────── */

  const loadProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await api.get('/profile');

      const profileData = response?.data?.data;

      if (!profileData) {
        throw new Error('Profile data was not returned.');
      }

      setProfile(profileData);
      setFullName(profileData.fullName || '');
    } catch (error) {
      console.error(
        'Failed to load admin profile:',
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to load your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ─────────────────────────────────────────────────────────
     Initials
  ───────────────────────────────────────────────────────── */

  const initials = useMemo(() => {
    const name = profile?.fullName?.trim();

    if (!name) {
      return 'AD';
    }

    const parts = name
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`
      .toUpperCase();
  }, [profile]);

  /* ─────────────────────────────────────────────────────────
     Full Name Change Detection
  ───────────────────────────────────────────────────────── */

  const nameChanged =
    fullName.trim() !==
    (profile?.fullName || '');

  /* ─────────────────────────────────────────────────────────
     Password Validation
  ───────────────────────────────────────────────────────── */

  const passwordRequirements =
    PASSWORD_REQUIREMENTS.map((requirement) => {
      const value = newPassword || '';

      return {
        key: requirement.key,
        label: requirement.label,
        valid: requirement.test(value),
      };
    });

  const passwordIsValid =
    passwordRequirements.length > 0 &&
    passwordRequirements.every(
      (requirement) => requirement.valid
    );

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const canUpdatePassword =
    currentPassword.trim().length > 0 &&
    passwordIsValid &&
    passwordsMatch;

  /* ─────────────────────────────────────────────────────────
     Update Full Name
  ───────────────────────────────────────────────────────── */

  const handleUpdateName = async () => {
    const trimmedName = fullName.trim();

    setSuccessMessage('');
    setErrorMessage('');

    if (!trimmedName) {
      setErrorMessage('Full name is required.');
      return;
    }

    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length < 2) {
      setErrorMessage(
        'Please enter your first name and last name.'
      );
      return;
    }

    try {
      setSavingName(true);

      await api.put('/profile/name', {
        fullName: trimmedName,
      });

      setProfile((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          fullName: trimmedName,
        };
      });

      setFullName(trimmedName);

      setSuccessMessage(
        'Full name updated successfully.'
      );
    } catch (error) {
      console.error(
        'Failed to update full name:',
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
          'Unable to update your full name.'
      );
    } finally {
      setSavingName(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
     Change Password
  ───────────────────────────────────────────────────────── */

  const handleChangePassword = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!currentPassword.trim()) {
      setErrorMessage(
        'Please enter your current password.'
      );
      return;
    }

    if (!passwordIsValid) {
      setErrorMessage(
        'Please meet all password requirements.'
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage(
        'New password and confirmation password do not match.'
      );
      return;
    }

    try {
      setSavingPassword(true);

      await api.put('/profile/password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setSuccessMessage(
        'Password changed successfully.'
      );
    } catch (error) {
      console.error(
        'Failed to change password:',
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
          'Unable to change your password.'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
     Loading State
  ───────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 py-3">
        <div className="mx-auto max-w-7xl animate-pulse px-4">
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

  /* ─────────────────────────────────────────────────────────
     Error State
  ───────────────────────────────────────────────────────── */

  if (!profile) {
    return (
      <div className="min-h-full bg-slate-50 py-3">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500">
              <TIcon
                name="alert-circle"
                size={22}
              />
            </div>

            <h2 className="text-[15px] font-semibold text-slate-900">
              Unable to load profile
            </h2>

            <p className="mt-1 text-[13px] font-medium text-slate-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadProfile}
              className="
                mt-5 inline-flex h-10
                items-center gap-2
                rounded-lg bg-slate-900
                px-5 text-[13px]
                font-semibold text-white
                transition hover:bg-slate-800
              "
            >
              <TIcon
                name="refresh"
                size={15}
              />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     Page
  ───────────────────────────────────────────────────────── */

  return (
    <div className="min-h-full bg-slate-50 py-3">
      <div className="mx-auto max-w-7xl px-4">

        {/* Messages */}

        {(successMessage || errorMessage) && (
          <div
            className={`
              mb-5 flex items-center gap-3
              rounded-xl border px-5 py-3.5
              text-[13px] font-medium
              ${
                errorMessage
                  ? 'border-red-100 bg-red-50 text-red-700'
                  : 'border-emerald-100 bg-emerald-50 text-emerald-700'
              }
            `}
          >
            <TIcon
              name={
                errorMessage
                  ? 'alert-circle'
                  : 'circle-check'
              }
              size={18}
            />

            <span className="flex-1">
              {errorMessage || successMessage}
            </span>

            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="opacity-60 transition hover:opacity-100"
            >
              <TIcon name="x" size={16} />
            </button>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">

          {/* ─────────────────────────────────────────────────
              Profile Card
          ───────────────────────────────────────────────── */}

          <div className="lg:sticky lg:top-4">
            <div className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="p-6">

                {/* Avatar */}

                <div
                  className="
                    mx-auto flex h-28 w-28
                    items-center justify-center
                    rounded-full bg-indigo-100
                    text-3xl font-bold
                    text-indigo-700
                    ring-8 ring-indigo-50
                  "
                >
                  {initials}
                </div>

                {/* Name */}

                <div className="mt-5 text-center">
                  <h2
                    className="
                      truncate text-[19px]
                      font-bold text-slate-900
                    "
                  >
                    {profile.fullName}
                  </h2>

                  <p
                    className="
                      mt-1.5 truncate
                      text-[13px] font-medium
                      text-slate-500
                    "
                  >
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Account Information */}

              <div className="border-t border-slate-100 px-6 py-5">

                {/* Created */}

                <div className="flex items-start gap-4">
                  <span
                    className="
                      grid h-9 w-9 shrink-0
                      place-items-center rounded-lg
                      bg-slate-50 text-slate-500
                    "
                  >
                    <TIcon
                      name="calendar-plus"
                      size={17}
                    />
                  </span>

                  <div>
                    <p
                      className="
                        text-[11px] font-semibold
                        uppercase tracking-[0.1em]
                        text-slate-400
                      "
                    >
                      Account created
                    </p>

                    <p
                      className="
                        mt-1 text-[13px]
                        font-medium text-slate-700
                      "
                    >
                      {new Date(
                        profile.accountCreatedOn
                      ).toLocaleDateString(
                        undefined,
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Status */}

                <div className="mt-4 flex items-center gap-4">
                  <span
                    className={`
                      grid h-9 w-9 shrink-0
                      place-items-center rounded-lg
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
                    <p
                      className="
                        text-[11px] font-semibold
                        uppercase tracking-[0.1em]
                        text-slate-400
                      "
                    >
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
                      {profile.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────
              Right Content
          ───────────────────────────────────────────────── */}

          <div className="space-y-5">

            {/* ───────────────────────────────────────────────
                Profile Details
            ─────────────────────────────────────────────── */}

            <section
              className="
                overflow-hidden rounded-2xl
                border border-slate-200
                bg-white shadow-sm
              "
            >
              <AccordionHeader
                icon="user"
                title="Profile details"
                description="View and update your administrator information."
                open={detailsOpen}
                onClick={() =>
                  setDetailsOpen(
                    (previous) => !previous
                  )
                }
              />

              {detailsOpen && (
                <div
                  className="
                    border-t border-slate-100
                    p-5
                  "
                >
                  <div className="grid grid-cols-2 gap-5">

                    {/* Full Name */}

                    <div className="col-span-2 lg:col-span-1">
                      <label
                        className="
                          mb-2 block text-[13px]
                          font-semibold text-slate-700
                        "
                      >
                        Full name
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(event) => {
                            setFullName(
                              event.target.value
                            );

                            setErrorMessage('');
                            setSuccessMessage('');
                          }}
                          className="
                            h-12 w-full
                            rounded-xl
                            border border-slate-200
                            bg-white px-4 pr-28
                            text-[14px]
                            font-medium
                            text-slate-800
                            outline-none
                            transition-all
                            placeholder:text-slate-400
                            focus:border-indigo-400
                            focus:ring-4
                            focus:ring-indigo-50
                          "
                        />

                        {nameChanged && (
                          <button
                            type="button"
                            onClick={handleUpdateName}
                            disabled={savingName}
                            className="
                              absolute right-1.5
                              top-1.5 h-9
                              rounded-lg
                              bg-slate-900
                              px-4 text-[12px]
                              font-semibold text-white
                              transition-all
                              hover:bg-slate-800
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              flex items-center gap-2
                            "
                          >
                            {savingName ? (
                              <>
                                <span
                                  className="
                                    h-3.5 w-3.5
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-white/30
                                    border-t-white
                                  "
                                />

                                <span className="hidden sm:inline">
                                  Saving
                                </span>
                              </>
                            ) : (
                              <>
                                <TIcon
                                  name="check"
                                  size={14}
                                />

                                <span className="hidden sm:inline">
                                  Update
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <p
                        className="
                          mt-2 text-[11px]
                          font-medium text-slate-400
                        "
                      >
                        Update your first and last name.
                      </p>
                    </div>

                    {/* Email */}

                    <div className="col-span-2 lg:col-span-1">
                      <label
                        className="
                          mb-2 block text-[13px]
                          font-semibold text-slate-700
                        "
                      >
                        Email address
                      </label>

                      <div className="relative">
                        <input
                          type="email"
                          value={profile.email || ''}
                          disabled
                          className="
                            h-12 w-full
                            rounded-xl
                            border border-slate-200
                            bg-slate-50
                            px-4 pr-12
                            text-[14px]
                            font-medium
                            text-slate-500
                            outline-none
                          "
                        />

                        <span
                          className="
                            absolute right-0 top-0
                            grid h-12 w-12
                            place-items-center
                            text-slate-400
                          "
                        >
                          <TIcon
                            name="lock"
                            size={16}
                          />
                        </span>
                      </div>

                      <p
                        className="
                          mt-2 text-[11px]
                          font-medium text-slate-400
                        "
                      >
                        Email cannot be changed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ───────────────────────────────────────────────
                Password & Security
            ─────────────────────────────────────────────── */}

            <section
              className="
                overflow-hidden rounded-2xl
                border border-slate-200
                bg-white shadow-sm
              "
            >
              <AccordionHeader
                icon="lock"
                title="Password & security"
                description="Change your administrator password."
                open={passwordOpen}
                onClick={() =>
                  setPasswordOpen(
                    (previous) => !previous
                  )
                }
              />

              {passwordOpen && (
                <div
                  className="
                    border-t border-slate-100
                    p-5
                  "
                >
                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Current Password */}

                    <div className="sm:col-span-2">
                      <PasswordInput
                        label="Current password"
                        value={currentPassword}
                        onChange={(value) => {
                          setCurrentPassword(value);
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        placeholder="Enter your current password"
                      />

                      <p
                        className="
                          mt-2 text-[11px]
                          font-medium text-slate-400
                        "
                      >
                        Your current password is required
                        to change your password.
                      </p>
                    </div>

                    {/* New Password */}

                    <div>
                      <PasswordInput
                        label="New password"
                        value={newPassword}
                        onChange={(value) => {
                          setNewPassword(value);
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        placeholder="Enter your new password"
                      />

                      {newPassword.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {passwordRequirements.map(
                            (requirement) => (
                              <div
                                key={requirement.key}
                                className={`
                                  flex items-center
                                  gap-2 text-[11px]
                                  font-medium
                                  ${
                                    requirement.valid
                                      ? 'text-emerald-600'
                                      : 'text-slate-400'
                                  }
                                `}
                              >
                                <TIcon
                                  name={
                                    requirement.valid
                                      ? 'circle-check'
                                      : 'circle'
                                  }
                                  size={13}
                                />

                                <span>
                                  {requirement.label}
                                </span>
                              </div>
                            )
                          )}
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
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        placeholder="Confirm your new password"
                      />

                      {confirmPassword.length > 0 && (
                        <div
                          className={`
                            mt-2 flex items-center
                            gap-1.5 text-[11px]
                            font-medium
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

                  {/* Password Footer */}

                  <div
                    className="
                      mt-5 flex flex-col
                      gap-3 border-t
                      border-slate-100
                      pt-5 sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[12px]
                          font-semibold
                          text-slate-600
                        "
                      >
                        Keep your account secure.
                      </p>

                      <p
                        className="
                          mt-0.5 text-[11px]
                          font-medium
                          text-slate-400
                        "
                      >
                        Use a strong password that
                        you do not use elsewhere.
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
                        inline-flex h-11
                        shrink-0
                        items-center
                        justify-center
                        gap-2 rounded-xl
                        bg-slate-900
                        px-5 text-[13px]
                        font-semibold text-white
                        transition
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:bg-slate-200
                        disabled:text-slate-400
                        min-w-[160px]
                      "
                    >
                      {savingPassword ? (
                        <>
                          <span
                            className="
                              h-3.5 w-3.5
                              animate-spin
                              rounded-full
                              border-2
                              border-white/30
                              border-t-white
                            "
                          />

                          Updating...
                        </>
                      ) : (
                        <>
                          <TIcon
                            name="key"
                            size={16}
                          />

                          Update password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
