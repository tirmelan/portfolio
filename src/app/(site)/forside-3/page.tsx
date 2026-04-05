import { client } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";
import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";

export const revalidate = 60;

const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

interface Project {
  _id: string;
  clientName: string;
  title: string;
  slug: { current: string };
  tags?: { _id: string; name: string; color: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerImage?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewImageLeft?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewImageRight?: any;
}

export default async function Forside3Page() {
  const data = await client.fetch(homepageQuery);

  const projects: Project[] = data?.featuredProjects
    ? data.featuredProjects.filter(
        (p: Project, i: number, arr: Project[]) =>
          arr.findIndex((x) => x._id === p._id) === i
      )
    : [];

  return (
    <div className="text-bla">

      {/* Hero — stor venstrestilt tittel, ingress til høyre */}
      <section className="px-[60px] pt-[80px] pb-[72px] grid grid-cols-2 gap-16 items-end">
        <h1 className="font-serif italic text-[clamp(3rem,6.5vw,6.5rem)] leading-[1.05]">
          {data?.title ?? "Hei, jeg er Tiril Meland"}
        </h1>

        <div className="flex flex-col justify-end gap-8 pb-2">
          {data?.ingress && (
            <div className="text-[18px] leading-relaxed max-w-[420px] text-bla/80">
              <PortableTextRenderer value={data.ingress} />
            </div>
          )}
          <Link
            href="/prosjekter"
            className="inline-flex items-center gap-[10px] text-[16px] font-sans font-medium tracking-[0.04em] uppercase text-bla border-b border-bla pb-[2px] w-fit hover:opacity-60 transition-opacity"
          >
            Se alle prosjekter
            <svg aria-hidden="true" width="16" height="10" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 6H17M12 1L17 6L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-t border-bla mx-[60px]" />

      {/* Prosjektgrid — 2 kolonner */}
      {projects.length > 0 && (
        <section className="px-[60px] pt-[64px] pb-[100px] grid grid-cols-2 gap-x-8 gap-y-[72px]">
          {projects.map((project) => {
            const image = project.headerImage ?? project.previewImageLeft;
            return (
              <Link
                key={project._id}
                href={`/prosjekter/${project.slug.current}`}
                className="group flex flex-col gap-5"
              >
                {/* Bilde */}
                {image && (
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-lys-bla">
                    <Image
                      src={urlFor(image).width(1000).height(750).url()}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  </div>
                )}

                {/* Tekst */}
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-mellombla font-sans">
                    {project.clientName}
                  </p>
                  <p className="font-serif italic text-[clamp(1.4rem,2vw,2rem)] leading-[1.2] text-bla">
                    {project.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
