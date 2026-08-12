"use client";

import { useActionState } from "react";
import { activateAccountAction, type ActivateFormState } from "@/app/actions/activate";

export default function ActivateForm() {
  const [state, formAction, pending] = useActionState<ActivateFormState, FormData>(
    activateAccountAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="safeCode" className="block text-sm font-medium text-slate-700">
          Safe-Code
        </label>
        <input
          id="safeCode"
          name="safeCode"
          type="text"
          required
          autoComplete="off"
          placeholder="e.g. 7XK4M9P2QT"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">The code your admin gave you when you were hired.</p>
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
          Choose a password
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
          Confirm password
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
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Activating…" : "Activate account"}
      </button>
    </form>
  );
}
