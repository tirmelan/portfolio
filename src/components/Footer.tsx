import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-lys-bla px-[62px] py-[40px]">
      <div className="border-t border-bla/20 pt-[40px]">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="Meland design logo" width={70} height={70} />
          </Link>

          <div className="flex gap-[40px]">
            {/* Hopp til... */}
            <div className="flex flex-col w-[156px]">
              <p className="font-serif text-bla text-[17px] leading-[25px] mb-[1px]">
                Hopp til...
              </p>
              <Link href="/prosjekter" className="text-bla text-[14px] leading-[26px] hover:opacity-70 transition-opacity inline-flex items-center gap-[4px]">
                Prosjekter <span className="text-[12px]">&rarr;</span>
              </Link>
              <Link href="/om-meg" className="text-bla text-[14px] leading-[26px] hover:opacity-70 transition-opacity inline-flex items-center gap-[4px]">
                Om meg <span className="text-[12px]">&rarr;</span>
              </Link>
              <Link href="/cv" className="text-bla text-[14px] leading-[26px] hover:opacity-70 transition-opacity inline-flex items-center gap-[4px]">
                CV <span className="text-[12px]">&rarr;</span>
              </Link>
            </div>

            {/* Kontakt */}
            <div className="flex flex-col w-[195px]">
              <p className="font-serif text-bla text-[17px] leading-[25px] mb-[1px]">
                Kontakt
              </p>
              <a href="mailto:tirmelan@gmail.com" className="text-bla text-[14px] leading-[26px] inline-flex items-center gap-[6px] hover:opacity-70 transition-opacity">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="13" height="9" rx="1" stroke="#0d1671" strokeWidth="1"/>
                  <path d="M1 1L7 5.5L13 1" stroke="#0d1671" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                tirmelan@gmail.com
              </a>
              <a href="tel:+4790948095" className="text-bla text-[14px] leading-[26px] inline-flex items-center gap-[6px] hover:opacity-70 transition-opacity">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
                  <path d="M4.67 5.26C5.37 6.62 6.38 7.63 7.74 8.33L8.69 7.38C8.81 7.26 8.97 7.22 9.12 7.27C9.62 7.44 10.16 7.53 10.72 7.53C10.96 7.53 11.15 7.72 11.15 7.96V10.29C11.15 10.53 10.96 10.72 10.72 10.72C5.54 10.72 1.43 6.61 1.43 1.43C1.43 1.19 1.62 1 1.86 1H4.19C4.43 1 4.62 1.19 4.62 1.43C4.62 1.99 4.71 2.53 4.88 3.03C4.93 3.18 4.89 3.34 4.77 3.46L3.72 4.41" stroke="#0d1671" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                90 94 80 95
              </a>
            </div>

            {/* Sosialt */}
            <div className="flex flex-col w-[156px]">
              <p className="font-serif text-bla text-[17px] leading-[25px] mb-[1px]">
                Sosialt
              </p>
              <a
                href="https://www.linkedin.com/in/tiril-johnslien-meland-819639249"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bla text-[14px] leading-[26px] hover:opacity-70 transition-opacity inline-flex items-center gap-[4px]"
              >
                LinkedIn-profil <span className="text-[12px]">&#8599;</span>
              </a>
              <a
                href="https://www.instagram.com/meland.design/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bla text-[14px] leading-[26px] hover:opacity-70 transition-opacity inline-flex items-center gap-[4px]"
              >
                Instagram <span className="text-[12px]">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
