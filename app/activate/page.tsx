import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ActivateForm from "./ActivateForm";

export default async function ActivatePage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Activate your account</h1>
      <p className="mt-1 text-sm text-slate-600">
        Enter the Safe-Code your admin gave you and choose your own password.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ActivateForm />
      </div>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already activated?{" "}
        <Link href="/login" className="font-semibold text-blue-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
