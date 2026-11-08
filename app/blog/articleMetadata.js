const AUTHOR_PROFILES = {
  nitu: {
    title: "CEO & Career Guidance Expert",
    bio: "Nitu Dey is the CEO of ResumeSathi and a career guidance expert. She helps job seekers build strong resumes, prepare for interviews, and make confident career decisions. Her content is practical, easy to follow, and focused on real results for readers at every stage of their career.",
    image: "https://api.resumesathi.com/front-assets/images/nitu-dey.webp",
  },
  sumit: {
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
  const firstName = article?.user?.first_name?.trim().toLowerCase();
  return AUTHOR_PROFILES[firstName] || null;
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
