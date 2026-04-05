import { client } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const revalidate = 60;

const buttonColors: Record<string, [string, string]> = {
  gul: ["bg-gul", "text-bla"],
  rosa: ["bg-rosa", "text-bla"],
  mellombla: ["bg-mellombla", "text-bla"],
  burgunder: ["bg-burgunder", "text-lys-bla"],
  bla: ["bg-bla", "text-lys-bla"],
  "lys-bla": ["bg-lys-bla", "text-bla"],
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
    <>
      <section id="top" className="bg-lys-bla flex flex-col items-center justify-center px-6 py-[101px] min-h-[762px]">
        <div className="flex flex-col items-center gap-[41px] w-full max-w-[1095px]">
          <h1 className="text-bla text-[clamp(2.7rem,6.3vw,5.75rem)] font-semibold leading-[1.25] text-center">
            {data.title}
          </h1>
          {data.ingress && (
            <div className="text-bla text-[27px] leading-[normal] text-center max-w-[839px]">
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
                  href={btn.href ?? "#"}
                  className={`${(buttonColors[btn.color ?? "gul"] ?? buttonColors.gul).join(" ")} text-[22px] px-[20px] py-[10px] rounded-full hover:bg-bla hover:text-lys-bla transition-colors inline-flex items-center gap-[9px]`}
                >
                  {btn.label}
                  <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6H17M12 1L17 6L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      {/* Featured projects */}
      {data.featuredProjects && data.featuredProjects.length > 0 && (
        <section className="flex flex-col px-[62px]">
          {data.featuredProjects.filter((p: { _id: string }, i: number, arr: { _id: string }[]) => arr.findIndex(x => x._id === p._id) === i).map(
            (project: {
              _id: string;
              clientName: string;
              title: string;
              slug: { current: string };
              tags?: { _id: string; name: string; color: string }[];
              previewLayout?: "to-bilder" | "ett-bilde";
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              headerImage?: any;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              previewImage?: any;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              previewImageLeft?: any;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              previewImageRight?: any;
            }) => (
              <ScrollReveal key={project._id}>
                <ProjectCard
                  clientName={project.clientName}
                  title={project.title}
                  slug={project.slug}
                  tags={project.tags}
                  previewLayout={project.previewLayout}
                  headerImage={project.headerImage}
                  previewImage={project.previewImage}
                  previewImageLeft={project.previewImageLeft}
                  previewImageRight={project.previewImageRight}
                />
              </ScrollReveal>
            )
          )}
        </section>
      )}
    </>
  );
}
