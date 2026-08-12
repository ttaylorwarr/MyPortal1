"use client";

import { useActionState } from "react";
import { updateProfileAction, type AccountFormState } from "@/app/actions/account";

export default function ProfileForm({
  firstName,
  lastName,
  username,
  email,
}: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    updateProfileAction,
    undefined
  );

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={firstName}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            defaultValue={lastName}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          defaultValue={username}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Letters, numbers, and underscores only. Used to sign in.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email}
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
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
