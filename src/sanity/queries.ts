import { groq } from "next-sanity";

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    title,
    ingress,
    ctaButtons[] {
      label,
      href,
      color
    }
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    image,
    tags,
    url,
    github,
    publishedAt
  }
`;

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    image,
    tags,
    url,
    github,
    publishedAt,
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
