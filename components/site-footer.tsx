import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr"

import { blogSettings } from "@/lib/blog-settings"
import { getFooterLinks } from "@/lib/site-links"

function isHttpHref(href: string) {
  return /^https?:\/\//.test(href)
}

function isExternalHref(href: string) {
  return isHttpHref(href) || href.startsWith("mailto:")
}

export function SiteFooter() {
  const links = getFooterLinks()

  return (
    <footer className="border-t border-border bg-background/90">
      <div className="flex w-full flex-col gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col gap-1 font-bold">
          <p className="text-foreground">{blogSettings.blogName}</p>
          <p>
            {blogSettings.ownerName}
            {blogSettings.ownerRole ? `, ${blogSettings.ownerRole}` : null}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {links.map((item) => {
            const isExternal = isExternalHref(item.href)
            const isGitHub = item.href.includes("github.com")
            const className =
              "inline-flex items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"

            if (isExternal) {
              return (
                <a
                  key={`${item.source}:${item.href}`}
                  href={item.href}
                  target={isHttpHref(item.href) ? "_blank" : undefined}
                  rel={isHttpHref(item.href) ? "noreferrer" : undefined}
                  className={className}
                >
                  {isGitHub ? (
                    <GithubLogoIcon aria-hidden className="size-3.5" />
                  ) : null}
                  {item.label}
                </a>
              )
            }

            return (
              <Link
                key={`${item.source}:${item.href}`}
                href={item.href}
                className={className}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
