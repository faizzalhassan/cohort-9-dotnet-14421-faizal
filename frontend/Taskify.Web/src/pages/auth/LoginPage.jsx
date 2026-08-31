import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const initialForm = { email: '', password: '' };

function validateForm(form) {
  const errors = {};
  const email = form.email.trim();

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({ id, label, icon, error, children }) {
  return (
    <div className="space-y-1.5">
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
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]: value,
    }));

    setErrors((p) => ({
      ...p,
      [name]: '',
    }));

    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });

      if (!response?.success) {
        setServerError(
          response?.message ||
            'Unable to sign in. Please check your credentials.'
        );
        setIsSubmitting(false);
        return;
      }

      /* ─────────────────────────────────────────────────────────────
         Determine role from login response
         ───────────────────────────────────────────────────────────── */
      const userData = response.data?.user;

      let isAdmin = false;

      if (userData) {
        isAdmin =
          userData.role === 'Admin' ||
          userData.role === 'admin';
      } else {
        // Fallback: check admin email
        const email = form.email.trim().toLowerCase();
        isAdmin = email === 'admin@gmail.com';
      }

      /* ─────────────────────────────────────────────────────────────
         Redirect based on role
         ───────────────────────────────────────────────────────────── */
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/tasks', { replace: true });
      }
    } catch (error) {
      const response = error?.response;
      const data = response?.data;

      if (response?.status === 401) {
        setServerError(
          data?.message || 'Invalid email or password.'
        );
      } else if (response?.status === 400) {
        setServerError(
          data?.message ||
            'Please correct the highlighted fields.'
        );

        if (data?.errors) {
          setErrors(data.errors);
        }
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
            Welcome back
          </h1>

          <p className="mt-1.5 text-[14px] text-slate-500">
            Sign in to pick up where you left off.
          </p>
        </div>

        {/* Server error */}
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

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Email */}
          <Field
            id="email"
            label="Email address"
            icon="mail"
            error={errors.email}
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
            error={errors.password}
          >
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={isSubmitting}
              placeholder="••••••••"
              className={`${inputBase} pr-10 ${
                errors.password ? inputError : inputNormal
              }`}
            />

            {/* Show / hide password */}
            <button
              type="button"
              onClick={() =>
                setShowPassword((p) => !p)
              }
              tabIndex={-1}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-slate-600"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              <TIcon
                name={showPassword ? 'eye-off' : 'eye'}
                size={16}
              />
            </button>
          </Field>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-[12.5px] font-medium text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Forgot password?
            </button>
          </div>

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

                Signing in…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign in
                <TIcon name="arrow-right" size={15} />
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="text-[12px] text-slate-400">
            no account yet?
          </span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Register CTA */}
        <button
          type="button"
          onClick={() => navigate('/register')}
          disabled={isSubmitting}
          className="
            w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5
            text-[14px] font-medium text-slate-700
            transition-all duration-150 hover:border-slate-300 hover:bg-slate-50
            active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          Create an account
        </button>
      </div>
    </div>
  );
}