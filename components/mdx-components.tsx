import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type ElementProps<T extends keyof React.JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T>

function isExternalHref(href?: string) {
  return href ? /^https?:\/\//.test(href) : false
}

function MdxImage({ className, alt, ...props }: ElementProps<"img">) {
  return (
    <figure className="my-8 flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt}
        className={cn(
          "block w-[720px] max-w-full rounded-none border object-contain",
          className
        )}
        loading="lazy"
        decoding="async"
        {...props}
      />
      {alt ? (
        <figcaption className="max-w-[720px] text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  )
}

function isImageOnlyChild(child: unknown) {
  if (!React.isValidElement(child)) {
    return false
  }

  if (child.type === "img" || child.type === MdxImage) {
    return true
  }

  return (
    typeof child.props === "object" &&
    child.props !== null &&
    "src" in child.props
  )
}

export const mdxComponents = {
  h1: ({ className, ...props }: ElementProps<"h1">) => (
    <h1
      className={cn("mt-10 text-3xl font-medium tracking-tight", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ElementProps<"h2">) => (
    <h2
      className={cn(
        "mt-10 scroll-mt-24 text-2xl font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ElementProps<"h3">) => (
    <h3
      className={cn("mt-8 scroll-mt-24 text-xl font-medium", className)}
      {...props}
    />
  ),
  p: ({ className, children, ...props }: ElementProps<"p">) => {
    const childArray = React.Children.toArray(children)
    const containsOnlyImage =
      childArray.length === 1 && isImageOnlyChild(childArray[0])

    if (containsOnlyImage) {
      return <>{children}</>
    }

    return (
      <p className={cn("text-pretty", className)} {...props}>
        {children}
      </p>
    )
  },
  a: ({ href = "", className, ...props }: ElementProps<"a">) => {
    if (isExternalHref(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn("underline underline-offset-4", className)}
          {...props}
        />
      )
    }

    return (
      <Link
        href={href}
        className={cn("underline underline-offset-4", className)}
        {...props}
      />
    )
  },
  ul: ({ className, ...props }: ElementProps<"ul">) => (
    <ul className={cn("ml-5 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: ElementProps<"ol">) => (
    <ol className={cn("ml-5 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: ElementProps<"li">) => (
    <li className={cn("pl-1", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ElementProps<"blockquote">) => (
    <blockquote
      className={cn(
        "border-l-2 pl-4 text-muted-foreground [&>p]:my-0",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ElementProps<"code">) => (
    <code
      className={cn(
        "rounded-none bg-muted px-1 py-0.5 text-[0.85em] text-foreground",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: ElementProps<"pre">) => (
    <pre
      className={cn(
        "overflow-x-auto rounded-none border bg-muted/60 p-4 text-xs leading-relaxed",
        className
      )}
      {...props}
    />
  ),
  img: MdxImage,
  table: ({ className, ...props }: ElementProps<"table">) => (
    <div className="overflow-x-auto">
      <table className={cn("w-full text-left text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: ElementProps<"th">) => (
    <th
      className={cn("border-b px-3 py-2 font-medium", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: ElementProps<"td">) => (
    <td className={cn("border-b px-3 py-2", className)} {...props} />
  ),
}
