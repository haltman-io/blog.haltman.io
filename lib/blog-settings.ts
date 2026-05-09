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
  displayAuthors: boolean
  displayEditOnGithub: boolean
  displayPostInfoCard: boolean
  displayTableOfContentsCard: boolean
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

type RawBlogSettings = Omit<
  BlogSettings,
  | "displayAuthors"
  | "displayEditOnGithub"
  | "displayPostInfoCard"
  | "displayTableOfContentsCard"
> &
  Partial<
    Pick<
      BlogSettings,
      | "displayAuthors"
      | "displayEditOnGithub"
      | "displayPostInfoCard"
      | "displayTableOfContentsCard"
    >
  >

const rawSettings = settings as RawBlogSettings

export const blogSettings: BlogSettings = {
  ...rawSettings,
  displayAuthors: rawSettings.displayAuthors ?? true,
  displayEditOnGithub: rawSettings.displayEditOnGithub ?? true,
  displayPostInfoCard: rawSettings.displayPostInfoCard ?? true,
  displayTableOfContentsCard: rawSettings.displayTableOfContentsCard ?? true,
}

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
