import { groq } from "next-sanity";

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    name,
    role,
    bio,
    profileImage
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
