import { blogSettings } from "@/lib/blog-settings"
import { getPostSummaries } from "@/lib/posts"

export const dynamic = "force-static"

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function GET() {
  const items = getPostSummaries()
    .map((post) => {
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(post.absoluteUrl)}</link>
          <guid>${escapeXml(post.absoluteUrl)}</guid>
          <description>${escapeXml(post.description)}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <author>${escapeXml(blogSettings.email)} (${escapeXml(post.author)})</author>
        </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(blogSettings.blogName)}</title>
        <link>${escapeXml(blogSettings.siteUrl)}</link>
        <description>${escapeXml(blogSettings.description)}</description>
        <language>${escapeXml(blogSettings.language)}</language>
        ${items}
      </channel>
    </rss>`

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  })
}
