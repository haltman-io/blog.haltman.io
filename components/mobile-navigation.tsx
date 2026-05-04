"use client"

import * as React from "react"
import Link from "next/link"
import { GithubLogoIcon, ListIcon, XIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import type { SiteLink } from "@/lib/site-links"
import { cn } from "@/lib/utils"

type MobileNavigationProps = {
  links: SiteLink[]
}

function isHttpHref(href: string) {
  return /^https?:\/\//.test(href)
}

function isExternalHref(href: string) {
  return isHttpHref(href) || href.startsWith("mailto:")
}

export function MobileNavigation({ links }: MobileNavigationProps) {
  const [open, setOpen] = React.useState(false)
  const menuId = React.useId()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <div className="md:hidden">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <XIcon /> : <ListIcon />}
      </Button>

      <div
        id={menuId}
        data-open={open}
        className={cn(
          "absolute top-full right-0 left-0 border-b border-border bg-background/95 px-4 py-3 shadow-[0_12px_32px_rgb(0_0_0/0.08)] backdrop-blur transition-[opacity,transform] duration-150",
          "data-[open=false]:pointer-events-none data-[open=false]:-translate-y-2 data-[open=false]:opacity-0",
          "data-[open=true]:translate-y-0 data-[open=true]:opacity-100"
        )}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
          {links.map((item) => {
            const isExternal = isExternalHref(item.href)
            const isGitHub = item.href.includes("github.com")
            const className =
              "flex min-h-11 items-center justify-between border border-transparent px-3 text-sm font-medium transition-colors hover:border-border hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"

            if (isExternal) {
              return (
                <a
                  key={`${item.source}:${item.href}`}
                  href={item.href}
                  target={isHttpHref(item.href) ? "_blank" : undefined}
                  rel={isHttpHref(item.href) ? "noreferrer" : undefined}
                  className={className}
                  onClick={() => setOpen(false)}
                >
                  <span>{item.label}</span>
                  {isGitHub ? <GithubLogoIcon aria-hidden /> : null}
                </a>
              )
            }

            return (
              <Link
                key={`${item.source}:${item.href}`}
                href={item.href}
                className={className}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
