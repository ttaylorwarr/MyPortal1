"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

type MobileUser = {
  firstName: string;
  role: "ADMIN" | "MANAGER" | "MEMBER" | "EMPLOYEE";
} | null;

const linkClass = "rounded-lg px-3 py-2 hover:bg-slate-100";
const sectionHeadingClass = "px-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400";
const sectionListClass = "mt-1 overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100";
const rowLinkClass = "flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50";

function RowLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className={rowLinkClass}>
      {children}
      <span className="text-slate-300">›</span>
    </Link>
  );
}

export default function MobileMenu({ user }: { user: MobileUser }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const isStaff = user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "EMPLOYEE";
  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

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
            <div className="absolute inset-0 bg-black/30" onClick={close} />
            <div className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1 text-sm font-medium text-slate-700">
                <Link href="/" onClick={close} className={linkClass}>
                  Home
                </Link>

                {user ? (
                  <>
                    <Link href="/account" onClick={close} className={linkClass}>
                      My account
                    </Link>
                    <Link href="/bank" onClick={close} className={linkClass}>
                      Bank
                    </Link>

                    {isStaff && (
                      <>
                        <p className={sectionHeadingClass}>Employee</p>
                        <div className={sectionListClass}>
                          <RowLink href="/employee" onClick={close}>
                            Schedule
                          </RowLink>
                          <RowLink href="/employee/timeclock" onClick={close}>
                            Time Clock
                          </RowLink>
                          <RowLink href="/employee/timesheet" onClick={close}>
                            Timesheet
                          </RowLink>
                        </div>
                      </>
                    )}

                    {isAdminOrManager && (
                      <>
                        <p className={sectionHeadingClass}>Admin</p>
                        <div className={sectionListClass}>
                          <RowLink href="/admin" onClick={close}>
                            Dashboard
                          </RowLink>
                          <RowLink href="/admin/listings" onClick={close}>
                            Listings
                          </RowLink>
                          <RowLink href="/admin/bookings" onClick={close}>
                            Bookings
                          </RowLink>
                          {user.role === "ADMIN" && (
                            <RowLink href="/admin/schedule" onClick={close}>
                              Manager Schedule
                            </RowLink>
                          )}
                          {user.role === "ADMIN" && (
                            <RowLink href="/admin/users" onClick={close}>
                              Users
                            </RowLink>
                          )}
                          {user.role === "ADMIN" && (
                            <RowLink href="/admin/bank" onClick={close}>
                              Bank
                            </RowLink>
                          )}
                        </div>
                      </>
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
                    onClick={close}
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
