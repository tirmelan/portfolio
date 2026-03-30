import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

// Maps color key → [bg class, text class]
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

interface ProjectHeaderProps {
  clientName: string;
  title: string;
  tags?: Tag[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headerImage?: any;
}

export default function ProjectHeader({
  clientName,
  title,
  tags,
  headerImage,
}: ProjectHeaderProps) {
  return (
    <header>
      {/* Text + tags */}
      <div className="px-6 md:px-[57px] pt-[31px] pb-[40px] flex flex-col gap-6">
        {/* Title line */}
        <h1 className="font-sans font-medium text-[40px] md:text-[64px] leading-[1.07] text-bla">
          {clientName}:{" "}
          <em className="font-serif italic">{title}</em>
        </h1>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-[15px]">
            {tags.map((tag) => {
              const [bg, text] = tagColorMap[tag.color] ?? ["bg-lys-bla", "text-bla"];
              return (
                <span
                  key={tag._id}
                  className={`${bg} ${text} font-sans text-[20px] leading-normal px-[15px] py-[3px] rounded-full whitespace-nowrap cursor-default`}
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Hero image */}
      {headerImage && (
        <div className="px-6 md:px-[62px]">
          <div className="relative w-full aspect-[1610/943]">
            <Image
              src={urlFor(headerImage).width(1610).height(943).url()}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}
    </header>
  );
}
