import { defineField, defineType } from "sanity";

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
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Tekstblokk (liten) uten tittel" };
    },
  },
});
