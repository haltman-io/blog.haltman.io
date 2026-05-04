import { blogSettings } from "@/lib/blog-settings"

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat(blogSettings.language, {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date))
}
