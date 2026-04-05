"use client";

import { useState } from "react";

interface Kurs {
  tittel: string;
  leverandor?: string;
  ar?: string;
  varighet?: string;
  beskrivelse?: string;
}

interface KursAccordionProps {
  kurs: Kurs[];
}

function KursEntry({ item }: { item: Kurs }) {
  const meta = [item.leverandor, item.ar].filter(Boolean).join(" - ");
  const varighet = item.varighet ? `Varighet: ${item.varighet}` : null;

  return (
    <li className="flex flex-col">
      <p className="font-sans font-medium text-[22px] leading-[32px] text-bla">
        {item.tittel}
      </p>
      {(meta || varighet) && (
        <p className="font-sans text-[22px] leading-[32px] text-bla opacity-70">
          {meta && <em className="font-serif italic not-italic" style={{ fontFamily: "plantin, serif", fontStyle: "italic" }}>{item.leverandor}</em>}
          {meta && item.ar && <span> - {item.ar}</span>}
          {varighet && <span>{meta ? " | " : ""}{varighet}</span>}
        </p>
      )}
      {item.beskrivelse && (
        <p className="font-sans text-[20px] leading-[28px] text-bla opacity-60 mt-[4px]">
          {item.beskrivelse}
        </p>
      )}
    </li>
  );
}

export default function KursAccordion({ kurs }: KursAccordionProps) {
  const [open, setOpen] = useState(false);

  const half = Math.ceil(kurs.length / 2);
  const left = kurs.slice(0, half);
  const right = kurs.slice(half);

  return (
    <div>
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full border-t border-bla py-[60px] flex items-center justify-between hover:opacity-70 transition-opacity outline-none"
      >
        <span className="font-serif text-[40px] font-normal leading-none text-bla">
          Kurs
        </span>
        <span className="font-serif text-[28px] font-normal leading-none text-bla">
          {open ? "−" : "+"}
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="flex gap-[108px] pb-[60px]">
          <ul className="flex-1 flex flex-col gap-[40px]">
            {left.map((item, i) => (
              <KursEntry key={i} item={item} />
            ))}
          </ul>
          <ul className="flex-1 flex flex-col gap-[40px]">
            {right.map((item, i) => (
              <KursEntry key={i} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
