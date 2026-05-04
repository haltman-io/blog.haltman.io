import { blogSettings, type BlogNavigationItem } from "@/lib/blog-settings"
import { getPageSummaries } from "@/lib/pages"

export type SiteLink = {
  label: string
  href: string
  order: number
  source: "settings" | "page"
}

function configuredLinks(links: BlogNavigationItem[] = []): SiteLink[] {
  return links.map((link, index) => ({
    label: link.label,
    href: link.href,
    order: link.order ?? index + 1,
    source: "settings",
  }))
}

function sortLinks(links: SiteLink[]) {
  return links.sort((linkA, linkB) => {
    const orderDifference = linkA.order - linkB.order

    if (orderDifference !== 0) {
      return orderDifference
    }

    return linkA.label.localeCompare(linkB.label)
  })
}

export function getNavbarLinks() {
  const settingLinks = configuredLinks(
    blogSettings.navbar?.links ?? blogSettings.navigation ?? []
  )
  const pageLinks = getPageSummaries()
    .filter((page) => page.navbar.show)
    .map((page) => ({
      label: page.navbar.label,
      href: page.url,
      order: page.navbar.order,
      source: "page" as const,
    }))

  return sortLinks([...settingLinks, ...pageLinks])
}

export function getFooterLinks() {
  const settingLinks = configuredLinks(blogSettings.footer?.links ?? [])
  const pageLinks = getPageSummaries()
    .filter((page) => page.footer.show)
    .map((page) => ({
      label: page.footer.label,
      href: page.url,
      order: page.footer.order,
      source: "page" as const,
    }))

  return sortLinks([...settingLinks, ...pageLinks])
}
