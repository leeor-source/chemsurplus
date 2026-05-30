/* GET /api/health — liveness check */
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    ok: true,
    service: "chemsurplus-api",
    email: process.env.RESEND_API_KEY ? "configured" : "disabled",
    store: process.env.KV_REST_API_URL ? "kv" : "memory",
    time: new Date().toISOString()
  });
}
