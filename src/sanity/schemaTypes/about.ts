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
      description: "Teksten i kursiv etter kolon. La stå tom for kun å vise label.",
      type: "string",
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
      name: "utdanning",
      title: "Utdanning",
      description: "Liste over utdanninger.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "grad",
              title: "Grad / program",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "institusjon",
              title: "Institusjon",
              type: "string",
            }),
            defineField({
              name: "periode",
              title: "Periode",
              type: "string",
            }),
            defineField({
              name: "notat",
              title: "Notat (valgfri)",
              description: "F.eks. utveksling, valgfag, spesialisering o.l.",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "grad", subtitle: "institusjon" },
          },
        },
      ],
    }),
    defineField({
      name: "kurs",
      title: "Kurs",
      description: "Liste over kurs og sertifiseringer. Vises som nedtrekksliste på siden.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "tittel",
              title: "Tittel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "leverandor",
              title: "Leverandør",
              description: "F.eks. Coursera, LinkedIn Learning, Fagskolen o.l.",
              type: "string",
            }),
            defineField({
              name: "ar",
              title: "År",
              type: "string",
            }),
            defineField({
              name: "varighet",
              title: "Varighet",
              description: "F.eks. «fem dager», «to dager»",
              type: "string",
            }),
            defineField({
              name: "beskrivelse",
              title: "Beskrivelse",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "tittel", subtitle: "leverandor" },
          },
        },
      ],
    }),
    defineField({
      name: "anerkjennelse",
      title: "Anerkjennelse",
      description: "Liste over priser og anerkjennelser.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "tittel",
              title: "Tittel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "beskrivelse",
              title: "Beskrivelse",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "tittel", subtitle: "beskrivelse" },
          },
        },
      ],
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
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],
});
