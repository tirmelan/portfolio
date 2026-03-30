import { defineField, defineType } from "sanity";
import { portableTextBlock } from "../portableTextBlock";

export const textBlockLitenType = defineType({
  name: "textBlockLiten",
  title: "Tekstblokk (Liten)",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "array",
      of: [portableTextBlock],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Tekstblokk (liten) uten tittel" };
    },
  },
});
