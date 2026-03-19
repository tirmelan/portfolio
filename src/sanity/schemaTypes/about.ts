import { defineField, defineType } from "sanity";

export const aboutType = defineType({
  name: "about",
  title: "Om meg",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Overskrift",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Innhold",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "skills",
      title: "Ferdigheter",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "email",
      title: "E-post",
      type: "email",
    }),
    defineField({
      name: "github",
      title: "GitHub-URL",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn-URL",
      type: "url",
    }),
  ],
});
