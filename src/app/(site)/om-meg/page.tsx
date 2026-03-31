import { client } from "@/sanity/client";
import { aboutQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";
import KursAccordion from "@/components/KursAccordion";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60;

const buttonColors: Record<string, [string, string]> = {
  gul: ["bg-gul", "text-bla"],
  rosa: ["bg-rosa", "text-bla"],
  mellombla: ["bg-mellombla", "text-bla"],
  burgunder: ["bg-burgunder", "text-lys-bla"],
  bla: ["bg-bla", "text-lys-bla"],
  "lys-bla": ["bg-lys-bla", "text-bla"],
};

interface About {
  label?: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerImage?: any;
  sectionTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ingress?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brodtekst?: any[];
  email?: string;
  phone?: string;
  ctaButtons?: { label: string; href: string; color?: string }[];
  utdanning?: { grad: string; institusjon?: string; periode?: string; notat?: string }[];
  kurs?: { tittel: string; leverandor?: string; ar?: string; varighet?: string }[];
  anerkjennelse?: { tittel: string; beskrivelse?: string }[];
}

export default async function OmMegPage() {
  const data: About | null = await client.fetch(aboutQuery);

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500">Ingen innhold ennå.</p>
        <Link href="/studio" className="mt-4 inline-block text-sm underline">
          Legg til innhold i Studio →
        </Link>
      </div>
    );
  }

  return (
    <>
      <header>
        <div className="px-6 md:px-[57px] pt-[60px] pb-[40px]">
          <h1 className="font-sans font-medium text-[40px] md:text-[64px] leading-[1.07] text-bla">
            {data.label && <>{data.label}:{" "}</>}
            <em className="font-serif italic">{data.title ?? "Om meg"}</em>
          </h1>
        </div>
        {data.headerImage && (
          <div className="px-6 md:px-[62px]">
            <div className="relative w-full aspect-[1610/943]">
              <Image
                src={urlFor(data.headerImage).width(1610).height(943).url()}
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </header>

      <section className="px-[176px] py-[106px]">
        <div className="flex gap-[284px] items-start">
          {/* Left: serif section title */}
          <h2 className="font-serif text-[50px] leading-normal text-bla w-[415px] shrink-0">
            {data.sectionTitle}
          </h2>

          {/* Right: content */}
          <div className="flex flex-col gap-[53px] w-[677px]">
          {/* Ingress */}
          {data.ingress && (
            <div className="text-bla text-[30px] leading-[41px]">
              <PortableTextRenderer value={data.ingress} />
            </div>
          )}

          {/* Brødtekst */}
          {data.brodtekst && (
            <div className="text-bla text-[20px] leading-[28px]">
              <PortableTextRenderer value={data.brodtekst} />
            </div>
          )}

          {/* Contact */}
          {(data.email || data.phone) && (
            <div className="flex flex-col gap-[10px]">
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="text-bla text-[20px] leading-[32px] flex items-center gap-[8px] hover:opacity-70 transition-opacity"
                >
                  <svg aria-hidden="true" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1H19V15H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M1 1L10 9L19 1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                  {data.email}
                </a>
              )}
              {data.phone && (
                <a
                  href={`tel:${data.phone.replace(/\s/g, "")}`}
                  className="text-bla text-[20px] leading-[32px] flex items-center gap-[8px] hover:opacity-70 transition-opacity"
                >
                  <svg aria-hidden="true" width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 1H13C13.6 1 14 1.4 14 2V18C14 18.6 13.6 19 13 19H3C2.4 19 2 18.6 2 18V2C2 1.4 2.4 1 3 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    <circle cx="8" cy="16" r="1" fill="currentColor"/>
                  </svg>
                  {data.phone}
                </a>
              )}
            </div>
          )}

          {/* CTA buttons */}
          {data.ctaButtons && data.ctaButtons.length > 0 && (
            <div className="flex gap-[27px] items-center">
              {data.ctaButtons.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.href}
                  className={`${(buttonColors[btn.color ?? "gul"] ?? buttonColors.gul).join(" ")} text-[24px] px-[20px] py-[10px] rounded-full hover:bg-bla hover:text-lys-bla transition-colors inline-flex items-center gap-[9px]`}
                >
                  {btn.label}
                  <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6H17M12 1L17 6L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Utdanning */}
      {data.utdanning && data.utdanning.length > 0 && (
        <section className="px-[176px] pb-[60px]">
          <hr className="border-t border-bla mb-[60px]" />
          <div className="flex gap-[284px] items-start">
            <h2 className="font-serif text-[40px] font-normal leading-none text-bla w-[415px] shrink-0">
              Utdanning
            </h2>
            <ul className="flex flex-col gap-[40px] w-[677px]">
              {data.utdanning.map((item, i) => (
                <li key={i} className="flex flex-col gap-[2px]">
                  <p className="font-sans font-semibold text-[20px] leading-[28px] text-bla">
                    {item.grad}
                  </p>
                  {(item.institusjon || item.periode) && (
                    <p className="font-sans text-[20px] leading-[28px] text-bla opacity-70">
                      {[item.institusjon, item.periode].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {item.notat && (
                    <p className="font-sans text-[20px] leading-[28px] text-bla opacity-50">
                      {item.notat}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Kurs */}
      {data.kurs && data.kurs.length > 0 && (
        <section className="px-[176px]">
          <KursAccordion kurs={data.kurs} />
        </section>
      )}

      {/* Anerkjennelse */}
      {data.anerkjennelse && data.anerkjennelse.length > 0 && (
        <section className="px-[176px] pb-[60px]">
          <hr className="border-t border-bla mb-[60px]" />
          <div className="flex gap-[284px] items-start">
            <h2 className="font-serif text-[40px] font-normal leading-none text-bla w-[415px] shrink-0">
              Anerkjennelse
            </h2>
            <ul className="flex flex-col gap-[40px] w-[677px]">
              {data.anerkjennelse.map((item, i) => (
                <li key={i} className="flex flex-col gap-[8px]">
                  <p className="font-sans font-medium text-[24px] leading-[32px] text-bla">
                    {item.tittel}
                  </p>
                  {item.beskrivelse && (
                    <p className="font-sans text-[20px] leading-[28px] text-bla opacity-70">
                      {item.beskrivelse}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
