import { defineField, defineType } from "sanity";
import { portableTextBlock } from "../portableTextBlock";

export const textBlockType = defineType({
  name: "textBlock",
  title: "Tekstblokk",
  type: "object",
  fields: [
    defineField({
      name: "storTittel",
      title: "Stor tittel",
      type: "boolean",
      initialValue: true,
      description: "Slå av for å bruke liten tittel",
    }),
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
    select: { title: "title", storTittel: "storTittel" },
    prepare({ title, storTittel }) {
      return {
        title: title || "Tekstblokk uten tittel",
        subtitle: storTittel === false ? "Liten tittel" : "Stor tittel",
      };
    },
  },
});
