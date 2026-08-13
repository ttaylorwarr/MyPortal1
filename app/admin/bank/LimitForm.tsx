"use client";

import { useActionState } from "react";
import { updateCardLimitAction, type CardLimitFormState } from "@/app/actions/bank";

export default function LimitForm({ cardId, creditLimit }: { cardId: string; creditLimit: number | null }) {
  const [state, formAction, pending] = useActionState<CardLimitFormState, FormData>(
    updateCardLimitAction,
    undefined
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="cardId" value={cardId} />
      <span className="text-slate-400">$</span>
      <input
        type="number"
        name="creditLimit"
        min="0"
        step="1"
        defaultValue={creditLimit ?? 0}
        className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state?.error && <span className="text-xs font-medium text-red-600">{state.error}</span>}
    </form>
  );
}
