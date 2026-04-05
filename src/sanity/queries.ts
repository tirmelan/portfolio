import { groq } from "next-sanity";

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    title,
    ingress,
    ctaButtons[] {
      label,
      "href": coalesce(internalPage, externalUrl),
      color
    },
    featuredProjects[]-> {
      _id,
      clientName,
      title,
      slug,
      tags[]-> { _id, name, color },
      headerImage,
      previewLayout,
      previewImage,
      previewImageLeft,
      previewImageRight
    }
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    clientName,
    title,
    slug,
    tags[]-> { _id, name, color },
    headerImage
  }
`;

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    clientName,
    title,
    slug,
    tags[]-> { _id, name, color },
    headerImage,
    ingress,
    kundeLabel,
    kunde,
    samarbeid,
    leveranse,
    periode,
    lenke,
    sections[] {
      _key,
      _type,
      storTittel,
      title,
      body,
      layout,
      position,
      image,
      alt,
      images[] { image, alt },
      imageLeft,
      altLeft,
      imageRight,
      altRight
    }
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`;

export const contactQuery = groq`
  *[_type == "contact"][0] {
    label,
    title,
    ingress,
    email,
    phone,
    linkedin,
    instagram
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    label,
    title,
    headerImage,
    sectionTitle,
    ingress,
    brodtekst,
    email,
    phone,
    ctaButtons[] {
      label,
      "href": coalesce(internalPage, externalUrl),
      color
    },
    utdanning[] {
      grad,
      institusjon,
      periode,
      notat
    },
    kurs[] {
      tittel,
      leverandor,
      ar,
      varighet,
      beskrivelse
    },
    anerkjennelse[] {
      tittel,
      beskrivelse
    }
  }
`;
