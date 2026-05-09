# blog.haltman.io

[![CI](https://github.com/haltman-io/blog.haltman.io/actions/workflows/ci.yml/badge.svg)](https://github.com/haltman-io/blog.haltman.io/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/)
[![MDX](https://img.shields.io/badge/Content-MDX-FCB32C?logo=mdx&logoColor=111111)](https://mdxjs.com/)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)

A production-ready, backend-free blog template built with Next.js, MDX, front matter, ShadCN, and BaseCN.

The project is designed for people who want to clone a repository, edit a JSON settings file, write content as MDX, and deploy the result anywhere: Vercel, Cloudflare Pages, Netlify, GitHub Pages, S3, an object-storage CDN, or a traditional web server.

- Source: <https://github.com/haltman-io/blog.haltman.io>
- Contact: <root@haltman.io>
- License: [Unlicense](https://unlicense.org/)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Writing Posts](#writing-posts)
- [Writing Pages](#writing-pages)
- [Images in MDX](#images-in-mdx)
- [SEO](#seo)
- [Demo Notice](#demo-notice)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Static Hosting Notes](#static-hosting-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- File-based content using MDX and front matter.
- No backend, database, CMS, webhook, or runtime content API required.
- Blog posts from `content/posts`.
- Common pages from `content/pages`.
- Per-post and per-page SEO metadata from front matter.
- Global site metadata from `blog-settings.json`.
- Dynamic navbar and footer links from both JSON settings and MDX page front matter.
- Responsive navbar with a mobile hamburger menu.
- Search, tag filtering, and pagination for the posts archive.
- Homepage Featured Content carousel for posts marked `featured: true`.
- RSS feed, sitemap, robots file, canonical URLs, Open Graph metadata, Twitter cards, and JSON-LD.
- Predictable `Edit on GitHub` links for every post.
- Static export support for any CDN or static web server.
- Hosted Next.js support for Vercel, Netlify, and any Node.js environment.
- Optional first-visit demo notice for template/demo deployments.

## Requirements

- Node.js `>=20.9.0`
- npm `>=10`

Node.js 22 LTS is recommended for production deployments and CI.

## Quick Start

```bash
git clone https://github.com/haltman-io/blog.haltman.io.git
cd blog.haltman.io
npm ci
npm run dev
```

Open the local URL printed by Next.js. Then edit:

- `blog-settings.json` for blog metadata, owner details, navigation, footer links, repository URL, and demo notice behavior.
- `content/posts/*.mdx` for blog posts.
- `content/pages/*.mdx` for regular pages.
- `public/*` for logos, favicon, Open Graph images, and MDX images.

## Project Structure

```txt
.
+-- app/                  # Next.js App Router routes and metadata routes
+-- components/           # UI components, layout, navigation, MDX components
+-- content/
|   +-- pages/            # Regular MDX pages
|   +-- posts/            # Blog post MDX files
+-- lib/                  # Content loading, settings, formatting, SEO helpers
+-- public/               # Public assets used by the site and MDX files
+-- blog-settings.json    # Global blog configuration
+-- next.config.mjs       # Next.js config with optional static export mode
+-- netlify.toml          # Netlify static deployment defaults
+-- vercel.json           # Vercel project defaults
+-- wrangler.toml         # Cloudflare Pages defaults
```

## Configuration

All blog-level settings live in `blog-settings.json`.

```json
{
  "blogName": "blog.haltman.io",
  "description": "A free blog for everyone.",
  "siteUrl": "https://blog.haltman.io",
  "language": "en",
  "locale": "en_US",
  "ownerName": "Haltman.IO",
  "ownerRole": "a group of Brazilian hackers.",
  "email": "root@haltman.io",
  "repositoryUrl": "https://github.com/haltman-io/blog.haltman.io",
  "repositoryBranch": "main",
  "displayDemoNotice": true,
  "postsDirectory": "content/posts",
  "pagesDirectory": "content/pages",
  "postsPerPage": 6,
  "favicon": "/favicon.ico",
  "defaultOgImage": "/og-default.svg",
  "logo": {
    "light": "/logo.svg",
    "dark": "/logo-dark.svg",
    "mark": "/logo-mark.svg"
  },
  "keywords": ["Next.js", "MDX", "static blog"],
  "navbar": {
    "links": [{ "label": "Posts", "href": "/posts", "order": 10 }]
  },
  "footer": {
    "links": [
      {
        "label": "Source Code",
        "href": "https://github.com/haltman-io/blog.haltman.io",
        "order": 90
      }
    ]
  },
  "social": {
    "github": "https://github.com/haltman-io",
    "website": "https://haltman.io"
  }
}
```

Important fields:

| Field               | Purpose                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `blogName`          | Site name used in metadata, header, footer, and structured data.                             |
| `description`       | Global fallback description for metadata and UI copy.                                        |
| `siteUrl`           | Absolute production URL. Required for canonical URLs, RSS, sitemap, Open Graph, and JSON-LD. |
| `repositoryUrl`     | Base repository URL used to generate `Edit on GitHub` links.                                 |
| `repositoryBranch`  | Branch used in generated GitHub edit URLs.                                                   |
| `displayDemoNotice` | Enables or disables the first-visit demo notice modal.                                       |
| `postsDirectory`    | Directory where post MDX files are loaded from.                                              |
| `pagesDirectory`    | Directory where regular page MDX files are loaded from.                                      |
| `postsPerPage`      | Number of posts shown per archive page.                                                      |
| `navbar.links`      | Direct navbar links that do not need an MDX page.                                            |
| `footer.links`      | Direct footer links that do not need an MDX page.                                            |

## Writing Posts

Create a new `.mdx` file in `content/posts`.

```mdx
---
title: "My first post"
description: "A concise summary for cards and SEO."
date: "2026-05-04"
updated: "2026-05-04"
author: "Your Name"
tags: ["Next.js", "MDX"]
featured: false
published: true
image: "/pictures/cover.png"
canonicalUrl: "https://example.com/my-first-post"
seo:
  title: "Optional SEO title"
  description: "Optional SEO description"
  image: "/og-default.svg"
  keywords: ["static blog", "front matter"]
---

Write the post body here.
```

Post behavior:

- The file path becomes the slug unless `slug` is provided in front matter.
- Nested files create nested URLs.
- `published: false` keeps a draft in the repository without rendering it.
- `featured: true` makes a published post appear in the homepage Featured Content section. The section is hidden when no published posts are featured.
- Featured Content rotates automatically and shows arrow controls plus a countdown progress bar only when more than one featured post is available.
- `image` references an image in `public` with a root-relative path, such as `/pictures/cover.png`, and renders it below the post title and description.
- `date` controls sorting, RSS, sitemap entries, and article structured data.
- `seo` overrides page-level metadata without changing the visible article content.
- Every post receives an `Edit on GitHub` link derived from `repositoryUrl`, `repositoryBranch`, and the MDX source path.

## Writing Pages

Create a new `.mdx` file in `content/pages`.

```mdx
---
title: "About"
description: "A short static page."
updated: "2026-05-04"
published: true
navbar:
  show: true
  label: "About"
  order: 20
footer:
  show: true
  label: "About"
  order: 20
seo:
  title: "About this site"
  description: "SEO description for the page."
  image: "/og-default.svg"
  keywords: ["about"]
---

Write the page body here.
```

Page behavior:

- The file path becomes the slug unless `slug` is provided in front matter.
- `navbar.show` controls whether the page appears in the navbar.
- `footer.show` controls whether the page appears in the footer.
- A page can appear in both places, one place, or neither place.
- Pages with `published: false` are excluded from builds.
- Direct external links can be added through `navbar.links` and `footer.links` in `blog-settings.json`.

## Images in MDX

Images are loaded from the `public` directory and referenced with root-relative URLs.

```mdx
![Architecture diagram](/pictures/architecture.png)
```

The example above loads:

```txt
public/pictures/architecture.png
```

MDX images work in posts and pages. They render centered with a fixed content width and responsive max width. Post front matter also supports `image` for a header image shown below the post title and description.

## SEO

The template ships with SEO defaults for the main routes and content routes.

Generated automatically:

- `/` metadata.
- `/posts` metadata.
- Post metadata from MDX front matter.
- Page metadata from MDX front matter.
- Canonical URLs.
- Open Graph metadata.
- Twitter card metadata.
- Article JSON-LD for posts.
- WebPage JSON-LD for pages.
- `/sitemap.xml`.
- `/robots.txt`.
- `/feed.xml`.

Before deploying a fork, update `siteUrl`, `blogName`, `description`, `defaultOgImage`, `favicon`, `keywords`, and all owner fields in `blog-settings.json`.

## Demo Notice

The optional demo notice modal appears once per visitor and explains that the site is a demo template by Haltman.IO.

Control it with:

```json
{
  "displayDemoNotice": true
}
```

Set `displayDemoNotice` to `false` to remove the modal entirely from the rendered UI.

## Scripts

| Script                        | Description                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                 | Start the local Next.js dev server with Turbopack.                                                                   |
| `npm run build`               | Build the app as a standard Next.js project. Use this for Vercel, self-hosted Next.js, and hosted Next.js platforms. |
| `npm run build:static`        | Build a static export into `out/`. Use this for CDNs and static web servers.                                         |
| `npm run start`               | Run the production Next.js server after `npm run build`.                                                             |
| `npm run lint`                | Run ESLint.                                                                                                          |
| `npm run typecheck`           | Run TypeScript without emitting files.                                                                               |
| `npm run check`               | Run typecheck and lint.                                                                                              |
| `npm run validate`            | Run typecheck, lint, standard build, and static build.                                                               |
| `npm run preview:static`      | Build the static export and serve `out/` locally.                                                                    |
| `npm run serve:static`        | Serve an existing `out/` directory locally.                                                                          |
| `npm run deploy:vercel`       | Deploy a preview build with Vercel CLI.                                                                              |
| `npm run deploy:vercel:prod`  | Deploy a production build with Vercel CLI.                                                                           |
| `npm run deploy:cloudflare`   | Build static output and deploy `out/` to Cloudflare Pages with Wrangler.                                             |
| `npm run deploy:netlify`      | Build static output and create a Netlify draft deploy.                                                               |
| `npm run deploy:netlify:prod` | Build static output and deploy to Netlify production.                                                                |

## Deployment

This repository supports two production modes:

| Mode           | Command                | Output   | Use when                                                                                                                       |
| -------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Hosted Next.js | `npm run build`        | `.next/` | You deploy to Vercel, Netlify Next runtime, a Node.js server, or another platform with Next.js support.                        |
| Static export  | `npm run build:static` | `out/`   | You deploy to Cloudflare Pages static export, Netlify static hosting, GitHub Pages, S3, R2, any CDN, or any static web server. |

### Vercel

Vercel is the default hosted Next.js path for this project.

The repository includes `vercel.json` with:

- Framework: `nextjs`.
- Install command: `npm ci`.
- Build command: `npm run build`.
- No custom output directory. Vercel detects the Next.js output automatically.

Git-based deployment:

1. Import `https://github.com/haltman-io/blog.haltman.io` in Vercel.
2. Keep the Framework Preset as `Next.js`.
3. Keep Build Command as `npm run build`.
4. Keep Output Directory unset.
5. Deploy.

CLI deployment:

```bash
npm run deploy:vercel
npm run deploy:vercel:prod
```

Reference: [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build).

### Cloudflare Pages

For this template, Cloudflare Pages should use the static export output.

The repository includes `wrangler.toml` with:

```toml
name = "blog-haltman-io"
pages_build_output_dir = "./out"
compatibility_date = "2026-05-04"
```

Git-based deployment:

1. Create a Cloudflare Pages project from your Git repository.
2. Use the static export build path.
3. Build command: `npm run build:static`.
4. Build output directory: `out`.
5. Node.js version: `22`.

Direct upload with Wrangler:

```bash
npm run deploy:cloudflare
```

If you rename the Cloudflare Pages project, update both `wrangler.toml` and the `deploy:cloudflare` script in `package.json`.

Reference: [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) and [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

### Netlify

The repository includes `netlify.toml` configured for static hosting:

```toml
[build]
  command = "npm run build:static"
  publish = "out"
```

Git-based deployment:

1. Import the repository in Netlify.
2. Keep the settings from `netlify.toml`.
3. Deploy.

CLI deployment:

```bash
npm run deploy:netlify
npm run deploy:netlify:prod
```

If you prefer Netlify's hosted Next.js runtime instead of static hosting, change the build command to `npm run build`, publish `.next`, and remove the static-export environment override.

Reference: [Netlify Next.js configuration values](https://docs.netlify.com/snippets/frameworks/nextjs-config-values/) and [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/).

### Self-hosted Next.js

Use this when you want to run the app as a Node.js service.

```bash
npm ci
npm run build
npm run start
```

Then put a reverse proxy such as Nginx, Caddy, Traefik, or a platform load balancer in front of the Next.js server.

### Generic CDN or Web Server

Use this for static hosting on S3, R2, GitHub Pages, object storage, a CDN bucket, Nginx, Apache, Caddy, or any simple static server.

```bash
npm ci
npm run build:static
```

Upload the contents of `out/` to the host.

Reference: [Next.js static exports](https://nextjs.org/docs/pages/guides/static-exports).

## Static Hosting Notes

The static export is generated with trailing slashes enabled. Routes are emitted as `index.html` files inside folders.

Examples:

| Route             | Static file                    |
| ----------------- | ------------------------------ |
| `/`               | `out/index.html`               |
| `/posts/`         | `out/posts/index.html`         |
| `/posts/example/` | `out/posts/example/index.html` |
| `/about/`         | `out/about/index.html`         |

For static web servers, make sure the host serves directory indexes. Most CDNs and static hosts do this automatically.

## Troubleshooting

### `Edit on GitHub` points to the wrong place

Update `repositoryUrl` and `repositoryBranch` in `blog-settings.json`.

### Search or pagination does not show a post

Check that the post is inside `content/posts`, has the `.mdx` extension, and does not set `published: false`.

### A page works by URL but is missing from the navbar or footer

Set `navbar.show` or `footer.show` in the page front matter.

### Static export fails for a dynamic route

Every generated route must be known at build time. This template uses `generateStaticParams()` for posts and pages, so make sure MDX files can be read during the build and their slugs are valid.

### Chrome DevTools requests `/.well-known/appspecific/com.chrome.devtools.json`

The repository includes a static file in `public/.well-known/appspecific/` so Chrome DevTools does not accidentally hit the catch-all MDX page route during static export.

### The demo notice keeps appearing while testing

The notice is stored in browser `localStorage`. Clear site data or set `displayDemoNotice` to `false` in `blog-settings.json`.

## Contributing

Issues and pull requests are welcome at <https://github.com/haltman-io/blog.haltman.io>.

Recommended local validation before opening a pull request:

```bash
npm ci
npm run validate
```

Keep changes scoped, document configuration changes in this README, and include sample MDX when adding content features.

## License

This project is released under the [Unlicense](https://unlicense.org/). See [LICENSE](LICENSE).
