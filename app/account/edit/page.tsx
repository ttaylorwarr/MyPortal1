import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfileForm from "../ProfileForm";
import PasswordForm from "../PasswordForm";

export default async function EditAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/edit");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Edit account</h1>
        <Link href="/account" className="text-sm font-medium text-blue-700 hover:underline">
          Back to my account
        </Link>
      </div>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Profile</h2>
          <p className="mt-1 text-sm text-slate-500">Update your name, username, or email.</p>
          <div className="mt-4">
            <ProfileForm
              firstName={user.firstName}
              lastName={user.lastName}
              username={user.username}
              email={user.email}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Password</h2>
          <p className="mt-1 text-sm text-slate-500">Change your account password.</p>
          <div className="mt-4">
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
