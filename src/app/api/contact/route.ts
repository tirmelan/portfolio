import { Resend } from "resend";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { navn, epost, melding } = await request.json();

  if (!navn || !epost || !melding) {
    return Response.json({ error: "Alle felt må fylles ut." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Kontaktskjema <onboarding@resend.dev>",
      to: "tirmelan@gmail.com",
      replyTo: epost,
      subject: `Ny melding fra ${escapeHtml(navn)}`,
      html: `<p><strong>Fra:</strong> ${escapeHtml(navn)}</p><p><strong>E-post:</strong> ${escapeHtml(epost)}</p><br><p>${escapeHtml(melding).replace(/\n/g, "<br>")}</p>`,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Kunne ikke sende e-post." }, { status: 500 });
  }
}
