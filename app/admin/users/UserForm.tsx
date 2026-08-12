"use client";

import { useActionState } from "react";
import type { UserFormState } from "@/app/actions/users";

type UserDefaults = {
  id?: string;
  name: string;
  username: string;
  email: string;
  role: string;
};

type UserFormProps = {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  defaults?: UserDefaults;
  submitLabel: string;
  showPassword: boolean;
};

const emptyDefaults: UserDefaults = {
  name: "",
  username: "",
  email: "",
  role: "MEMBER",
};

export default function UserForm({ action, defaults, submitLabel, showPassword }: UserFormProps) {
  const values = defaults ?? emptyDefaults;
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {values.id && <input type="hidden" name="userId" value={values.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={values.name}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
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
          defaultValue={values.username}
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
          defaultValue={values.email}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {showPassword && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">At least 6 characters.</p>
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue={values.role}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="MEMBER">Member</option>
        </select>
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
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
