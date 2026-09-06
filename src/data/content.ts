import { getCollection } from "astro:content";
import type { Experience, Project } from "./resume";
import { experienceTech } from "./resume";

/**
 * Single source of truth for CMS-managed content.
 * Projects / experiences are Markdown files in `src/content/*` (editable via /admin).
 * `description` lives in the Markdown body; frontmatter `description` (if present)
 * wins for backwards-compat.
 */

// Legacy order from resume.ts so the migration doesn't reshuffle the site.
// New CMS entries (not in these lists) are appended at the end.
const projectOrder = [
  "campaign-rivalry-tribe-main",
  "campaign-rivalry-evergreen",
  "campaign-slamdunk-slips",
  "campaign-kuyanic-ti",
  "campaign-sgc-launch",
  "campaign-rampage-report",
  "campaign-valentines-parlay",
  "campaign-growth-automation",
  "proj-gymeasy",
  "proj-agripinoy",
  "proj-staysafe",
  "proj-JCSD",
  "proj-esp32",
];

const experienceOrder = [
  "exp-gymeasy-dev",
  "exp-jairosoft-intern",
  "exp-addu-cs",
  "exp-yohoho-lead",
  "exp-yohoho-influ",
  "exp-rivalry-partnerships",
  "exp-rivalry-community",
  "exp-rivalry-campaigns",
];

function byOrder(order: readonly string[]) {
  const rank = new Map(order.map((id, i) => [id, i]));
  return (a: { id: string }, b: { id: string }) =>
    (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER) ||
    a.id.localeCompare(b.id);
}
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection("projects");
  return entries
    .map((e) => ({
      id: e.id.replace(/\.md$/, ""),
      category: e.data.category,
      title: e.data.title,
      date: e.data.date,
      role: e.data.role,
      color: e.data.color,
      results: e.data.results,
      deliverables: e.data.deliverables,
      gallery: e.data.gallery,
      description: (e.data.description ?? e.body?.trim() ?? "").trim(),
      media: e.data.media,
      liveUrl: e.data.liveUrl,
      repoUrl: e.data.repoUrl,
      problem: e.data.problem,
      solution: e.data.solution,
      impact: e.data.impact,
      caseStudyHref: e.data.caseStudyHref,
      draft: e.data.draft,
      tags: e.data.tags,
    }))
    .sort(byOrder(projectOrder));
}

export async function getExperiences(): Promise<Experience[]> {
  const entries = await getCollection("experiences");
  return entries
    .map((e) => {
      const id = e.id.replace(/\.md$/, "");
      return {
        id,
        category: e.data.category,
        title: e.data.title,
        company: e.data.company,
        date: e.data.date,
        location: e.data.location,
        color: e.data.color,
        description: (e.data.description ?? e.body?.trim() ?? "").trim(),
        details: e.data.details,
        gallery: e.data.gallery,
        video: e.data.video,
        // `tech` now lives in frontmatter (editable in /admin);
        // fall back to the legacy map so old entries keep their chips.
        tech: e.data.tech.length > 0 ? e.data.tech : (experienceTech[id] ?? []),
      };
    })
    .sort(byOrder(experienceOrder));
}
