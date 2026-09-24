export default async (req) => {
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let fields;
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      fields = await req.json();
    } else {
      fields = Object.fromEntries(new URLSearchParams(await req.text()));
    }
  } catch {
    return json(400, { ok: false, error: "Invalid request body" });
  }

  const name = String(fields.name ?? "").trim().slice(0, 200);
  const email = String(fields.email ?? "").trim().slice(0, 200);
  const interest = String(fields.interest ?? "hybrid").trim();
  const note = String(fields.note ?? "").trim().slice(0, 2000);
  const honeypot = String(fields["bot-field"] ?? "").trim();

  // Honeypot tripped: pretend success, do nothing.
  if (honeypot) {
    return json(200, { ok: true });
  }

  if (!name) {
    return json(422, { ok: false, error: "Name is required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(422, { ok: false, error: "A valid email is required" });
  }
  const interestLabels = {
    hybrid: "Hybrid / either track",
    software: "Software / product",
    marketing: "Growth / marketing",
  };
  if (!(interest in interestLabels)) {
    return json(422, { ok: false, error: "Invalid interest" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "contact.shaheenaladwani@gmail.com";
  if (!apiKey) {
    return json(500, { ok: false, error: "RESEND_API_KEY is not configured" });
  }

  const interestLabel = interestLabels[interest];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Portfolio: ${name} (${interestLabel})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Hiring for: ${interestLabel}`,
        "",
        note ? `Note:\n${note}` : "No note provided.",
        "",
        "— sent from the shaheen.works contact form",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`Resend error ${res.status}: ${detail}`);
    return json(502, { ok: false, error: "Email delivery failed" });
  }

  // Native form post (no JS): redirect back to the contact section.
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    return Response.redirect(new URL("/#contact", req.url), 303);
  }

  return json(200, { ok: true });
};

export const config = { path: "/api/contact" };

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}