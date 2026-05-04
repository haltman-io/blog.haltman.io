import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { mdxComponents } from "@/components/mdx-components"
import { absoluteUrl, blogSettings } from "@/lib/blog-settings"
import { getAllPages, getPageBySlug } from "@/lib/pages"

type StaticPageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPages().map((page) => ({
    slug: page.slugSegments,
  }))
}

export async function generateMetadata({
  params,
}: StaticPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getPageBySlug(slug)

  if (!page) {
    return {}
  }

  const title = page.seo.title ?? page.title
  const description = page.seo.description ?? page.description
  const image = page.seo.image ?? blogSettings.defaultOgImage
  const canonical = page.canonicalUrl ?? page.absoluteUrl

  return {
    title,
    description,
    keywords: [...blogSettings.keywords, ...(page.seo.keywords ?? [])],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: blogSettings.blogName,
      type: "website",
      images: [absoluteUrl(image)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  }
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { slug } = await params
  const page = getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: page.absoluteUrl,
    isPartOf: {
      "@type": "Blog",
      name: blogSettings.blogName,
      url: blogSettings.siteUrl,
    },
  }

  return (
    <main className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-l-4 border-foreground pl-6">
          <h1 className="text-4xl font-black tracking-tight text-balance md:text-6xl">
            {page.title}
          </h1>
          <p className="max-w-2xl text-base/7 font-medium text-pretty text-muted-foreground">
            {page.description}
          </p>
        </header>

        <div className="prose-blog">
          <MDXRemote
            source={page.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "wrap",
                      properties: {
                        className: "anchor-heading",
                      },
                    },
                  ],
                ],
              },
            }}
          />
        </div>
      </article>
    </main>
  )
}
