/* POST /api/ingest - a broker pushes an inventory feed; lots are normalized,
   stamped with supplier=<broker>, and aggregated into the catalog store.
   Body: { broker: "altiras", lots: [ { name, cat, cas, qty, pkg, condition, docs[], industries[] }, ... ] } */
import { addListing, listListings } from "./_store.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method === "GET") return res.status(200).json({ items: await listListings() });
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (!b.broker || !Array.isArray(b.lots)) {
    return res.status(400).json({ error: "broker and lots[] are required" });
  }

  let n = 0;
  for (const lot of b.lots) {
    if (!lot || !lot.name || !lot.cat) continue;
    await addListing({
      id: lot.id || ("L-" + Date.now().toString(36).toUpperCase().slice(-5) + n),
      name: lot.name, cat: lot.cat, cas: lot.cas || "—", grade: lot.grade || "Industrial",
      qty: lot.qty || "", pkg: lot.pkg || "Drums", condition: lot.condition || "Overstock",
      region: lot.region || "", unit: lot.unit || "/ kg",
      docs: lot.docs || ["SDS"], dated: lot.dated || "No expiry",
      supplier: b.broker, industries: lot.industries || [],
      status: "Aggregated", synced: new Date().toISOString()
    });
    n++;
  }
  return res.status(200).json({ ok: true, broker: b.broker, ingested: n });
}
