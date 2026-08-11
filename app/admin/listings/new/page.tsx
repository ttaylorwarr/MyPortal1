import { createPropertyAction } from "@/app/actions/admin";
import PropertyForm from "@/app/admin/listings/PropertyForm";

export default function NewListingPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold text-slate-900">Add a listing</h2>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <PropertyForm action={createPropertyAction} submitLabel="Create listing" />
      </div>
    </div>
  );
}
