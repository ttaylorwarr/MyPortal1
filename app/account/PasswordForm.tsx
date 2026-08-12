"use client";

import { useActionState } from "react";
import { changePasswordAction, type AccountFormState } from "@/app/actions/account";

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    changePasswordAction,
    undefined
  );

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">At least 6 characters.</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
