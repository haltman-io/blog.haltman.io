import type { Metadata } from "next"
import Link from "next/link"
import { FileTextIcon } from "@phosphor-icons/react/dist/ssr"

import { HeroCarousel } from "@/components/hero-carousel"
import { PostCard } from "@/components/post-card"
import { Card, CardContent } from "@/components/ui/card"
import { absoluteUrl, blogSettings } from "@/lib/blog-settings"
import { getPostSummaries } from "@/lib/posts"

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
  const latestPosts = posts.filter((post) => !post.featured).slice(0, 6)

  return (
    <main className="flex w-full animate-in flex-col gap-14 px-4 py-8 duration-1000 zoom-in-95 fade-in sm:px-6 md:py-16 lg:px-8">
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

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4 pb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">
              Latest Activity
            </h2>
            <p className="text-sm text-muted-foreground">Newest posts only.</p>
          </div>
          <Link
            href="/posts"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline sm:inline-flex"
          >
            View archive
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} priority={index === 0} />
            ))}
          </div>
        ) : (
          <Card className="rounded-none border border-border bg-card/50 shadow-sm">
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
      </section>
    </main>
  )
}
