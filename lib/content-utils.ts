import fs from "node:fs"
import path from "node:path"

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function toStringValue(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number") {
    return String(value)
  }

  return fallback
}

export function toBooleanValue(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value
  }

  return fallback
}

export function toNumberValue(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsedValue = Number.parseInt(value, 10)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return fallback
}

export function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => toStringValue(item).trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export function toPublicAssetPath(value: unknown) {
  const assetPath = toStringValue(value).trim()

  if (!assetPath) {
    return undefined
  }

  if (/^https?:\/\//.test(assetPath)) {
    return assetPath
  }

  return assetPath.startsWith("/") ? assetPath : `/${assetPath}`
}

export function toIsoDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsedDate = new Date(value)

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString()
    }
  }

  return undefined
}

export function slugify(value: string) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/\.mdx?$/, "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("/")
}

export function excerptFromContent(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#>*_`~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180)
}

export function walkMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return walkMdxFiles(entryPath)
    }

    if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      return [entryPath]
    }

    return []
  })
}
