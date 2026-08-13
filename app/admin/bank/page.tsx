import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { approveCardAction, rejectCardAction, toggleFreezeAction } from "@/app/actions/bank";
import LimitForm from "./LimitForm";

const statusBadgeClass: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-slate-200 text-slate-600",
};

export default async function AdminBankPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; rejected?: string; updated?: string }>;
}) {
  const [, { approved, rejected, updated }] = await Promise.all([requireAdmin(), searchParams]);

  const cards = await prisma.creditCard.findMany({
    include: { user: true },
    orderBy: { requestedAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Bank ({cards.length})</h2>

      {approved && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Card approved.
        </div>
      )}
      {rejected && (
        <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Application declined.
        </div>
      )}
      {updated && (
        <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Card updated.
        </div>
      )}

      {cards.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
          No card applications yet.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {cards.map((card) => (
            <div key={card.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {card.user.firstName} {card.user.lastName}
                  </p>
                  <p className="text-sm text-slate-500">@{card.user.username}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass[card.status]}`}>
                  {card.status === "APPROVED" && card.isFrozen ? "Frozen" : card.status}
                </span>
              </div>

              {card.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <form action={approveCardAction}>
                    <input type="hidden" name="cardId" value={card.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectCardAction}>
                    <input type="hidden" name="cardId" value={card.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              )}

              {card.status === "APPROVED" && card.cardNumber && card.pin && (
                <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Card number</p>
                    <p className="font-mono font-semibold text-slate-900">{card.cardNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">PIN</p>
                    <p className="font-mono font-semibold text-slate-900">{card.pin}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Limit</p>
                    <LimitForm cardId={card.id} creditLimit={card.creditLimit} />
                  </div>
                  <div className="ml-auto">
                    <form action={toggleFreezeAction}>
                      <input type="hidden" name="cardId" value={card.id} />
                      <button
                        type="submit"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          card.isFrozen
                            ? "border-blue-300 text-blue-700 hover:bg-blue-50"
                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {card.isFrozen ? "Unfreeze" : "Freeze"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
