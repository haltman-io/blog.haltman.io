import Link from "next/link"
import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatPostDate } from "@/lib/format"
import type { PostSummary } from "@/lib/post-types"

type PostCardProps = {
  post: PostSummary
  priority?: boolean
}

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <Card
      className="relative flex h-full flex-col rounded-none border-2 border-border/50 bg-transparent transition-all duration-200 hover:-translate-y-1 hover:border-foreground hover:shadow-[8px_8px_0px_var(--foreground)] motion-reduce:transition-none dark:hover:shadow-[8px_8px_0px_var(--foreground)]"
      data-priority={priority}
    >
      <CardHeader>
        <CardTitle className="text-base leading-snug tracking-tight">
          <Link href={post.url} className="focus-visible:outline-none">
            <span className="absolute inset-0" aria-hidden />
            {post.title}
          </Link>
        </CardTitle>
        <CardAction>
          <ArrowRightIcon
            aria-hidden
            className="size-4 text-muted-foreground"
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="line-clamp-3 text-sm/6 text-pretty text-muted-foreground">
          {post.description}
        </p>
        {post.tags.length > 0 ? (
          <div className="relative flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between gap-3 text-muted-foreground">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        <span className="inline-flex items-center gap-1 tabular-nums">
          <ClockIcon aria-hidden className="size-3.5" />
          {post.readingTimeLabel}
        </span>
      </CardFooter>
    </Card>
  )
}
