import { client } from "@/sanity/client";
import { aboutQuery } from "@/sanity/queries";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";

export const revalidate = 60;

interface About {
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any[];
  skills?: string[];
  email?: string;
  github?: string;
  linkedin?: string;
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
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">{data.title ?? "Om meg"}</h1>

      {data.content && (
        <div className="text-gray-700 mb-10">
          <PortableTextRenderer value={data.content} />
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Ferdigheter</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold mb-4">Kontakt</h2>
        <ul className="space-y-2 text-sm">
          {data.email && (
            <li>
              <a href={`mailto:${data.email}`} className="hover:underline">
                {data.email}
              </a>
            </li>
          )}
          {data.github && (
            <li>
              <a href={data.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </li>
          )}
          {data.linkedin && (
            <li>
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
