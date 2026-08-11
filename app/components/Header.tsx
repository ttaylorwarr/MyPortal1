import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="TroysSafes" width={170} height={41} priority />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-blue-700">
            Browse
          </Link>
          {user ? (
            <>
              <Link href="/account" className="hover:text-blue-700">
                My account
              </Link>
              {user.isAdmin && (
                <Link href="/admin" className="hover:text-blue-700">
                  Admin
                </Link>
              )}
              <span className="hidden text-slate-400 sm:inline">|</span>
              <span className="hidden text-slate-500 sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-700">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
