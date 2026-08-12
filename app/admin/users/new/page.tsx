import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import InviteForm from "../InviteForm";

export default async function NewUserPage() {
  await requireAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Add user</h2>
        <Link href="/admin/users" className="text-sm font-medium text-blue-700 hover:underline">
          Back to users
        </Link>
      </div>
      <div className="mt-4">
        <InviteForm />
      </div>
    </div>
  );
}
