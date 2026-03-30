import { client } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const revalidate = 60;

export default async function Forside2Page() {
  const data = await client.fetch(homepageQuery);

  const projects = data?.featuredProjects
    ? data.featuredProjects.filter(
        (p: { _id: string }, i: number, arr: { _id: string }[]) =>
          arr.findIndex((x) => x._id === p._id) === i
      )
    : [];

  return (
    <div className="flex items-start">
      {/* Left sticky sidebar — no padding on the aside itself */}
      <aside className="sticky top-0 h-screen w-[32vw] min-w-[280px] max-w-[549px] shrink-0 flex flex-col overflow-y-auto border-r border-bla">
        {/* Hero text */}
        <div className="pl-[60px] pr-[29px] pt-[73px] pb-[70px] text-bla">
          <h1 className="font-sans font-semibold text-[clamp(2.5rem,5vw,78px)] leading-[1.25]">
            {data?.title || "Hei, jeg er Tiril Meland"}
          </h1>
          {data?.ingress && (
            <div className="mt-6 text-[clamp(0.9rem,1.3vw,22px)] leading-normal">
              <PortableTextRenderer value={data.ingress} />
            </div>
          )}
        </div>

        {/* Navigation links — full aside width, text aligned with hero */}
        <nav className="flex flex-col mt-auto">
          {[
            { label: "Prosjekter", href: "/prosjekter" },
            { label: "Om meg", href: "/om-meg" },
            { label: "CV", href: "/cv" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between border-t border-bla pl-[60px] pr-[29px] py-[22px] min-h-[111px] text-bla hover:opacity-70 transition-opacity group"
            >
              <span className="font-serif text-[clamp(1.5rem,2vw,35px)] leading-[54px]">
                {label}
              </span>
              <svg
                aria-hidden="true"
                width="29"
                height="22"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 group-hover:translate-x-1 transition-transform"
              >
                <path
                  d="M1 6H17M12 1L17 6L12 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
          <div className="border-t border-bla" />
        </nav>
      </aside>

      {/* Right — project cards */}
      <div className="flex-1 min-w-0">
        {projects.length > 0 ? (
          projects.map(
            (project: {
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
            }) => (
              <ScrollReveal key={project._id}>
                <ProjectCard
                  clientName={project.clientName}
                  title={project.title}
                  slug={project.slug}
                  tags={project.tags}
                  headerImage={project.headerImage}
                  previewImageLeft={project.previewImageLeft}
                  previewImageRight={project.previewImageRight}
                />
              </ScrollReveal>
            )
          )
        ) : (
          <div className="px-[62px] py-24 text-bla/50">
            <p>Ingen prosjekter ennå.</p>
          </div>
        )}
      </div>
    </div>
  );
}
