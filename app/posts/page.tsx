import { Suspense } from "react"
import type { Metadata } from "next"

import { PostsExplorer } from "@/components/posts-explorer"
import { Card, CardContent } from "@/components/ui/card"
import { absoluteUrl, blogSettings } from "@/lib/blog-settings"
import { getAllTags, getPostSummaries } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Posts",
  description: `All posts from ${blogSettings.blogName}.`,
  alternates: {
    canonical: absoluteUrl("/posts"),
  },
  openGraph: {
    title: `Posts | ${blogSettings.blogName}`,
    description: `All posts from ${blogSettings.blogName}.`,
    url: absoluteUrl("/posts"),
    type: "website",
    images: [absoluteUrl(blogSettings.defaultOgImage)],
  },
}

export default function PostsPage() {
  const posts = getPostSummaries()
  const tags = getAllTags()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(220px,0.35fr)] md:items-end">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground">Archive</p>
          <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-balance md:text-5xl">
            Posts, notes, and references.
          </h1>
          <p className="max-w-2xl text-sm/6 text-pretty text-muted-foreground">
            Browse the full archive by title, author, and tag. Filters are kept
            in the URL so every view can be shared.
          </p>
        </div>

        <Card size="sm">
          <CardContent className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-2xl font-medium tabular-nums">
                {posts.length}
              </p>
              <p className="text-muted-foreground">Published</p>
            </div>
            <div>
              <p className="text-2xl font-medium tabular-nums">{tags.length}</p>
              <p className="text-muted-foreground">Tags</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Suspense fallback={<div className="h-40 rounded-none border" />}>
        <PostsExplorer
          posts={posts}
          tags={tags}
          postsPerPage={blogSettings.postsPerPage}
        />
      </Suspense>
    </main>
  )
}
