import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"
import readingTime from "reading-time"

import { absoluteUrl, blogSettings, githubEditUrl } from "@/lib/blog-settings"
import {
  excerptFromContent,
  isRecord,
  slugify,
  toBooleanValue,
  toIsoDate,
  toStringArray,
  toStringValue,
  walkMdxFiles,
} from "@/lib/content-utils"
import type { BlogPost, PostSummary, TagSummary } from "@/lib/post-types"

const postsRoot = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  blogSettings.postsDirectory
)

function readPost(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(raw)
  const frontmatter = data as Record<string, unknown>
  const relativeToPosts = path.relative(postsRoot, filePath)
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/")
  const slug = slugify(toStringValue(frontmatter.slug, relativeToPosts))
  const readingStats = readingTime(content)
  const seo = isRecord(frontmatter.seo) ? frontmatter.seo : {}
  const description =
    toStringValue(frontmatter.description) ||
    toStringValue(seo.description) ||
    excerptFromContent(content)
  const date = toIsoDate(frontmatter.date) ?? "1970-01-01T00:00:00.000Z"
  const readingMinutes = Math.max(1, Math.ceil(readingStats.minutes))
  const url = `/posts/${slug}`

  return {
    slug,
    slugSegments: slug.split("/"),
    sourcePath,
    editUrl: githubEditUrl(sourcePath),
    url,
    absoluteUrl: absoluteUrl(url),
    title: toStringValue(frontmatter.title, slug),
    description,
    date,
    updated: toIsoDate(frontmatter.updated),
    author: toStringValue(frontmatter.author, blogSettings.ownerName),
    tags: toStringArray(frontmatter.tags),
    published: toBooleanValue(frontmatter.published, true),
    featured: toBooleanValue(frontmatter.featured, false),
    coverImage: toStringValue(frontmatter.coverImage) || undefined,
    canonicalUrl: toStringValue(frontmatter.canonicalUrl) || undefined,
    seo: {
      title: toStringValue(seo.title) || undefined,
      description: toStringValue(seo.description) || undefined,
      image: toStringValue(seo.image) || undefined,
      keywords: toStringArray(seo.keywords),
    },
    content,
    readingMinutes,
    readingTimeLabel: `${readingMinutes} min read`,
  }
}

export function getAllPosts() {
  return walkMdxFiles(postsRoot)
    .map(readPost)
    .filter((post) => post.published)
    .sort((postA, postB) => {
      return new Date(postB.date).getTime() - new Date(postA.date).getTime()
    })
}

export function getPostSummaries(): PostSummary[] {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    slugSegments: post.slugSegments,
    sourcePath: post.sourcePath,
    editUrl: post.editUrl,
    url: post.url,
    absoluteUrl: post.absoluteUrl,
    title: post.title,
    description: post.description,
    date: post.date,
    updated: post.updated,
    author: post.author,
    tags: post.tags,
    published: post.published,
    featured: post.featured,
    coverImage: post.coverImage,
    canonicalUrl: post.canonicalUrl,
    seo: post.seo,
    readingMinutes: post.readingMinutes,
    readingTimeLabel: post.readingTimeLabel,
  }))
}

export function getFeaturedPost() {
  const posts = getAllPosts()

  return posts.find((post) => post.featured) ?? posts[0]
}

export function getPostBySlug(slugSegments: string[] | string) {
  const slug = Array.isArray(slugSegments)
    ? slugSegments.join("/")
    : slugSegments.replace(/^\/+|\/+$/g, "")

  return getAllPosts().find((post) => post.slug === slug)
}

export function getAllTags(): TagSummary[] {
  const counts = new Map<string, number>()

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((tagA, tagB) => tagA.name.localeCompare(tagB.name))
}
