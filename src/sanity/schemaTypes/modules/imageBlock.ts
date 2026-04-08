import { defineField, defineType } from "sanity";

export const imageBlockType = defineType({
  name: "imageBlock",
  title: "Bildemodul",
  type: "object",
  fields: [
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Hovedbilde", value: "hovedbilde" },
          { title: "To kvadratiske bilder", value: "toKvadratiske" },
          { title: "To kvadratiske bilder (smal)", value: "toKvadratiskeSmal" },
          { title: "Tre kvadratiske bilder", value: "treKvadratiske" },
          { title: "Kvadrat og rektangel", value: "kvadratRektangel" },
          { title: "To rektangulære bilder", value: "toRektangulare" },
          { title: "Tre rektangulære bilder", value: "treRektangulare" },
          { title: "Stor og liten (tre bilder grid)", value: "storOgLiten" },
          { title: "Fire i rekke", value: "fireIRekke" },
          { title: "2×2 rutenett (fire bilder)", value: "toGangerTo" },
          { title: "To høye bilder (portrett)", value: "toHoye" },
          { title: "3×3 rutenett (ni bilder)", value: "treGangerTre" },
        ],
        layout: "radio",
      },
      initialValue: "hovedbilde",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Stort bilde-posisjon",
      type: "string",
      options: {
        list: [
          { title: "Venstre", value: "venstre" },
          { title: "Høyre", value: "hoyre" },
        ],
        layout: "radio",
      },
      initialValue: "venstre",
      hidden: ({ parent }) =>
        parent?.layout !== "kvadratRektangel" && parent?.layout !== "storOgLiten",
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.layout !== "hovedbilde",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { layout?: string };
          if (parent?.layout === "hovedbilde" && !value) return "Bilde er påkrevd";
          return true;
        }),
    }),
    defineField({
      name: "alt",
      title: "Alternativ tekst",
      type: "string",
      description: "Beskriv bildet for tilgjengelighet",
      hidden: ({ parent }) => parent?.layout !== "hovedbilde",
    }),
    defineField({
      name: "caption",
      title: "Bildetekst",
      type: "string",
      hidden: ({ parent }) => parent?.layout !== "hovedbilde",
    }),
    defineField({
      name: "images",
      title: "Bilder",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Bilde",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alternativ tekst",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Bildetekst",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "alt", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Bilde", media };
            },
          },
        },
      ],
      hidden: ({ parent }) => parent?.layout === "hovedbilde",
    }),
  ],
  preview: {
    select: { layout: "layout", media: "image", images: "images" },
    prepare({ layout, media, images }) {
      const titles: Record<string, string> = {
        hovedbilde: "Hovedbilde",
        toKvadratiske: "To kvadratiske bilder",
        toKvadratiskeSmal: "To kvadratiske bilder (smal)",
        treKvadratiske: "Tre kvadratiske bilder",
        kvadratRektangel: "Kvadrat og rektangel",
        toRektangulare: "To rektangulære bilder",
        treRektangulare: "Tre rektangulære bilder",
        storOgLiten: "Stor og liten (tre bilder grid)",
        fireIRekke: "Fire i rekke",
        toGangerTo: "2×2 rutenett (fire bilder)",
        toHoye: "To høye bilder (portrett)",
        treGangerTre: "3×3 rutenett (ni bilder)",
      };
      return {
        title: titles[layout] || "Bildemodul",
        media: media || images?.[0]?.image,
      };
    },
  },
});
