type ProjectWithOptionalHref = { href?: unknown };

export function publishedProjects<T extends ProjectWithOptionalHref>(projects: T[]): T[] {
  return projects.filter(
    (project) => typeof project.href === "string" && project.href.trim().length > 0,
  );
}
