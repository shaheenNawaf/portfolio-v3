import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const category = z.enum(["software", "marketing", "systems"]);

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    category,
    title: z.string(),
    date: z.string(),
    role: z.string(),
    color: z.string().default("#3b82f6"),
    results: z.string().optional(),
    deliverables: z.array(z.string()).default([]),
    gallery: z.array(z.string()).default([]),
    // description lives in the Markdown body; kept optional here for
    // backwards-compat with any entry that still has it in frontmatter.
    description: z.string().optional(),
    media: z
      .object({
        type: z.enum(["video", "image"]),
        url: z.string(),
        thumbnail: z.string().optional(),
      })
      .optional(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    impact: z.string().optional(),
    caseStudyHref: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experiences" }),
  schema: z.object({
    category,
    title: z.string(),
    company: z.string(),
    date: z.string(),
    location: z.string(),
    color: z.string().default("#3b82f6"),
    description: z.string().optional(),
    details: z.array(z.string()).default([]),
    gallery: z.array(z.string()).default([]),
    video: z.string().optional(),
    tech: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, experiences };
