import { client } from "@/sanity/client";
import { projectsQuery } from "@/sanity/queries";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60;

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  tags?: string[];
  url?: string;
  github?: string;
}

export default async function ProsjekterPage() {
  const projects: Project[] = await client.fetch(projectsQuery);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Prosjekter</h1>
      <p className="text-gray-500 mb-12">Et utvalg av ting jeg har jobbet med.</p>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Ingen prosjekter ennå.</p>
          <Link href="/studio" className="mt-4 inline-block text-sm underline">
            Legg til prosjekter i Studio →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project._id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              {project.image && (
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={urlFor(project.image).width(600).height(340).url()}
                    alt={project.title}
                    width={600}
                    height={340}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-semibold text-lg mb-2">{project.title}</h2>
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-sm">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 font-medium hover:underline"
                    >
                      Se prosjekt →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
