import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 }
    );
  }

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!resend || !toEmail) {
    console.error("Contact form submitted but RESEND_API_KEY/CONTACT_TO_EMAIL is not configured.");
    return NextResponse.json(
      { error: "Contact form is not configured yet. Please email directly." },
      { status: 503 }
    );
  }

  const { name, email, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: toEmail,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, "<br />")}</p>`,
  });

  if (error) {
    console.error("Resend send failed:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
