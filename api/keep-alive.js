// Vercel serverless function: GET /api/keep-alive
// Its only job is to touch the Supabase database with a tiny, harmless
// query. Supabase's free tier pauses a project after 7 days with no
// database activity — this runs on a daily schedule (see vercel.json)
// so that never happens. It changes nothing in your data.

export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ ok: false, error: "Supabase env vars not configured" });
  }

  try {
    const resp = await fetch(`${url}/rest/v1/app_settings?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const ok = resp.ok;
    return res.status(ok ? 200 : 502).json({ ok, status: resp.status, pinged_at: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Ping failed" });
  }
}
