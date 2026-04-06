"use client";

import { useState } from "react";

export default function ContactFormProposal() {
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

    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <section className="px-6 md:px-[176px] py-[80px] md:py-[160px] flex flex-col items-center text-center gap-[24px]">
        <p className="font-serif text-[40px] md:text-[64px] leading-[1.1] text-bla">
          Takk for meldingen!
        </p>
        <p className="font-sans text-bla text-[20px] leading-[30px] max-w-[520px]">
          Jeg svarer deg så fort jeg kan, vanligvis innen et par dager.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ navn: "", epost: "", melding: "" }); }}
          className="font-sans text-bla text-[18px] leading-[28px] bg-mellombla rounded-full px-[28px] py-[12px] mt-[16px] hover:opacity-80 transition-opacity"
        >
          Send en ny melding
        </button>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-[176px] py-[60px] md:py-[106px]">
      <div className="flex flex-col md:flex-row md:gap-[284px] md:items-start gap-12">

        {/* Left: serif intro + contact info */}
        <div className="flex flex-col gap-[40px] md:w-[415px] shrink-0">
          <h2 className="font-serif text-[34px] md:text-[50px] leading-[1.15] text-bla">
            La oss komme i kontakt
          </h2>
          <p className="font-sans text-bla text-[20px] leading-[30px]">
            Jeg er alltid åpen for nye muligheter der jeg kan bidra og utvikle meg videre. Ta gjerne kontakt hvis du vil ta en prat.
          </p>
          <div className="flex flex-col gap-[10px]">
            <a
              href="mailto:tirmelan@gmail.com"
              className="font-sans text-bla text-[20px] leading-[28px] flex items-center gap-[10px] hover:opacity-60 transition-opacity"
            >
              <svg aria-hidden="true" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H19V15H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M1 1L10 9L19 1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              tirmelan@gmail.com
            </a>
            <a
              href="tel:+4790948095"
              className="font-sans text-bla text-[20px] leading-[28px] flex items-center gap-[10px] hover:opacity-60 transition-opacity"
            >
              <svg aria-hidden="true" width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 1H13C13.6 1 14 1.4 14 2V18C14 18.6 13.6 19 13 19H3C2.4 19 2 18.6 2 18V2C2 1.4 2.4 1 3 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <circle cx="8" cy="16" r="1" fill="currentColor"/>
              </svg>
              90 94 80 95
            </a>
            <a
              href="https://www.linkedin.com/in/tiril-johnslien-meland-819639249"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-bla text-[20px] leading-[28px] flex items-center gap-[10px] hover:opacity-60 transition-opacity"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 8V15M5 5.5V5.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M9 15V11C9 9.9 9.9 9 11 9C12.1 9 13 9.9 13 11V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 8V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full md:w-[677px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-0">

              {/* Navn */}
              <div className="flex flex-col gap-[8px] border-b border-bla pb-[20px] mb-[32px]">
                <label className="font-sans font-semibold text-bla text-[14px] leading-[20px] tracking-widest uppercase">
                  Navn
                </label>
                <input
                  type="text"
                  placeholder="Hva heter du?"
                  value={form.navn}
                  onChange={(e) => setForm({ ...form, navn: e.target.value })}
                  required
                  className="bg-transparent font-sans text-bla text-[20px] leading-[28px] placeholder:text-bla/30 outline-none w-full"
                />
              </div>

              {/* E-post */}
              <div className="flex flex-col gap-[8px] border-b border-bla pb-[20px] mb-[32px]">
                <label className="font-sans font-semibold text-bla text-[14px] leading-[20px] tracking-widest uppercase">
                  E-post
                </label>
                <input
                  type="email"
                  placeholder="eksempel@gmail.com"
                  value={form.epost}
                  onChange={(e) => setForm({ ...form, epost: e.target.value })}
                  required
                  className="bg-transparent font-sans text-bla text-[20px] leading-[28px] placeholder:text-bla/30 outline-none w-full"
                />
              </div>

              {/* Melding */}
              <div className="flex flex-col gap-[8px] border-b border-bla pb-[20px] mb-[48px]">
                <label className="font-sans font-semibold text-bla text-[14px] leading-[20px] tracking-widest uppercase">
                  Melding
                </label>
                <textarea
                  placeholder="Store og små tanker er like velkomne"
                  rows={5}
                  value={form.melding}
                  onChange={(e) => setForm({ ...form, melding: e.target.value })}
                  required
                  className="bg-transparent font-sans text-bla text-[20px] leading-[28px] placeholder:text-bla/30 outline-none resize-none w-full"
                />
              </div>

              {status === "error" && (
                <p className="font-sans text-bla text-[16px] leading-[24px] opacity-60 mb-4">
                  Noe gikk galt. Prøv igjen eller send e-post direkte.
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="font-sans font-medium text-[18px] leading-[28px] text-lys-bla bg-bla rounded-full px-[28px] py-[12px] hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  {status === "sending" ? "Sender..." : (
                    <>
                      Send melding
                      <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline ml-[9px]">
                        <path d="M1 6H17M12 1L17 6L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
        </div>

      </div>
    </section>
  );
}
