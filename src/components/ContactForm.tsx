"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ navn: "", epost: "", melding: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("sent");
      setForm({ navn: "", epost: "", melding: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="bg-rosa px-6 py-16 md:py-24">
      <div className="bg-mellombla max-w-[777px] mx-auto px-10 md:px-16 py-12 md:py-16">
        <h2 className="font-serif text-[40px] md:text-[50px] leading-normal text-bla text-center mb-12">
          Hei der! Kom i kontakt
        </h2>

        {status === "sent" ? (
          <p className="font-sans text-bla text-[20px] leading-[28px] text-center py-8">
            Takk! Meldingen din er sendt.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-0">
            {/* Navn */}
            <div className="flex items-end gap-2 border-b border-bla pb-3 mb-6">
              <label
                htmlFor="navn"
                className="font-sans font-semibold text-bla text-[20px] leading-[28px] shrink-0"
              >
                Navn:
              </label>
              <input
                id="navn"
                type="text"
                placeholder="Fornavn etternavn"
                value={form.navn}
                onChange={(e) => setForm({ ...form, navn: e.target.value })}
                required
                className="flex-1 bg-transparent font-sans text-bla text-[20px] leading-[28px] placeholder:text-bla/50 outline-none"
              />
            </div>

            {/* E-post */}
            <div className="flex items-center gap-2 border-b border-bla pb-3 mb-6">
              <label
                htmlFor="epost"
                className="font-sans font-semibold text-bla text-[20px] leading-[28px] shrink-0"
              >
                E-post:
              </label>
              <input
                id="epost"
                type="email"
                placeholder="eksempel@gmail.com"
                value={form.epost}
                onChange={(e) => setForm({ ...form, epost: e.target.value })}
                required
                className="flex-1 bg-transparent font-sans text-bla text-[20px] leading-[28px] placeholder:text-bla/50 outline-none"
              />
            </div>

            {/* Melding */}
            <div className="flex items-start gap-2 border-b border-bla pb-3 mb-10">
              <label
                htmlFor="melding"
                className="font-sans font-semibold text-bla text-[20px] leading-[28px] shrink-0 pt-0"
              >
                Melding:
              </label>
              <textarea
                id="melding"
                placeholder="Her kan du skrive nøyaktig det du vil!"
                value={form.melding}
                onChange={(e) => setForm({ ...form, melding: e.target.value })}
                required
                rows={4}
                className="flex-1 bg-transparent font-sans text-bla text-[20px] leading-[28px] placeholder:text-bla/50 outline-none resize-none"
              />
            </div>

            {status === "error" && (
              <p className="font-sans text-bla text-[16px] mb-4 opacity-70">
                Noe gikk galt. Prøv igjen eller send e-post direkte til tirmelan@gmail.com.
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={status === "sending"}
                className="font-sans font-semibold text-bla text-[20px] leading-[28px] border border-bla px-8 py-3 hover:bg-bla hover:text-rosa transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sender..." : "Send melding"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
