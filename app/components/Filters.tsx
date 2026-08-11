type FiltersProps = {
  q?: string;
  purpose?: string;
  type?: string;
  maxPrice?: string;
};

export default function Filters({ q, purpose, type, maxPrice }: FiltersProps) {
  return (
    <form
      method="get"
      className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="lg:col-span-2">
        <label htmlFor="q" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Destination
        </label>
        <input
          id="q"
          name="q"
          type="text"
          placeholder="City or country"
          defaultValue={q}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="purpose" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Trip type
        </label>
        <select
          id="purpose"
          name="purpose"
          defaultValue={purpose ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Vacation or Work</option>
          <option value="VACATION">Vacation</option>
          <option value="WORK">Work</option>
        </select>
      </div>
      <div>
        <label htmlFor="type" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Stay type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={type ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Hotel or House</option>
          <option value="HOTEL">Hotel</option>
          <option value="HOUSE">House</option>
        </select>
      </div>
      <div>
        <label htmlFor="maxPrice" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Max price / night
        </label>
        <select
          id="maxPrice"
          name="maxPrice"
          defaultValue={maxPrice ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Any price</option>
          <option value="100">Up to $100</option>
          <option value="200">Up to $200</option>
          <option value="300">Up to $300</option>
          <option value="500">Up to $500</option>
        </select>
      </div>
      <div className="flex items-end lg:col-span-5">
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Search
        </button>
      </div>
    </form>
  );
}
