import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

interface ImageItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  alt?: string;
}

interface ImageBlockProps {
  layout: string;
  position?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  alt?: string;
  images?: ImageItem[];
  // legacy fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageLeft?: any;
  altLeft?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageRight?: any;
  altRight?: string;
}

export default function ImageBlock({
  layout,
  position = "venstre",
  image,
  alt,
  images,
  imageLeft,
  altLeft,
  imageRight,
  altRight,
}: ImageBlockProps) {
  if (layout === "hovedbilde") {
    if (!image) return null;
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="relative w-full aspect-[1610/943]">
          <Image
            src={urlFor(image).width(1610).height(943).url()}
            alt={alt || ""}
            fill
            className="object-cover"
          />
        </div>
      </section>
    );
  }

  // Support both new images array and legacy individual fields
  const imageList: ImageItem[] =
    images && images.length > 0
      ? images
      : [
          ...(imageLeft ? [{ image: imageLeft, alt: altLeft }] : []),
          ...(imageRight ? [{ image: imageRight, alt: altRight }] : []),
        ];

  if (imageList.length === 0) return null;

  if (layout === "toKvadratiske") {
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[30px]">
          {imageList.slice(0, 2).map((item, i) => (
            <div key={i} className="relative w-full md:w-1/2 aspect-square">
              <Image
                src={urlFor(item.image).width(790).height(790).url()}
                alt={item.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === "treKvadratiske") {
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[30px]">
          {imageList.slice(0, 3).map((item, i) => (
            <div key={i} className="relative w-full md:w-1/3 aspect-square">
              <Image
                src={urlFor(item.image).width(517).height(517).url()}
                alt={item.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === "kvadratRektangel") {
    const square = imageList[0];
    const rect = imageList[1];
    if (!square && !rect) return null;

    const squareEl = square && (
      <div className="relative w-full md:w-1/2 aspect-square">
        <Image
          src={urlFor(square.image).width(790).height(790).url()}
          alt={square.alt || ""}
          fill
          className="object-cover"
        />
      </div>
    );

    const rectEl = rect && (
      <div className="relative w-full md:w-1/2 aspect-[790/517]">
        <Image
          src={urlFor(rect.image).width(790).height(517).url()}
          alt={rect.alt || ""}
          fill
          className="object-cover"
        />
      </div>
    );

    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[30px] items-end">
          {position === "venstre" ? (
            <>{squareEl}{rectEl}</>
          ) : (
            <>{rectEl}{squareEl}</>
          )}
        </div>
      </section>
    );
  }

  if (layout === "toRektangulare") {
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[30px]">
          {imageList.slice(0, 2).map((item, i) => (
            <div key={i} className="relative w-full md:w-1/2 aspect-[790/517]">
              <Image
                src={urlFor(item.image).width(790).height(517).url()}
                alt={item.alt || ""}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === "storOgLiten") {
    const big = imageList[0];
    const small1 = imageList[1];
    const small2 = imageList[2];
    if (!big && !small1 && !small2) return null;

    const bigEl = big && (
      <div className="relative w-full md:w-1/2 aspect-[790/1035]">
        <Image
          src={urlFor(big.image).width(790).height(1035).url()}
          alt={big.alt || ""}
          fill
          className="object-cover"
        />
      </div>
    );

    const smallEls = (
      <div className="flex flex-col gap-[30px] w-full md:w-1/2">
        {small1 && (
          <div className="relative w-full aspect-[790/502]">
            <Image
              src={urlFor(small1.image).width(790).height(502).url()}
              alt={small1.alt || ""}
              fill
              className="object-cover"
            />
          </div>
        )}
        {small2 && (
          <div className="relative w-full aspect-[790/502]">
            <Image
              src={urlFor(small2.image).width(790).height(502).url()}
              alt={small2.alt || ""}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    );

    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[30px]">
          {position === "venstre" ? (
            <>{bigEl}{smallEls}</>
          ) : (
            <>{smallEls}{bigEl}</>
          )}
        </div>
      </section>
    );
  }

  return null;
}
