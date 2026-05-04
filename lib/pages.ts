import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import { absoluteUrl, blogSettings } from "@/lib/blog-settings"
import {
  excerptFromContent,
  isRecord,
  slugify,
  toBooleanValue,
  toIsoDate,
  toNumberValue,
  toStringArray,
  toStringValue,
  walkMdxFiles,
} from "@/lib/content-utils"
import type { ContentPage, PagePlacement, PageSummary } from "@/lib/post-types"

const pagesRoot = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  blogSettings.pagesDirectory
)

function placementFromFrontmatter(
  frontmatter: Record<string, unknown>,
  key: "navbar" | "footer",
  fallbackLabel: string,
  fallbackOrder: number
): PagePlacement {
  const nested = isRecord(frontmatter[key]) ? frontmatter[key] : {}
  const legacyShowKey = key === "navbar" ? "showInNavbar" : "showInFooter"
  const legacyLabelKey = key === "navbar" ? "navbarLabel" : "footerLabel"
  const legacyOrderKey = key === "navbar" ? "navbarOrder" : "footerOrder"

  return {
    show: toBooleanValue(
      nested.show,
      toBooleanValue(frontmatter[legacyShowKey], false)
    ),
    label:
      toStringValue(nested.label) ||
      toStringValue(frontmatter[legacyLabelKey]) ||
      fallbackLabel,
    order: toNumberValue(
      nested.order,
      toNumberValue(frontmatter[legacyOrderKey], fallbackOrder)
    ),
  }
}

function readPage(filePath: string): ContentPage {
  const raw = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(raw)
  const frontmatter = data as Record<string, unknown>
  const relativeToPages = path.relative(pagesRoot, filePath)
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/")
  const slug = slugify(toStringValue(frontmatter.slug, relativeToPages))
  const url = `/${slug}`
  const seo = isRecord(frontmatter.seo) ? frontmatter.seo : {}
  const title = toStringValue(frontmatter.title, slug)
  const description =
    toStringValue(frontmatter.description) ||
    toStringValue(seo.description) ||
    excerptFromContent(content)

  return {
    slug,
    slugSegments: slug.split("/"),
    sourcePath,
    url,
    absoluteUrl: absoluteUrl(url),
    title,
    description,
    updated: toIsoDate(frontmatter.updated ?? frontmatter.date),
    published: toBooleanValue(frontmatter.published, true),
    navbar: placementFromFrontmatter(frontmatter, "navbar", title, 50),
    footer: placementFromFrontmatter(frontmatter, "footer", title, 50),
    canonicalUrl: toStringValue(frontmatter.canonicalUrl) || undefined,
    seo: {
      title: toStringValue(seo.title) || undefined,
      description: toStringValue(seo.description) || undefined,
      image: toStringValue(seo.image) || undefined,
      keywords: toStringArray(seo.keywords),
    },
    content,
  }
}

export function getAllPages() {
  return walkMdxFiles(pagesRoot)
    .map(readPage)
    .filter((page) => page.published)
    .sort((pageA, pageB) => pageA.slug.localeCompare(pageB.slug))
}

export function getPageSummaries(): PageSummary[] {
  return getAllPages().map((page) => ({
    slug: page.slug,
    slugSegments: page.slugSegments,
    sourcePath: page.sourcePath,
    url: page.url,
    absoluteUrl: page.absoluteUrl,
    title: page.title,
    description: page.description,
    updated: page.updated,
    published: page.published,
    navbar: page.navbar,
    footer: page.footer,
    canonicalUrl: page.canonicalUrl,
    seo: page.seo,
  }))
}

export function getPageBySlug(slugSegments: string[] | string) {
  const slug = Array.isArray(slugSegments)
    ? slugSegments.join("/")
    : slugSegments.replace(/^\/+|\/+$/g, "")

  return getAllPages().find((page) => page.slug === slug)
}
