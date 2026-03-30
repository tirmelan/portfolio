import { client } from "@/sanity/client";
import { projectsQuery } from "@/sanity/queries";
import Link from "next/link";

export const revalidate = 60;

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface Project {
  _id: string;
  clientName?: string;
  title: string;
  slug: { current: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerImage?: any;
  tags?: Tag[];
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
            <Link
              href={`/prosjekter/${project.slug?.current ?? ""}`}
              key={project._id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-5">
                <h2 className="font-semibold text-lg mb-2">
                  {project.clientName ? `${project.clientName}: ` : ""}{project.title}
                </h2>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
