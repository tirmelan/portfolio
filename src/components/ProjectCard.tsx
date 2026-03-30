import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

const tagColorMap: Record<string, [string, string]> = {
  gul: ["bg-gul", "text-bla"],
  rosa: ["bg-rosa", "text-bla"],
  mellombla: ["bg-mellombla", "text-bla"],
  burgunder: ["bg-burgunder", "text-lys-bla"],
  bla: ["bg-bla", "text-lys-bla"],
  "lys-bla": ["bg-lys-bla", "text-bla"],
};

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface ProjectCardProps {
  clientName: string;
  title: string;
  slug: { current: string };
  tags?: Tag[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerImage?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewImageLeft?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewImageRight?: any;
}

export default function ProjectCard({
  clientName,
  title,
  slug,
  tags,
  headerImage,
  previewImageLeft,
  previewImageRight,
}: ProjectCardProps) {
  const imageLeft = previewImageLeft ?? headerImage;
  const imageRight = previewImageRight ?? headerImage;

  return (
    <Link href={`/prosjekter/${slug.current}`} className="block group">
      {/* Top separator */}
      <hr className="border-t border-bla" />

      {/* Title + tags row */}
      <div className="flex items-center justify-between gap-6 py-[14px]">
        <p className="font-sans font-medium text-[30px] leading-[50px] text-bla shrink-0">
          {clientName}:{" "}
          <em className="font-serif italic font-normal">{title}</em>
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-[15px] justify-end">
            {tags.map((tag) => {
              const [bg, text] = tagColorMap[tag.color] ?? ["bg-lys-bla", "text-bla"];
              return (
                <span
                  key={tag._id}
                  className={`${bg} ${text} font-sans text-[20px] leading-normal px-[15px] py-[3px] rounded-full whitespace-nowrap`}
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Separator between title row and images */}
      <hr className="border-t border-bla" />

      {/* Two preview images — full width, edge to edge */}
      {(imageLeft || imageRight) && (
        <div className="flex">
          <div className="relative flex-1 aspect-square overflow-hidden">
            {imageLeft && (
              <Image
                src={urlFor(imageLeft).width(800).height(800).url()}
                alt=""
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            )}
          </div>
          <div className="relative flex-1 aspect-square overflow-hidden">
            {imageRight && (
              <Image
                src={urlFor(imageRight).width(800).height(800).url()}
                alt=""
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
