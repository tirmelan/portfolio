import { client } from "@/sanity/client";
import { projectQuery, projectSlugsQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";
import TextBlock from "@/components/modules/TextBlock";
import ImageBlock from "@/components/modules/ImageBlock";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectIntro from "@/components/ProjectIntro";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(projectSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionRenderer({ sections }: { sections: any[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "textBlock":
            return (
              <ScrollReveal key={section._key}>
                <TextBlock title={section.title} body={section.body} size={section.storTittel === false ? "liten" : "stor"} />
              </ScrollReveal>
            );
          case "textBlockLiten":
            return (
              <ScrollReveal key={section._key}>
                <TextBlock title={section.title} body={section.body} size="liten" />
              </ScrollReveal>
            );
          case "imageBlock":
            return (
              <ScrollReveal key={section._key}>
                <ImageBlock
                  layout={section.layout}
                  position={section.position}
                  image={section.image}
                  alt={section.alt}
                  images={section.images}
                  imageLeft={section.imageLeft}
                  altLeft={section.altLeft}
                  imageRight={section.imageRight}
                  altRight={section.altRight}
                />
              </ScrollReveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default async function ProsjektPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await client.fetch(projectQuery, { slug });

  if (!project) {
    notFound();
  }

  return (
    <article>
      <ProjectHeader
        clientName={project.clientName}
        title={project.title}
        tags={project.tags}
        headerImage={project.headerImage}
        headerImageCaption={project.headerImageCaption}
      />
      <ProjectIntro
        ingress={project.ingress}
        kundeLabel={project.kundeLabel}
        kunde={project.kunde}
        samarbeid={project.samarbeid}
        leveranse={project.leveranse}
        periode={project.periode}
        lenke={project.lenke}
        lenkeTittel={project.lenkeTittel}
      />
      <SectionRenderer sections={project.sections} />
    </article>
  );
}
