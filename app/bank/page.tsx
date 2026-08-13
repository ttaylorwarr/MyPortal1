import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applyCardAction } from "@/app/actions/bank";
import CardBadge from "@/app/components/CardBadge";

export default async function BankPage({
  searchParams,
}: {
  searchParams: Promise<{ applied?: string }>;
}) {
  const [user, { applied }] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user) redirect("/login?next=/bank");

  const card = await prisma.creditCard.findUnique({ where: { userId: user.id } });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Bank</h1>
      <p className="mt-1 text-slate-600">Apply for a TroysSafes credit card.</p>

      {applied && (
        <div className="mt-6 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Application submitted.
        </div>
      )}

      <div className="mt-6">
        {!card && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            <p>You don&apos;t have a card yet.</p>
            <form action={applyCardAction} className="mt-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Apply for a card
              </button>
            </form>
          </div>
        )}

        {card?.status === "PENDING" && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center">
            <p className="font-semibold text-amber-800">Application pending approval.</p>
            <p className="mt-1 text-sm text-amber-700">An admin will review your request.</p>
          </div>
        )}

        {card?.status === "REJECTED" && (
          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
            <p className="font-semibold">Your application was declined.</p>
            <form action={applyCardAction} className="mt-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Apply again
              </button>
            </form>
          </div>
        )}

        {card?.status === "APPROVED" && card.cardNumber && card.pin && (
          <CardBadge
            cardNumber={card.cardNumber}
            pin={card.pin}
            creditLimit={card.creditLimit}
            isFrozen={card.isFrozen}
          />
        )}
      </div>
    </div>
  );
}
