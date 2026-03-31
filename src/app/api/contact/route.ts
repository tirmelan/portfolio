import { Resend } from "resend";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { navn, epost, melding } = await request.json();

  if (!navn || !epost || !melding) {
    return Response.json({ error: "Alle felt må fylles ut." }, { status: 400 });
  }

  await resend.emails.send({
    from: "Kontaktskjema <onboarding@resend.dev>",
    to: "tirmelan@gmail.com",
    replyTo: epost,
    subject: `Ny melding fra ${navn}`,
    html: `<p><strong>Fra:</strong> ${navn}</p><p><strong>E-post:</strong> ${epost}</p><br><p>${melding.replace(/\n/g, "<br>")}</p>`,
  });

  return Response.json({ ok: true });
}
