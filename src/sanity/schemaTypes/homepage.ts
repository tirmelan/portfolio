import { defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Forside",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ingress",
      title: "Ingress",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "ctaButtons",
      title: "CTA-knapper",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Tekst",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Lenke",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "color",
              title: "Farge",
              type: "string",
              options: {
                list: [
                  { title: "Gul", value: "gul" },
                  { title: "Rosa", value: "rosa" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],
});
