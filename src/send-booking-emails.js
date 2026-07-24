// Vercel serverless function: POST /api/send-booking-emails
// Sends two emails through Resend (resend.com) whenever a lesson is booked:
//   1. A confirmation to the customer
//   2. A notification to the business owner
//
// Required Vercel environment variables (Settings -> Environment Variables):
//   RESEND_API_KEY            - your Resend API key
//   OWNER_NOTIFICATION_EMAIL  - the email address that should get booking alerts
//   BOOKING_FROM_EMAIL        - optional; the "from" address emails are sent as
//                               (defaults to Resend's shared test address, which
//                               can only deliver to your OWN Resend account email
//                               until you verify your domain — see the note below)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  const fromAddress = process.env.BOOKING_FROM_EMAIL || "PassDrivingTest.ie <onboarding@resend.dev>";

  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured yet (missing RESEND_API_KEY)." });
  }

  const { fullName, email, phone, lessonLabel, price, dateLabel, timeLabel } = req.body || {};
  if (!fullName || !email || !lessonLabel || !dateLabel || !timeLabel) {
    return res.status(400).json({ error: "Missing booking details." });
  }

  const customerHtml = `
    <p>Hi ${fullName},</p>
    <p>Your <b>${lessonLabel}</b> lesson is booked for <b>${dateLabel} at ${timeLabel}</b>.</p>
    <p>Fee: ${price || "—"}</p>
    <p>If anything needs to change, just reply to this email.</p>
    <p>See you then!<br/>PassDrivingTest.ie</p>
  `;

  const ownerHtml = `
    <p>New lesson booking:</p>
    <ul>
      <li><b>Name:</b> ${fullName}</li>
      <li><b>Email:</b> ${email}</li>
      <li><b>Phone:</b> ${phone || "—"}</li>
      <li><b>Lesson:</b> ${lessonLabel} (${price || "—"})</li>
      <li><b>When:</b> ${dateLabel} at ${timeLabel}</li>
    </ul>
  `;

  const send = (to, subject, html) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddress, to, subject, html }),
    });

  try {
    const tasks = [send(email, "Your driving lesson is booked!", customerHtml)];
    if (ownerEmail) {
      tasks.push(send(ownerEmail, `New lesson booking — ${fullName}`, ownerHtml));
    }
    const results = await Promise.all(tasks);
    const failed = results.filter(r => !r.ok);
    if (failed.length > 0) {
      return res.status(207).json({ ok: false, note: "Some emails may not have sent — check Resend's dashboard logs." });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Failed to send confirmation emails." });
  }
}
