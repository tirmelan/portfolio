import { groq } from "next-sanity";

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    title,
    ingress,
    ctaButtons[] {
      label,
      href,
      color
    },
    featuredProjects[]-> {
      _id,
      clientName,
      title,
      slug,
      tags[]-> { _id, name, color },
      headerImage
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

export const aboutQuery = groq`
  *[_type == "about"][0] {
    title,
    content,
    skills,
    email,
    github,
    linkedin
  }
`;
