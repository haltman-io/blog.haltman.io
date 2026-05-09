import type { Metadata, Viewport } from "next"
import { JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { DemoNoticeModal } from "@/components/demo-notice-modal"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { absoluteUrl, blogSettings } from "@/lib/blog-settings"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(blogSettings.siteUrl),
  title: {
    default: blogSettings.blogName,
    template: `%s | ${blogSettings.blogName}`,
  },
  description: blogSettings.description,
  keywords: blogSettings.keywords,
  authors: [{ name: blogSettings.ownerName }],
  creator: blogSettings.ownerName,
  icons: {
    icon: blogSettings.favicon,
  },
  alternates: {
    canonical: absoluteUrl("/"),
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
  openGraph: {
    title: blogSettings.blogName,
    description: blogSettings.description,
    url: absoluteUrl("/"),
    siteName: blogSettings.blogName,
    locale: blogSettings.locale,
    type: "website",
    images: [absoluteUrl(blogSettings.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: blogSettings.blogName,
    description: blogSettings.description,
    images: [absoluteUrl(blogSettings.defaultOgImage)],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang={blogSettings.language}
      suppressHydrationWarning
      className={cn("antialiased", "font-mono", jetbrainsMono.variable)}
    >
      <body className="bg-background font-mono text-foreground selection:bg-foreground selection:text-background">
        <ThemeProvider>
          <div className="relative flex min-h-svh flex-col">
            <div className="pointer-events-none fixed inset-0 z-0 flex justify-center">
              <div className="bg-grid-pattern h-full w-full max-w-5xl border-x-[2px] border-border/40 backdrop-blur-[2px]" />
            </div>
            <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col bg-background/80">
              <SiteHeader />
              <div className="flex-1 border-y border-border/40">{children}</div>
              <SiteFooter />
            </div>
            {blogSettings.displayDemoNotice ? <DemoNoticeModal /> : null}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
