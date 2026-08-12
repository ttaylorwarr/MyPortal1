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
        <h2 className="text-lg font-bold text-slate-900">Edit {user.name}</h2>
        <Link href="/admin/users" className="text-sm font-medium text-blue-700 hover:underline">
          Back to users
        </Link>
      </div>
      <div className="mt-4">
        <UserForm
          action={updateUserAction}
          defaults={{
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
          }}
          submitLabel="Save changes"
          showPassword={false}
        />
      </div>
    </div>
  );
}
