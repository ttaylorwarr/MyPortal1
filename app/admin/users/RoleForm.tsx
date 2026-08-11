"use client";

import { useActionState } from "react";
import { updateUserRoleAction, type UserFormState } from "@/app/actions/users";

export default function RoleForm({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: string;
  isSelf: boolean;
}) {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    updateUserRoleAction,
    undefined
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={role}
        disabled={isSelf}
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
      >
        <option value="ADMIN">Admin</option>
        <option value="MANAGER">Manager</option>
        <option value="MEMBER">Member</option>
      </select>
      {!isSelf && (
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      )}
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
