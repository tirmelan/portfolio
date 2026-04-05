import { defineField, defineType } from "sanity";
import { portableTextBlock } from "./portableTextBlock";

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
      of: [portableTextBlock],
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
              name: "linkType",
              title: "Lenketype",
              type: "string",
              options: {
                list: [
                  { title: "Intern side", value: "intern" },
                  { title: "Ekstern URL", value: "ekstern" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "intern",
            }),
            defineField({
              name: "internalPage",
              title: "Intern side",
              type: "string",
              options: {
                list: [
                  { title: "Forside", value: "/" },
                  { title: "Prosjekter", value: "/prosjekter" },
                  { title: "Om meg", value: "/om-meg" },
                  { title: "CV", value: "/cv" },
                  { title: "Kontakt", value: "/kontakt" },
                ],
              },
              hidden: ({ parent }) => parent?.linkType === "ekstern",
            }),
            defineField({
              name: "externalUrl",
              title: "Ekstern URL",
              type: "url",
              hidden: ({ parent }) => parent?.linkType !== "ekstern",
            }),
            defineField({
              name: "color",
              title: "Farge",
              type: "string",
              options: {
                list: [
                  { title: "Gul / oliven", value: "gul" },
                  { title: "Rosa", value: "rosa" },
                  { title: "Mellomblå", value: "mellombla" },
                  { title: "Burgunder (mørk)", value: "burgunder" },
                  { title: "Mørk blå (mørk)", value: "bla" },
                  { title: "Lys blå", value: "lys-bla" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "internalPage" },
          },
        },
      ],
    }),
    defineField({
      name: "featuredProjects",
      title: "Fremhevede prosjekter",
      description: "Velg hvilke prosjekter som skal vises på forsiden, og sorter dem i ønsket rekkefølge.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
    }),
  ],
});
