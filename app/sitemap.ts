import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/blog-settings"
import { getAllPages } from "@/lib/pages"
import { getAllPosts } from "@/lib/posts"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const allPosts = getAllPosts()
  const allPages = getAllPages()
  const latestDate =
    [
      ...allPosts.map((post) => post.updated ?? post.date),
      ...allPages.map((page) => page.updated),
    ]
      .filter(Boolean)
      .sort()
      .at(-1) ?? "1970-01-01"
  const posts = allPosts.map((post) => ({
    url: post.absoluteUrl,
    lastModified: post.updated ?? post.date,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  const pages = allPages.map((page) => ({
    url: page.absoluteUrl,
    lastModified: page.updated ?? latestDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/posts"),
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...pages,
    ...posts,
  ]
}
