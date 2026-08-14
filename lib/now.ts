const BUSINESS_TIMEZONE = "America/New_York";

/**
 * A Date whose local getters (getFullYear/getMonth/getDate/getDay) reflect the
 * current wall-clock date in BUSINESS_TIMEZONE, regardless of the server's own
 * timezone (Vercel runs in UTC, which rolls over to the next calendar day while
 * it's still "today" in the US).
 */
export function businessNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") === 24 ? 0 : get("hour"),
    get("minute"),
    get("second")
  );
}
