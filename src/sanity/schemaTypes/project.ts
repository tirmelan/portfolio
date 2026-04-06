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
    defineField({
      name: "headerImageCaption",
      title: "Bildetekst",
      description: "Valgfri tekst som vises under headerbildet.",
      type: "string",
    }),
    defineField({
      name: "previewLayout",
      title: "Forhåndsvisning — layout",
      type: "string",
      options: {
        list: [
          { title: "To bilder side om side", value: "to-bilder" },
          { title: "Ett stort bilde", value: "ett-bilde" },
        ],
        layout: "radio",
      },
      initialValue: "to-bilder",
    }),
    defineField({
      name: "previewImageLeft",
      title: "Forhåndsvisning — venstre bilde",
      description: "Venstre bilde i prosjektkortet på forsiden",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.previewLayout === "ett-bilde",
    }),
    defineField({
      name: "previewImageRight",
      title: "Forhåndsvisning — høyre bilde",
      description: "Høyre bilde i prosjektkortet på forsiden",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.previewLayout === "ett-bilde",
    }),
    defineField({
      name: "previewImage",
      title: "Forhåndsvisning — bilde",
      description: "Bilde som vises i prosjektkortet på forsiden",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.previewLayout !== "ett-bilde",
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
      name: "lenkeTittel",
      title: "Lenketittel",
      description: "Valgfri visningstittel for lenken, f.eks. «fermentering.com»",
      type: "string",
    }),

    defineField({
      name: "sections",
      title: "Innhold",
      type: "array",
      of: [{ type: "textBlock" }, { type: "imageBlock" }],
    }),
  ],
  preview: {
    select: {
      title: "clientName",
      subtitle: "title",
      media: "headerImage",
    },
  },
  orderings: [
    {
      title: "Nyeste først",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
