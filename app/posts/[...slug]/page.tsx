import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import {
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
import {
  getGithubAuthorProfile,
  type GitHubAuthorProfile,
} from "@/lib/github-authors"
import { postTagHref } from "@/lib/post-tag-links"
import type { BlogPost } from "@/lib/post-types"
import { getAllPosts, getPostBySlug } from "@/lib/posts"

type PostPageProps = {
  params: Promise<{
    slug: string[]
  }>
}

type PostAuthorProfile = GitHubAuthorProfile & {
  name: string
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slugSegments,
  }))
}

function PostInfoMenu({
  post,
  displayEditOnGithub,
}: {
  post: BlogPost
  displayEditOnGithub: boolean
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground/90">
          Post info
        </h2>

        <div className="flex flex-col gap-3 text-xs text-muted-foreground">
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
      </div>

      {post.tags.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-foreground/90">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-none border border-border bg-background/80 px-2.5 py-1 text-xs font-medium transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 hover:border-foreground hover:bg-muted hover:text-foreground focus-visible:border-foreground active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                render={
                  <Link
                    href={postTagHref(tag)}
                    aria-label={`View posts tagged ${tag}`}
                  />
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {displayEditOnGithub ? (
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          className="w-full justify-start rounded-none text-xs font-medium transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 hover:border-foreground hover:bg-muted hover:text-foreground focus-visible:border-foreground active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          render={<a href={post.editUrl} target="_blank" rel="noreferrer" />}
        >
          <PencilSimpleLineIcon className="mr-2" />
          Edit on GitHub
        </Button>
      ) : null}
    </div>
  )
}

function PostAuthorByline({ authors }: { authors: PostAuthorProfile[] }) {
  return (
    <div className="border-b-2 border-border/70 bg-background/60 px-6 py-5 md:px-10">
      <div className="flex flex-wrap items-center gap-3">
        {authors.map((author) => {
          const fallbackInitials = author.name.trim().slice(0, 2).toUpperCase()

          return (
            <a
              key={author.name}
              href={author.profileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${author.name} on GitHub`}
              className="group/author inline-flex max-w-full items-center gap-3 border border-border bg-background/80 p-3 transition-[transform,border-color,background-color,color] hover:-translate-y-1 hover:border-foreground hover:bg-muted focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatarUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-none border border-border bg-muted object-cover transition-[border-color,filter] group-hover/author:border-foreground group-hover/author:saturate-125"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center border border-border bg-muted text-sm font-semibold text-foreground/90 transition-colors group-hover/author:border-foreground"
                >
                  {fallbackInitials || "?"}
                </span>
              )}
              <span className="min-w-0 truncate text-sm font-semibold text-foreground/90 transition-colors group-hover/author:text-foreground">
                {author.name}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

async function getPostAuthorProfiles(authors: string[]) {
  return Promise.all(
    authors.map(async (author) => {
      const profile = await getGithubAuthorProfile(author)

      return {
        ...profile,
        name: author,
      }
    })
  )
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
  const image =
    post.seo.image ??
    post.image ??
    post.coverImage ??
    blogSettings.defaultOgImage
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
      post.seo.image ??
        post.image ??
        post.coverImage ??
        blogSettings.defaultOgImage
    ),
  }
  const postImage = post.image ?? post.coverImage
  const displayAuthors = blogSettings.displayAuthors
  const displayPostInfoCard = blogSettings.displayPostInfoCard
  const displayTableOfContentsCard = blogSettings.displayTableOfContentsCard
  const authorProfiles = displayAuthors
    ? await getPostAuthorProfiles(post.authors)
    : []

  return (
    <main className="relative left-1/2 w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] -translate-x-1/2 px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 xl:max-w-[94rem] xl:grid-cols-[13rem_minmax(0,64rem)_13rem] xl:items-start">
        {displayTableOfContentsCard ? (
          <aside className="sticky top-32 hidden xl:block">
            <TableOfContents />
          </aside>
        ) : (
          <div className="hidden xl:block" aria-hidden />
        )}

        <div className="min-w-0">
          <article className="flex flex-col overflow-hidden rounded-none border-2 border-border/70 bg-background/85 text-left">
            <header className="flex flex-col gap-6 border-b-2 border-border/70 bg-background/60 p-6 pb-8 md:p-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-3xl leading-[1.12] font-semibold tracking-tight text-balance text-foreground/90 md:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                <p className="max-w-3xl text-base leading-relaxed font-light text-muted-foreground md:text-lg">
                  {post.description}
                </p>
              </div>

              <div className="mt-4 flex justify-center text-center">
                <div className="inline-flex max-w-full items-center border border-border bg-background/80 px-4 py-3 text-xs font-medium text-muted-foreground tabular-nums">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span aria-hidden className="px-3 text-border">
                    |
                  </span>
                  <span>{post.readingTimeLabel}</span>
                </div>
              </div>

              {postImage ? (
                <figure className="border border-border bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={postImage}
                    alt={post.title}
                    className="block aspect-[16/9] w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </figure>
              ) : null}
            </header>

            {displayPostInfoCard ? (
              <div className="border-b-2 border-border/70 bg-background/60 p-6 xl:hidden">
                <PostInfoMenu
                  post={post}
                  displayEditOnGithub={blogSettings.displayEditOnGithub}
                />
              </div>
            ) : null}

            {displayAuthors ? (
              <PostAuthorByline authors={authorProfiles} />
            ) : null}

            <div className="prose-blog p-6 text-left md:p-10">
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
        </div>

        {displayPostInfoCard ? (
          <aside className="sticky top-32 hidden xl:block">
            <div className="flex max-h-[calc(100svh-8rem)] flex-col gap-5 overflow-y-auto rounded-none border border-border bg-card p-4 shadow-sm">
              <PostInfoMenu
                post={post}
                displayEditOnGithub={blogSettings.displayEditOnGithub}
              />
            </div>
          </aside>
        ) : (
          <div className="hidden xl:block" aria-hidden />
        )}
      </div>
    </main>
  )
}
