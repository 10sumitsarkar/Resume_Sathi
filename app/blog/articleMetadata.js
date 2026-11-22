export const AUTHOR_PROFILES = {
  nitu: {
    slug: "nitu-dey",
    name: "Nitu Dey",
    title: "CEO & Career Guidance Expert",
    bio: "Nitu Dey is the CEO of ResumeSathi and a career guidance expert. She helps job seekers build strong resumes, prepare for interviews, and make confident career decisions. Her content is practical, easy to follow, and focused on real results for readers at every stage of their career.",
    image: "https://api.resumesathi.com/front-assets/images/nitu-dey.webp",
  },
  sumit: {
    slug: "sumit-sarkar",
    name: "Sumit Sarkar",
    title: "Content Writer & Full-Stack Web Developer",
    bio: "Sumit Sarkar is a content writer and full-stack web developer at ResumeSathi. He combines his writing skills with hands-on technical experience to create useful career resources and build smooth, user-friendly web experiences for job seekers.",
    image: "https://api.resumesathi.com/front-assets/images/sumit-sarkar.webp",
  },
};

export function getArticleAuthorName(article) {
  return (
    [article?.user?.first_name, article?.user?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    article?.user?.name ||
    "Admin"
  );
}

export function getArticleAuthorProfile(article) {
  const authorKey = getArticleAuthorKey(article);
  return AUTHOR_PROFILES[authorKey] || null;
}

function getArticleAuthorKey(article) {
  const firstName = article?.user?.first_name?.trim().toLowerCase();
  if (firstName && AUTHOR_PROFILES[firstName]) return firstName;

  const fullName = getArticleAuthorName(article).toLowerCase();
  return Object.keys(AUTHOR_PROFILES).find(
    (key) => AUTHOR_PROFILES[key].name.toLowerCase() === fullName,
  );
}

export function getArticleAuthorSlug(article) {
  const authorKey = getArticleAuthorKey(article);
  return AUTHOR_PROFILES[authorKey]?.slug || "";
}

export function getAuthorProfileBySlug(slug) {
  return Object.values(AUTHOR_PROFILES).find(
    (profile) => profile.slug === slug,
  ) || null;
}

export function getAuthorProfiles() {
  return Object.values(AUTHOR_PROFILES);
}

export function getArticleLastUpdatedAt(article) {
  const timestamps = [
    article?.created_at,
    article?.updated_at,
    ...(Array.isArray(article?.contents)
      ? article.contents.flatMap((item) => [item?.created_at, item?.updated_at])
      : []),
  ].filter((value) => value && !Number.isNaN(Date.parse(value)));

  return timestamps.reduce(
    (latest, value) =>
      !latest || Date.parse(value) > Date.parse(latest) ? value : latest,
    "",
  );
}
