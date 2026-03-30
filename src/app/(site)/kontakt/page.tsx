import { client } from "@/sanity/client";
import { contactQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";

export const revalidate = 60;

interface Contact {
  label?: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ingress?: any[];
  email?: string;
  phone?: string;
  linkedin?: string;
  instagram?: string;
}

export default async function KontaktPage() {
  const data: Contact | null = await client.fetch(contactQuery);

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
        <div className="px-6 md:px-[57px] pt-[31px] pb-[40px]">
          <h1 className="font-sans font-medium text-[40px] md:text-[64px] leading-[1.07] text-bla">
            {data.label && <>{data.label}:{" "}</>}
            <em className="font-serif italic">{data.title ?? "Kontakt"}</em>
          </h1>
        </div>
      </header>

      <section className="px-[176px] py-[106px]">
        <div className="flex gap-[284px] items-start">
          {/* Left: serif label */}
          <h2 className="font-serif text-[50px] leading-normal text-bla w-[415px] shrink-0">
            Ta kontakt
          </h2>

          {/* Right: content */}
          <div className="flex flex-col gap-[53px] w-[677px]">
            {data.ingress && (
              <div className="text-bla text-[30px] leading-[41px]">
                <PortableTextRenderer value={data.ingress} />
              </div>
            )}

            {/* Contact info */}
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

            {/* Social links */}
            {(data.linkedin || data.instagram) && (
              <div className="flex flex-col gap-[10px]">
                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bla text-[20px] leading-[32px] flex items-center gap-[8px] hover:opacity-70 transition-opacity"
                  >
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 8V15M5 5.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M9 15V11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M9 8V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    LinkedIn
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                )}
                {data.instagram && (
                  <a
                    href={data.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bla text-[20px] leading-[32px] flex items-center gap-[8px] hover:opacity-70 transition-opacity"
                  >
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="15" cy="5" r="1" fill="currentColor"/>
                    </svg>
                    Instagram
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
