import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

/* ─── Validation ─────────────────────────────────────────────────────────── */
const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const MAX_EMAIL_LENGTH = 254;

/*
 * First and last names:
 * - Letters only
 * - No spaces
 * - No numbers
 * - No special characters
 */
const nameRegex = /^[A-Za-z]+$/;

/*
 * Email:
 * - Prevents leading/trailing dots in local part
 * - Prevents consecutive dots in local part
 * - Requires a valid domain
 * - Prevents dots at the beginning/end of domain
 * - Prevents consecutive dots in domain
 * - Prevents invalid domain labels
 */
const emailRegex =
  /^(?!.*\.\.)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

function validateForm(form) {
  const errors = {};

  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const email = form.email.trim();
  const password = form.password;
  const confirmPassword = form.confirmPassword;

  /* ─── First Name ─────────────────────────────────────────────────────── */
  if (!firstName) {
    errors.firstName = 'First name is required.';
  } else if (firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  } else if (!nameRegex.test(firstName)) {
    errors.firstName = 'First name can contain letters only.';
  }

  /* ─── Last Name ──────────────────────────────────────────────────────── */
  if (!lastName) {
    errors.lastName = 'Last name is required.';
  } else if (lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  } else if (!nameRegex.test(lastName)) {
    errors.lastName = 'Last name can contain letters only.';
  }

  /* ─── Email ──────────────────────────────────────────────────────────── */
  if (!email) {
    errors.email = 'Email is required.';
  } else if (email.length > MAX_EMAIL_LENGTH) {
    errors.email = `Email address cannot exceed ${MAX_EMAIL_LENGTH} characters.`;
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  /* ─── Password ───────────────────────────────────────────────────────── */
  if (!password) {
    errors.password = 'Password is required.';
  } else {
    const passwordErrors = [];

    if (password.length < 8) {
      passwordErrors.push('at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('1 uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      passwordErrors.push('1 lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      passwordErrors.push('1 number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>[\]\\/~`'_\-+=;']/ .test(password)) {
      passwordErrors.push('1 special character');
    }

    if (passwordErrors.length > 0) {
      errors.password = `Password must contain ${passwordErrors.join(', ')}.`;
    }
  }

  /* ─── Confirm Password ───────────────────────────────────────────────── */
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

function getFieldError(errors, field) {
  const error = errors[field];

  if (!error) return '';

  return Array.isArray(error) ? error.join(' ') : error;
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({
  id,
  label,
  icon,
  error,
  hint,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-slate-600"
      >
        {label}
      </label>

      <div className="relative">
        {/* Left icon */}
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <TIcon name={icon} size={16} />
        </span>

        {children}
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[12px] text-red-500"
        >
          <TIcon name="alert-circle" size={13} className="shrink-0" />
          {error}
        </p>
      )}

      {hint && (
        <p className="flex items-start gap-1.5 text-[12px] text-slate-400">
          <TIcon
            name="info-circle"
            size={13}
            className="shrink-0 mt-0.5"
          />
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (authLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  /*
   * Confirm password feedback while typing.
   */
  const confirmPasswordError =
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword
      ? 'Passwords do not match.'
      : getFieldError(errors, 'confirmPassword');

  const confirmPasswordMatch =
    form.confirmPassword.length > 0 &&
    form.password.length > 0 &&
    form.password === form.confirmPassword;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setServerError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError('');
    setSuccessMessage('');

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (!response?.success) {
        setServerError(
          response?.message || 'Unable to create your account.'
        );
        return;
      }

      setSuccessMessage('Registration successful. Redirecting...');

      setTimeout(() => {
        const role = response.data?.user?.role;

        navigate(
          role === 'Admin' ? '/admin' : '/dashboard',
          { replace: true }
        );
      }, 500);
    } catch (error) {
      const response = error?.response;
      const data = response?.data;

      if (response?.status === 400) {
        /*
         * If the backend returns field-level validation errors,
         * display them directly under the relevant fields.
         */
        if (data?.errors) {
          setErrors(data.errors);

          /*
           * Don't show the generic "correct highlighted fields"
           * message when specific validation messages exist.
           */
          setServerError(
            data?.message ||
              'Please review the validation messages below.'
          );
        } else {
          setServerError(
            data?.message ||
              'Please review the validation messages below.'
          );
        }
      } else if (response?.status === 409) {
        setServerError(
          data?.message ||
            'An account with this email already exists.'
        );
      } else if (!response) {
        setServerError(
          'Unable to connect to the server. Please try again.'
        );
      } else {
        setServerError(
          data?.message ||
            'Something went wrong. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    'w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-3.5 text-[14px] text-slate-900 ' +
    'placeholder:text-slate-400 outline-none transition-all duration-150 ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ';

  const inputNormal =
    'border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100';

  const inputError =
    'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100';

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px]">

        {/* Brand */}
        <div className="mb-10 flex items-center justify-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-indigo-50 ring-1 ring-indigo-100">
            <TIcon
              name="checks"
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div className="text-[18px] font-bold tracking-tight text-slate-900">
            Taskify
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">
            Create Account
          </h1>

          <p className="mt-1.5 text-[14px] text-slate-500">
            Create your Taskify account
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <TIcon
              name="circle-x"
              size={16}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <span className="text-[13px] leading-relaxed text-red-700">
              {serverError}
            </span>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
          >
            <TIcon
              name="circle-check"
              size={16}
              className="mt-0.5 shrink-0 text-green-500"
            />

            <span className="text-[13px] leading-relaxed text-green-700">
              {successMessage}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">

            <Field
              id="firstName"
              label="First Name"
              icon="user"
              error={getFieldError(errors, 'firstName')}
              hint="Letters only."
            >
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                disabled={isSubmitting}
                placeholder="First name"
                className={`${inputBase} ${
                  errors.firstName ? inputError : inputNormal
                }`}
              />
            </Field>

            <Field
              id="lastName"
              label="Last Name"
              icon="user"
              error={getFieldError(errors, 'lastName')}
              hint="Letters only."
            >
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                disabled={isSubmitting}
                placeholder="Last name"
                className={`${inputBase} ${
                  errors.lastName ? inputError : inputNormal
                }`}
              />
            </Field>

          </div>

          {/* Email */}
          <Field
            id="email"
            label="Email"
            icon="mail"
            error={getFieldError(errors, 'email')}
            hint={`Maximum ${MAX_EMAIL_LENGTH} characters.`}
          >
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isSubmitting}
              placeholder="you@example.com"
              className={`${inputBase} ${
                errors.email ? inputError : inputNormal
              }`}
            />
          </Field>

          {/* Password */}
          <Field
            id="password"
            label="Password"
            icon="lock"
            error={getFieldError(errors, 'password')}
            hint="Use at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
          >
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={isSubmitting}
              placeholder="Create a password"
              className={`${inputBase} pr-10 ${
                errors.password ? inputError : inputNormal
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              <TIcon
                name={showPassword ? 'eye-off' : 'eye'}
                size={16}
              />
            </button>
          </Field>

          {/* Confirm Password */}
          <Field
            id="confirmPassword"
            label="Confirm Password"
            icon="lock"
            error={confirmPasswordError}
            hint={
              confirmPasswordMatch
                ? null
                : 'Re-enter the same password.'
            }
          >
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={isSubmitting}
              placeholder="Confirm your password"
              className={`${inputBase} pr-10 ${
                confirmPasswordError
                  ? inputError
                  : confirmPasswordMatch
                    ? 'border-green-300 bg-green-50 focus:border-green-400 focus:ring-2 focus:ring-green-100'
                    : inputNormal
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((p) => !p)
              }
              tabIndex={-1}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={
                showConfirmPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              <TIcon
                name={
                  showConfirmPassword
                    ? 'eye-off'
                    : 'eye'
                }
                size={16}
              />
            </button>
          </Field>

          {/* Live password match message */}
          {confirmPasswordMatch && (
            <p className="-mt-2 flex items-center gap-1.5 text-[12px] text-green-600">
              <TIcon
                name="circle-check"
                size={13}
                className="shrink-0"
              />
              Passwords match.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              relative mt-1 w-full overflow-hidden rounded-xl bg-slate-900 px-4 py-2.5
              text-[14px] font-semibold text-white
              transition-all duration-150
              hover:bg-slate-800 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-60
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500
            "
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white/70"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>

                Creating account…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create account
                <TIcon name="arrow-right" size={15} />
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="text-[12px] text-slate-400">
            already have an account?
          </span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Login CTA */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          disabled={isSubmitting}
          className="
            w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5
            text-[14px] font-medium text-slate-700
            transition-all duration-150 hover:border-slate-300 hover:bg-slate-50
            active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          Sign in
        </button>
      </div>
    </div>
  );
}