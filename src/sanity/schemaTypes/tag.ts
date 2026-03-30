import { defineField, defineType } from "sanity";

export const tagType = defineType({
  name: "tag",
  title: "Tags",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
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
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "color",
    },
  },
});
