import type { Metadata } from "next"
import Link from "next/link"
import { FileTextIcon } from "@phosphor-icons/react/dist/ssr"

import { HeroCarousel } from "@/components/hero-carousel"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { absoluteUrl, blogSettings } from "@/lib/blog-settings"
import { getAllTags, getPostSummaries } from "@/lib/posts"

export const metadata: Metadata = {
  title: blogSettings.blogName,
  description: blogSettings.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
}

export default function Page() {
  const posts = getPostSummaries()
  const featuredPosts = posts.filter((post) => post.featured)
  const latestPosts = posts.slice(5, 11) // Remaining posts
  const tags = getAllTags().slice(0, 10)

  return (
    <main className="flex w-full animate-in flex-col gap-14 px-4 py-8 md:py-16 duration-1000 zoom-in-95 fade-in sm:px-6 lg:px-8">
      
      {featuredPosts.length > 0 ? (
        <section className="relative w-full">
          <div className="mb-6 flex items-center justify-between pb-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground/90">
               Featured Content
            </h1>
          </div>
          <HeroCarousel posts={featuredPosts} />
        </section>
      ) : null}

      {/* ORIGINAL LATEST POSTS & SIDEBAR */}
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4 pb-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">
                Latest Activity
              </h2>
              <p className="text-sm text-muted-foreground">
                Newest posts only.
              </p>
            </div>
            <Link
              href="/posts"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground hover:underline sm:inline-flex transition-colors"
            >
              View archive
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {latestPosts.map((post, index) => (
                <PostCard key={post.slug} post={post} priority={index === 0} />
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border border-border bg-card/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-10">
                <FileTextIcon
                  aria-hidden
                  className="size-8 text-muted-foreground/50"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  No additional records found.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-foreground/90">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant="secondary"
                  className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {tag.name}
                  <span className="ml-1.5 opacity-50">
                    {tag.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground px-2">
            <p className="font-medium text-foreground">{blogSettings.ownerName}</p>
            <p>{blogSettings.ownerRole}</p>
            <a
              href={`mailto:${blogSettings.email}`}
              className="self-start transition-colors hover:text-foreground mt-2"
            >
              {blogSettings.email}
            </a>
          </div>
        </aside>
      </section>
    </main>
  )
}
