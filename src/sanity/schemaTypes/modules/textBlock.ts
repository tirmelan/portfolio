import { defineField, defineType } from "sanity";

export const textBlockType = defineType({
  name: "textBlock",
  title: "Tekstblokk (Stor)",
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
      return { title: title || "Tekstblokk uten tittel" };
    },
  },
});
