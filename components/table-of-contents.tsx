"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function TableOfContents() {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Delay slightly to ensure MDX content is rendered and IDs are attached
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(
          ".prose-blog h1, .prose-blog h2, .prose-blog h3, .prose-blog h4"
        )
      )
        .filter((element) => element.id)
        .map((element) => ({
          id: element.id,
          text: element.textContent || "",
          level: Number(element.tagName.charAt(1)),
        }))

      setHeadings(elements)

      const observer = new IntersectionObserver(
        (entries) => {
          // Find all intersecting entries
          const visibleEntries = entries.filter((e) => e.isIntersecting)
          if (visibleEntries.length > 0) {
            // Update to the last visible heading for top-down reading flow
            setActiveId(visibleEntries[visibleEntries.length - 1].target.id)
          }
        },
        { rootMargin: "0% 0% -60% 0%" }
      )

      elements.forEach((h) => {
        const el = document.getElementById(h.id)
        if (el) observer.observe(el)
      })

      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="flex max-h-[calc(100svh-8rem)] flex-col gap-4 overflow-y-auto rounded-none border border-border bg-card p-4 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/90">
        On this page
      </h3>
      <div className="flex flex-col gap-1.5">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "py-1 text-[13px] break-words transition-all outline-none",
              activeId === heading.id
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground",
              heading.level === 3 ? "ml-3" : heading.level === 4 ? "ml-6" : ""
            )}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </div>
  )
}
