"use client";

import { deleteUserAction } from "@/app/actions/users";

export default function DeleteUserButton({ userId, name }: { userId: string; name: string }) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${name}'s account? This also deletes their bookings.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
