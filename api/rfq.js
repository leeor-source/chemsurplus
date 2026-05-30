/* POST /api/rfq  — submit a quote request (persists + emails the brokers/inbox).
   GET  /api/rfq  — list recent RFQs (demo/admin). */
import { addRfq, listRfqs } from "./_store.js";
import { sendEmail } from "./_email.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    return res.status(200).json({ items: await listRfqs() });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (!b.company || !b.email || !b.location) {
    return res.status(400).json({ error: "company, email and location are required" });
  }

  const ref = "RFQ-" + Date.now().toString(36).toUpperCase().slice(-6);
  const rec = {
    ref, company: b.company, email: b.email, location: b.location,
    timeline: b.timeline || "", notes: b.notes || "", lots: Array.isArray(b.lots) ? b.lots : [],
    created: new Date().toISOString()
  };
  await addRfq(rec);

  const lotsHtml = rec.lots.length ? rec.lots.join(", ") : "(none specified)";
  const to = process.env.RFQ_INBOX || rec.email;
  await sendEmail({
    to,
    subject: `New RFQ ${ref} from ${rec.company}`,
    html: `<h2>New RFQ ${ref}</h2>
      <p><b>Company:</b> ${rec.company}<br>
      <b>Email:</b> ${rec.email}<br>
      <b>Delivery:</b> ${rec.location}<br>
      <b>Quantity/timeline:</b> ${rec.timeline || "-"}<br>
      <b>Notes:</b> ${rec.notes || "-"}</p>
      <p><b>Lots requested:</b> ${lotsHtml}</p>`
  });

  return res.status(200).json({ ok: true, ref });
}
