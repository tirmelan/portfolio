import { defineField, defineType } from "sanity";
import { portableTextBlock } from "./portableTextBlock";

export const contactType = defineType({
  name: "contact",
  title: "Kontakt",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "Teksten før kolon (f.eks. «Kontakt»). Valgfri.",
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
      name: "ingress",
      title: "Ingress",
      description: "Kort introduksjonstekst.",
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
      name: "linkedin",
      title: "LinkedIn-URL",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram-URL",
      type: "url",
    }),
  ],
});
