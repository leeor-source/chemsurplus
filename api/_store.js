/* ChemSurplus API — storage abstraction.
   Uses Vercel KV when configured (KV_REST_API_URL/TOKEN), else an in-memory
   fallback (ephemeral per warm instance — fine for demos; add KV for real persistence). */

let mem = { rfqs: [], listings: [] };

async function kv() {
  if (!process.env.KV_REST_API_URL) return null;
  try { const m = await import("@vercel/kv"); return m.kv; } catch { return null; }
}

export async function addRfq(rec) {
  const k = await kv();
  if (k) await k.lpush("cs:rfqs", JSON.stringify(rec));
  else mem.rfqs.unshift(rec);
  return rec;
}
export async function listRfqs(limit = 100) {
  const k = await kv();
  if (k) return (await k.lrange("cs:rfqs", 0, limit - 1)).map((x) => JSON.parse(x));
  return mem.rfqs.slice(0, limit);
}
export async function addListing(rec) {
  const k = await kv();
  if (k) await k.lpush("cs:listings", JSON.stringify(rec));
  else mem.listings.unshift(rec);
  return rec;
}
export async function listListings(limit = 500) {
  const k = await kv();
  if (k) return (await k.lrange("cs:listings", 0, limit - 1)).map((x) => JSON.parse(x));
  return mem.listings.slice(0, limit);
}
