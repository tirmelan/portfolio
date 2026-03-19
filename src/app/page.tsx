import { client } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import Link from "next/link";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60;

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
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {data.profileImage && (
          <div className="flex-shrink-0">
            <Image
              src={urlFor(data.profileImage).width(300).height(300).url()}
              alt={data.name}
              width={200}
              height={200}
              className="rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
          {data.role && (
            <p className="text-xl text-gray-500 mb-6">{data.role}</p>
          )}
          <div className="text-gray-700 max-w-prose">
            <PortableTextRenderer value={data.bio} />
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href="/prosjekter"
              className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              Se prosjekter
            </Link>
            <Link
              href="/om-meg"
              className="px-5 py-2.5 border border-gray-300 text-sm rounded-lg hover:border-gray-500 transition-colors"
            >
              Om meg
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
