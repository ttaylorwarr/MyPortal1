"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

export default function CardBadge({
  cardNumber,
  pin,
  creditLimit,
  isFrozen,
}: {
  cardNumber: string;
  pin: string;
  creditLimit: number | null;
  isFrozen: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const formattedNumber = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-sm ${
        isFrozen ? "bg-gradient-to-br from-slate-500 to-slate-700" : "bg-gradient-to-br from-blue-600 to-blue-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide text-white/80">TroysSafes Bank</span>
        {isFrozen && (
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            ❄️ Frozen
          </span>
        )}
      </div>

      <p className="mt-6 font-mono text-xl font-bold tracking-widest sm:text-2xl">{formattedNumber}</p>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">PIN</p>
          <p className="font-mono text-lg font-semibold tracking-widest">{pin}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">Credit limit</p>
          <p className="text-lg font-semibold">{creditLimit != null ? formatPrice(creditLimit) : "—"}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          {copied ? "Copied!" : "Copy number"}
        </button>
      </div>
    </div>
  );
}
