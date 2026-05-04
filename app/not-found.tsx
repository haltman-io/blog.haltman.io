import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60svh] w-full max-w-3xl flex-col justify-center gap-5 px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-medium text-muted-foreground">404</p>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-medium tracking-tight text-balance">
          Page not found.
        </h1>
        <p className="text-sm/6 text-muted-foreground">
          The page may have moved, or the post slug no longer exists.
        </p>
      </div>
      <div>
        <Button nativeButton={false} render={<Link href="/posts" />}>
          View posts
        </Button>
      </div>
    </main>
  )
}
