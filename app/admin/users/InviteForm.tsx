"use client";

import { useActionState, useRef } from "react";
import { createInviteAction, type UserFormState } from "@/app/actions/users";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 10;

function randomCode() {
  let code = "";
  const values = new Uint32Array(CODE_LENGTH);
  crypto.getRandomValues(values);
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[values[i] % ALPHABET.length];
  }
  return code;
}

export default function InviteForm() {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    createInviteAction,
    undefined
  );
  const safeCodeRef = useRef<HTMLInputElement>(null);

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
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="MEMBER"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="MEMBER">Member</option>
        </select>
      </div>

      <div>
        <label htmlFor="hourlyPayRate" className="block text-sm font-medium text-slate-700">
          Hourly pay rate ($)
        </label>
        <input
          id="hourlyPayRate"
          name="hourlyPayRate"
          type="number"
          min={0}
          step="0.01"
          placeholder="Optional"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="safeCode" className="block text-sm font-medium text-slate-700">
          Safe-Code
        </label>
        <div className="mt-1 flex gap-2">
          <input
            ref={safeCodeRef}
            id="safeCode"
            name="safeCode"
            type="text"
            required
            minLength={4}
            maxLength={20}
            defaultValue={randomCode()}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              if (safeCodeRef.current) safeCodeRef.current.value = randomCode();
            }}
            className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            New code
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          We generated this for you — give it to the new hire so they can activate their account
          at /activate. You can also type your own code instead.
        </p>
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
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
