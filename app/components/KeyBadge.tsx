"use client";

import { useState } from "react";

export default function KeyBadge({ keyCode }: { keyCode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(keyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3">
      <span className="text-xl">🔑</span>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Your digital key</p>
        <p className="font-mono text-lg font-bold tracking-wider text-blue-900">{keyCode}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
