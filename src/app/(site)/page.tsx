import { client } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";

export const revalidate = 60;

const buttonColors: Record<string, string> = {
  gul: "bg-gul",
  rosa: "bg-rosa",
};

export default async function HomePage() {
  const data = await client.fetch(homepageQuery);

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500">Ingen innhold ennå. Legg til innhold i Sanity Studio.</p>
        <Link href="/studio" className="mt-4 inline-block text-sm underline">
          Åpne Studio →
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-lys-blå flex flex-col items-center justify-center px-6 py-[101px] min-h-[762px]">
      <div className="flex flex-col items-center gap-[41px] max-w-[1095px]">
        <h1 className="text-blå text-[clamp(3rem,7vw,6.4rem)] font-semibold leading-[1.25] text-center">
          {data.title}
        </h1>
        {data.ingress && (
          <div className="text-blå text-[30px] leading-normal text-center max-w-[839px]">
            <PortableTextRenderer value={data.ingress} />
          </div>
        )}
      </div>
      {data.ctaButtons && data.ctaButtons.length > 0 && (
        <div className="flex gap-[24px] items-center mt-[40px]">
          {data.ctaButtons.map(
            (btn: { label: string; href: string; color?: string }, i: number) => (
              <Link
                key={i}
                href={btn.href}
                className={`${buttonColors[btn.color ?? "gul"] ?? "bg-gul"} text-blå text-[24px] px-[20px] py-[10px] rounded-full hover:opacity-80 transition-opacity inline-flex items-center gap-[9px]`}
              >
                {btn.label}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}
