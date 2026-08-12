"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

type MobileUser = {
  firstName: string;
  role: "ADMIN" | "MANAGER" | "MEMBER" | "EMPLOYEE";
} | null;

export default function MobileMenu({ user }: { user: MobileUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-30">
            <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1 text-sm font-medium text-slate-700">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-slate-100"
                >
                  Home
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 hover:bg-slate-100"
                    >
                      My account
                    </Link>
                    {(user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE") && (
                      <Link
                        href="/employee"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 hover:bg-slate-100"
                      >
                        Employee
                      </Link>
                    )}
                    {(user.role === "ADMIN" || user.role === "MANAGER") && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 hover:bg-slate-100"
                      >
                        Admin
                      </Link>
                    )}
                    <div className="my-2 border-t border-slate-200" />
                    <p className="px-3 text-xs text-slate-500">Hi, {user.firstName}</p>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100"
                      >
                        Log out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    Log in
                  </Link>
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
