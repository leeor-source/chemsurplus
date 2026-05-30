/* GET  /api/listings        — seller-submitted listings (newest first)
   POST /api/listings        — create a listing (seller)
   The marketplace merges these on top of the seed catalog in assets/js/data.js. */
import { addListing, listListings } from "./_store.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    return res.status(200).json({ items: await listListings() });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (!b.name || !b.cat || !b.price) {
    return res.status(400).json({ error: "name, cat and price are required" });
  }
  const rec = {
    id: "L-" + Date.now().toString(36).toUpperCase().slice(-6),
    name: b.name, cat: b.cat, cas: b.cas || "—", grade: b.grade || "Industrial",
    qty: b.qty || "", pkg: b.pkg || "Drums", condition: b.condition || "Overstock",
    region: b.region || "", price: Number(b.price) || 0, list: (Number(b.price) || 0) * 1.8,
    unit: b.unit || "/ kg", docs: b.docs || ["SDS"], dated: b.dated || "No expiry",
    supplier: b.supplier || "", industries: b.industries || [], status: "Pending review",
    created: new Date().toISOString()
  };
  await addListing(rec);
  return res.status(200).json({ ok: true, id: rec.id });
}
