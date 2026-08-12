import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateUserAction } from "@/app/actions/users";
import UserForm from "../../UserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Edit {user.firstName} {user.lastName}
        </h2>
        <Link href="/admin/users" className="text-sm font-medium text-blue-700 hover:underline">
          Back to users
        </Link>
      </div>

      {!user.passwordHash && user.safeCode && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This account hasn&apos;t been activated yet. Safe-Code:{" "}
          <span className="font-mono font-semibold tracking-widest">{user.safeCode}</span>
        </div>
      )}

      <div className="mt-4">
        <UserForm
          action={updateUserAction}
          defaults={{
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            hourlyPayRate: user.hourlyPayRate,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
