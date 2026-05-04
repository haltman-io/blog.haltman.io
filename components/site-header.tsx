import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr"

import { MobileNavigation } from "@/components/mobile-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { DecryptedText } from "@/components/reactbits/decrypted-text"
import { blogSettings } from "@/lib/blog-settings"
import { getNavbarLinks } from "@/lib/site-links"

function isHttpHref(href: string) {
  return /^https?:\/\//.test(href)
}

function isExternalHref(href: string) {
  return isHttpHref(href) || href.startsWith("mailto:")
}

export function SiteHeader() {
  const links = getNavbarLinks()

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex min-h-16 w-full items-center justify-between gap-3 border-x border-transparent px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
        >
          <div className="flex size-8 items-center justify-center border-2 border-foreground bg-foreground text-lg font-bold text-background transition-all group-hover:bg-background group-hover:text-foreground">
            {blogSettings.blogName.charAt(0)}
          </div>
          <DecryptedText
            text={blogSettings.blogName}
            speed={40}
            maxIterations={15}
            animateOn="hover"
            className="truncate text-lg font-bold tracking-tight"
            encryptedClassName="truncate text-lg font-bold tracking-tight text-muted-foreground"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden"
        >
          {links.map((item) => {
            const isExternal = isExternalHref(item.href)
            const isGitHub = item.href.includes("github.com")

            if (isExternal) {
              return (
                <Button
                  key={`${item.source}:${item.href}`}
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={
                    <a
                      href={item.href}
                      target={isHttpHref(item.href) ? "_blank" : undefined}
                      rel={isHttpHref(item.href) ? "noreferrer" : undefined}
                      aria-label={item.label}
                    />
                  }
                >
                  {isGitHub ? (
                    <GithubLogoIcon data-icon="inline-start" />
                  ) : null}
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              )
            }

            return (
              <Button
                key={`${item.source}:${item.href}`}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={item.href} />}
              >
                {item.label}
              </Button>
            )
          })}
          <ThemeToggle />
        </nav>

        <div className="flex shrink-0 items-center gap-1 md:hidden">
          <ThemeToggle />
          <MobileNavigation links={links} />
        </div>
      </div>
    </header>
  )
}
