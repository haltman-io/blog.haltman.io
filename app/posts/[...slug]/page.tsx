import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  ClockIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react/dist/ssr"

import { mdxComponents } from "@/components/mdx-components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "@/components/table-of-contents"
import { absoluteUrl, blogSettings } from "@/lib/blog-settings"
import { formatPostDate } from "@/lib/format"
import { getAllPosts, getPostBySlug } from "@/lib/posts"

type PostPageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slugSegments,
  }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {}
  }

  const title = post.seo.title ?? post.title
  const description = post.seo.description ?? post.description
  const image = post.seo.image ?? post.coverImage ?? blogSettings.defaultOgImage
  const canonical = post.canonicalUrl ?? post.absoluteUrl

  return {
    title,
    description,
    keywords: [
      ...blogSettings.keywords,
      ...post.tags,
      ...(post.seo.keywords ?? []),
    ],
    alternates: {
      canonical,
    },
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Person",
      name: blogSettings.ownerName,
    },
    mainEntityOfPage: post.absoluteUrl,
    url: post.absoluteUrl,
    keywords: post.tags,
    image: absoluteUrl(
      post.seo.image ?? post.coverImage ?? blogSettings.defaultOgImage
    ),
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="rounded-none text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          render={<Link href="/posts" />}
        >
          <ArrowLeftIcon className="mr-2" />
          Back to archive
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_250px]">
        <article className="flex flex-col overflow-hidden rounded-none border-2 border-border/70 bg-background/85 shadow-[8px_8px_0px_var(--foreground)]">
          <header className="flex flex-col gap-6 border-b-2 border-border/70 bg-background/60 p-6 pb-8 md:p-10">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-none border border-border bg-background/80 px-2.5 py-1 text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <h1 className="text-3xl leading-[1.12] font-semibold tracking-tight text-balance text-foreground/90 md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed font-light text-muted-foreground md:text-lg">
                {post.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">{post.author}</span>
              <time
                dateTime={post.date}
                className="inline-flex items-center gap-1.5"
              >
                <CalendarBlankIcon aria-hidden className="size-4" />
                {formatPostDate(post.date)}
              </time>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon aria-hidden className="size-4" />
                {post.readingTimeLabel}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="rounded-none text-xs font-medium"
                render={
                  <a href={post.editUrl} target="_blank" rel="noreferrer" />
                }
              >
                <PencilSimpleLineIcon className="mr-2" />
                Edit on GitHub
              </Button>
            </div>
          </header>

          <div className="prose-blog p-6 md:p-10">
            <MDXRemote
              source={post.content}
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

        <aside className="sticky top-32 hidden lg:block">
          <TableOfContents />
        </aside>
      </div>
    </main>
  )
}
