const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?shaheen\.works$/,
  /^https:\/\/[\w-]+\.netlify\.app$/, // site + deploy previews (deploy-preview-N--site)
  /^http:\/\/localhost(:\d+)?$/,
];

const interestLabels = {
  hybrid: "Hybrid / either track",
  software: "Software / product",
  marketing: "Growth / marketing",
};

export default async (req) => {
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  // Browsers always send Origin on cross-site POSTs; only accept our own pages.
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.some((re) => re.test(origin))) {
    return json(403, { ok: false, error: "Forbidden" });
  }

  // Native (no-JS) form posts accept HTML; reply with a redirect instead of JSON.
  const wantsHtml = (req.headers.get("accept") || "").includes("text/html");
  const fail = (status, error) =>
    wantsHtml ? redirect(req, "0") : json(status, { ok: false, error });

  let fields;
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      fields = await req.json();
    } else {
      fields = Object.fromEntries(new URLSearchParams(await req.text()));
    }
  } catch {
    return fail(400, "Invalid request body");
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return fail(400, "Invalid request body");
  }

  // Strip control characters (incl. CR/LF) so nothing can break the subject line.
  const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
  const name = clean(fields.name, 200);
  const email = clean(fields.email, 200);
  const interest = clean(fields.interest ?? "hybrid", 20) || "hybrid";
  const note = String(fields.note ?? "").trim().slice(0, 2000);
  const honeypot = String(fields["bot-field"] ?? "").trim();

  // Honeypot tripped: pretend success, do nothing.
  if (honeypot) {
    return wantsHtml ? redirect(req, "1") : json(200, { ok: true });
  }

  if (!name) {
    return fail(422, "Name is required");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail(422, "A valid email is required");
  }
  if (!Object.hasOwn(interestLabels, interest)) {
    return fail(422, "Invalid interest");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "contact.shaheenaladwani@gmail.com";
  const from = process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>";
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return fail(500, "Email delivery is not configured");
  }

  const interestLabel = interestLabels[interest];
  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
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
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error(`Resend request failed: ${err}`);
    return fail(502, "Email delivery failed");
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`Resend error ${res.status}: ${detail}`);
    return fail(502, "Email delivery failed");
  }

  return wantsHtml ? redirect(req, "1") : json(200, { ok: true });
};

export const config = { path: "/api/contact" };

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function redirect(req, sent) {
  return Response.redirect(new URL(`/?sent=${sent}#contact`, req.url), 303);
}
