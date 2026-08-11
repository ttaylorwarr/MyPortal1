"use client";

import { deletePropertyAction } from "@/app/actions/admin";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePropertyAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This also deletes its bookings.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        Delete listing
      </button>
    </form>
  );
}
