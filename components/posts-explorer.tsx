"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FileTextIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PostCard } from "@/components/post-card"
import type { PostSummary, TagSummary } from "@/lib/post-types"
import { cn } from "@/lib/utils"

type PostsExplorerProps = {
  posts: PostSummary[]
  tags: TagSummary[]
  postsPerPage: number
}

function positiveInteger(value: string | null) {
  const parsedValue = Number.parseInt(value ?? "1", 10)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1
}

export function PostsExplorer({
  posts,
  tags,
  postsPerPage,
}: PostsExplorerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get("tag") ?? "all"
  const query = searchParams.get("q") ?? ""
  const currentPage = positiveInteger(searchParams.get("page"))

  const filteredPosts = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesTag =
        selectedTag === "all" ||
        post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())

      if (!matchesTag) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return [
        post.title,
        post.description,
        post.authors.join(" "),
        post.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [posts, query, selectedTag])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * postsPerPage
  const visiblePosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  )

  function hrefWithParams(nextParams: Record<string, string | number | null>) {
    const params = new URLSearchParams(searchParams.toString())
    const nextQuery = nextParams.q === undefined ? query : String(nextParams.q)

    if (nextQuery.trim()) {
      params.set("q", nextQuery)
    } else {
      params.delete("q")
    }

    for (const [key, value] of Object.entries(nextParams)) {
      if (key === "q") {
        continue
      }

      if (value === null || value === "" || value === "all" || value === 1) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    }

    const queryString = params.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-3 rounded-none border bg-card p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <label className="relative block min-w-0">
          <span className="sr-only">Search posts</span>
          <MagnifyingGlassIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            placeholder="Search title, author, or tag"
            className="pl-8"
            onChange={(event) => {
              router.replace(
                hrefWithParams({ q: event.target.value, page: 1 }),
                { scroll: false }
              )
            }}
          />
        </label>

        <p className="text-xs text-muted-foreground tabular-nums">
          {filteredPosts.length} of {posts.length} posts
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5" aria-label="Filter by tag">
          <Link
            href={hrefWithParams({ tag: "all", page: 1 })}
            className={cn(
              "inline-flex h-7 items-center border px-2 text-xs font-medium transition-colors hover:bg-muted",
              selectedTag === "all" ? "bg-primary text-primary-foreground" : ""
            )}
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={hrefWithParams({ tag: tag.name, page: 1 })}
              className={cn(
                "inline-flex h-7 items-center gap-1 border px-2 text-xs font-medium transition-colors hover:bg-muted",
                selectedTag.toLowerCase() === tag.name.toLowerCase()
                  ? "bg-primary text-primary-foreground"
                  : ""
              )}
            >
              {tag.name}
              <span className="text-[0.7rem] tabular-nums opacity-70">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {visiblePosts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No posts found</EmptyTitle>
            <EmptyDescription>
              Try another search term or clear the selected tag.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href={pathname}
              className="inline-flex h-8 items-center border px-2.5 text-xs font-medium hover:bg-muted"
            >
              Clear filters
            </Link>
          </EmptyContent>
        </Empty>
      )}

      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={hrefWithParams({ page: Math.max(1, safePage - 1) })}
                aria-disabled={safePage === 1}
                text="Previous"
              />
            </PaginationItem>
            {pageNumbers.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={hrefWithParams({ page: pageNumber })}
                  isActive={pageNumber === safePage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={hrefWithParams({
                  page: Math.min(totalPages, safePage + 1),
                })}
                aria-disabled={safePage === totalPages}
                text="Next"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  )
}
