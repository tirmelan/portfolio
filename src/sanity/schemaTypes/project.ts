import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Prosjekter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tags",
      title: "Teknologier / Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "url",
      title: "Prosjekt-URL",
      type: "url",
    }),
    defineField({
      name: "github",
      title: "GitHub-URL",
      type: "url",
    }),
    defineField({
      name: "publishedAt",
      title: "Publisert",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Nyeste først",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
