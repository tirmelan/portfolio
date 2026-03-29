import { PortableText, PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[20px] font-normal leading-[28px]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-[20px] font-normal leading-[28px]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[20px] font-normal leading-[28px]">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 text-[20px] leading-[28px]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 text-[20px] leading-[28px]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[20px] font-normal leading-[28px]">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-[20px] font-normal leading-[28px]">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="font-serif italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-70"
      >
        {children}
      </a>
    ),
  },
};

const titleSize = {
  stor: "text-[50px]",
  liten: "text-[40px]",
};

interface TextBlockProps {
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  size?: "stor" | "liten";
}

export default function TextBlock({ title, body, size = "stor" }: TextBlockProps) {
  return (
    <section className="px-6 md:px-[176px] py-[106px]">
      <div className="flex flex-col gap-10 md:flex-row md:gap-[284px] text-bla">
        {title && (
          <h2 className={`font-serif ${titleSize[size]} font-normal leading-normal shrink-0 md:w-[415px]`}>
            {title}
          </h2>
        )}
        {body && (
          <div className="font-sans font-normal md:w-[677px] flex flex-col gap-5">
            <PortableText value={body} components={components} />
          </div>
        )}
      </div>
    </section>
  );
}
