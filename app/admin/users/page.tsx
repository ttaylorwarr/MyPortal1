import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DeleteUserButton from "./DeleteUserButton";

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
    error?: string;
    invited?: string;
    hireName?: string;
  }>;
}) {
  const [me, { saved, deleted, error, invited, hireName }] = await Promise.all([
    requireAdmin(),
    searchParams,
  ]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Users ({users.length})</h2>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add user
        </Link>
      </div>

      {invited && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <p className="font-semibold">
            Account created{hireName ? ` for ${hireName}` : ""}. Give them this Safe-Code so they
            can activate their account at /activate and set their own password:
          </p>
          <p className="mt-2 font-mono text-lg font-bold tracking-widest">{invited}</p>
          <p className="mt-1 text-xs text-blue-700">
            This code won&apos;t be shown again here, but you can still find it on their edit page
            until they activate.
          </p>
        </div>
      )}
      {saved && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Account updated.
        </div>
      )}
      {deleted && (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Account deleted.
        </div>
      )}
      {error === "self-delete" && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          You can&apos;t delete your own account while logged in as it.
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === me.id;
              return (
                <tr key={user.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {user.firstName} {user.lastName}{" "}
                    {isSelf && <span className="text-xs text-slate-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.username}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Edit
                      </Link>
                      {!isSelf && (
                        <DeleteUserButton userId={user.id} name={`${user.firstName} ${user.lastName}`} />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {roleLabel.ADMIN}: full access, including managing users. {roleLabel.MANAGER}: can manage
        listings and view bookings. {roleLabel.MEMBER}: regular guest account. New Manager/Member
        accounts start pending until the person activates with their Safe-Code at /activate.
      </p>
    </div>
  );
}
