import settings from "@/blog-settings.json"

export type BlogNavigationItem = {
  label: string
  href: string
  order?: number
}

export type BlogSettings = {
  blogName: string
  description: string
  siteUrl: string
  language: string
  locale: string
  ownerName: string
  ownerRole?: string
  email: string
  repositoryUrl: string
  repositoryBranch: string
  displayDemoNotice: boolean
  postsDirectory: string
  pagesDirectory: string
  postsPerPage: number
  favicon: string
  defaultOgImage: string
  logo: {
    light: string
    dark: string
    mark: string
  }
  keywords: string[]
  navbar: {
    links: BlogNavigationItem[]
  }
  footer: {
    links: BlogNavigationItem[]
  }
  navigation?: BlogNavigationItem[]
  social: Record<string, string>
}

export const blogSettings = settings as BlogSettings

export const siteUrl = blogSettings.siteUrl.replace(/\/$/, "")

export function absoluteUrl(pathname = "/") {
  if (/^https?:\/\//.test(pathname)) {
    return pathname
  }

  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`

  return `${siteUrl}${normalizedPathname}`
}

export function repositoryUrl() {
  return blogSettings.repositoryUrl.replace(/\.git$/, "").replace(/\/$/, "")
}

export function githubEditUrl(filePath: string) {
  const normalizedPath = filePath.replace(/\\/g, "/")

  return `${repositoryUrl()}/edit/${blogSettings.repositoryBranch}/${normalizedPath}`
}
