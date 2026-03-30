import { defineField, defineType } from "sanity";
import { portableTextBlock } from "./portableTextBlock";

export const aboutType = defineType({
  name: "about",
  title: "Om meg",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "Teksten før kolon (f.eks. «Om»). Valgfri.",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Tittel",
      description: "Teksten i kursiv (f.eks. «meg»).",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerImage",
      title: "Headerbilde",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "sectionTitle",
      title: "Seksjonstittel",
      description: "Teksten som vises til venstre i serif-font (f.eks. «Historie, filosofi og inspirasjon»).",
      type: "string",
    }),
    defineField({
      name: "ingress",
      title: "Ingress",
      description: "Stor introduksjonstekst øverst til høyre.",
      type: "array",
      of: [portableTextBlock],
    }),
    defineField({
      name: "brodtekst",
      title: "Brødtekst",
      description: "Brødtekst med seksjoner og mellomoverskrifter.",
      type: "array",
      of: [portableTextBlock],
    }),
    defineField({
      name: "email",
      title: "E-post",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
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
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],
});
