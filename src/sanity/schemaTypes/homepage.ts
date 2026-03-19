import { defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  title: "Forside",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Tittel / Rolle",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "profileImage",
      title: "Profilbilde",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
