/* ChemSurplus API — email via Resend REST (no SDK).
   If RESEND_API_KEY isn't set, it no-ops gracefully (logs) so the API still works. */
export async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RFQ_FROM || "ChemSurplus <onboarding@resend.dev>";
  if (!key) { console.log("[email disabled] would send:", subject, "->", to); return { skipped: true }; }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html })
    });
    return await r.json();
  } catch (e) {
    console.error("email error", e);
    return { error: String(e) };
  }
}
