export type PostSeo = {
  title?: string
  description?: string
  image?: string
  keywords?: string[]
}

export type BlogPost = {
  slug: string
  slugSegments: string[]
  sourcePath: string
  editUrl: string
  url: string
  absoluteUrl: string
  title: string
  description: string
  date: string
  updated?: string
  author: string
  tags: string[]
  published: boolean
  featured: boolean
  image?: string
  coverImage?: string
  canonicalUrl?: string
  seo: PostSeo
  content: string
  readingMinutes: number
  readingTimeLabel: string
}

export type PostSummary = Omit<BlogPost, "content">

export type TagSummary = {
  name: string
  count: number
}

export type PageSeo = {
  title?: string
  description?: string
  image?: string
  keywords?: string[]
}

export type PagePlacement = {
  show: boolean
  label: string
  order: number
}

export type ContentPage = {
  slug: string
  slugSegments: string[]
  sourcePath: string
  url: string
  absoluteUrl: string
  title: string
  description: string
  updated?: string
  published: boolean
  navbar: PagePlacement
  footer: PagePlacement
  canonicalUrl?: string
  seo: PageSeo
  content: string
}

export type PageSummary = Omit<ContentPage, "content">
