import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Prosjekter",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Navn",
      description: "Vises i Indivisible foran kolonet, f.eks. «Studio Blå»",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Prosjekttittel",
      description: "Vises i kursiv etter kolonet, f.eks. «Ny merkevare»",
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
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "headerImage",
      title: "Headerbilde",
      description: "Stort bilde som vises nederst i headeren",
      type: "image",
      options: { hotspot: true },
    }),

    // --- Intro-seksjon ---
    defineField({
      name: "ingress",
      title: "Ingress",
      description: "Kort introduksjonstekst til venstre i intro-seksjonen",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "kundeLabel",
      title: "Første felt: Kunde eller Emne?",
      type: "string",
      options: {
        list: [
          { title: "Kunde", value: "Kunde" },
          { title: "Emne", value: "Emne" },
        ],
        layout: "radio",
      },
      initialValue: "Kunde",
    }),
    defineField({
      name: "kunde",
      title: "Kunde / Emne",
      type: "string",
    }),
    defineField({
      name: "samarbeid",
      title: "Samarbeid",
      type: "string",
    }),
    defineField({
      name: "leveranse",
      title: "Leveranse",
      type: "string",
    }),
    defineField({
      name: "periode",
      title: "Periode",
      type: "string",
    }),
    defineField({
      name: "lenke",
      title: "Lenke",
      type: "url",
    }),

    defineField({
      name: "sections",
      title: "Innhold",
      type: "array",
      of: [{ type: "textBlock" }, { type: "textBlockLiten" }, { type: "imageBlock" }],
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
