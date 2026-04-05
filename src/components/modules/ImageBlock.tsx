import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = createImageUrlBuilder(client);

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
            src={urlFor(image).url()}
            alt={alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, calc(100vw - 124px)"
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
                src={urlFor(item.image).url()}
                alt={item.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
                src={urlFor(item.image).url()}
                alt={item.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
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
          src={urlFor(square.image).url()}
          alt={square.alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );

    const rectEl = rect && (
      <div className="relative w-full md:w-1/2 aspect-[790/517]">
        <Image
          src={urlFor(rect.image).url()}
          alt={rect.alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
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
                src={urlFor(item.image).url()}
                alt={item.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
          src={urlFor(big.image).url()}
          alt={big.alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );

    const smallEls = (
      <div className="flex flex-col gap-[30px] w-full md:w-1/2">
        {small1 && (
          <div className="relative w-full aspect-[790/502]">
            <Image
              src={urlFor(small1.image).url()}
              alt={small1.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
        {small2 && (
          <div className="relative w-full aspect-[790/502]">
            <Image
              src={urlFor(small2.image).url()}
              alt={small2.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
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

  if (layout === "fireIRekke") {
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[25px]">
          {imageList.slice(0, 4).map((item, i) => (
            <div key={i} className="relative w-full md:w-1/4 aspect-square">
              <Image
                src={urlFor(item.image).url()}
                alt={item.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === "toGangerTo") {
    const rows = [imageList.slice(0, 2), imageList.slice(2, 4)];
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col gap-[30px]">
          {rows.map((row, ri) => (
            <div key={ri} className="flex flex-col md:flex-row gap-[30px]">
              {row.map((item, ci) => (
                <div key={ci} className="relative w-full md:w-1/2 aspect-[790/517]">
                  <Image
                    src={urlFor(item.image).url()}
                    alt={item.alt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === "toHoye") {
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col md:flex-row gap-[30px]">
          {imageList.slice(0, 2).map((item, i) => (
            <div key={i} className="relative w-full md:w-1/2 aspect-[790/1035]">
              <Image
                src={urlFor(item.image).url()}
                alt={item.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (layout === "treGangerTre") {
    const rows = [
      imageList.slice(0, 3),
      imageList.slice(3, 6),
      imageList.slice(6, 9),
    ];
    return (
      <section className="px-6 md:px-[62px] py-[15px]">
        <div className="flex flex-col gap-[25px]">
          {rows.map((row, ri) => (
            <div key={ri} className="flex flex-col md:flex-row gap-[25px]">
              {row.map((item, ci) => (
                <div key={ci} className="relative w-full md:w-1/3 aspect-square">
                  <Image
                    src={urlFor(item.image).url()}
                    alt={item.alt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
