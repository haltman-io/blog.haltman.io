type GitHubUserResponse = {
  avatar_url?: unknown
  html_url?: unknown
}

export type GitHubAuthorProfile = {
  avatarUrl?: string
  profileUrl: string
  username: string
}

const githubAuthorProfiles = new Map<string, Promise<GitHubAuthorProfile>>()

function toGithubUsername(authorName: string) {
  return authorName.trim().replace(/^@+/, "")
}

function githubProfileUrl(username: string) {
  return `https://github.com/${encodeURIComponent(username)}`
}

async function fetchGithubAuthorProfile(
  username: string
): Promise<GitHubAuthorProfile> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)
  const profileUrl = githubProfileUrl(username)

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        cache: "force-cache",
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "blog.haltman.io",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: controller.signal,
      }
    )

    if (!response.ok) {
      return { profileUrl, username }
    }

    const user = (await response.json()) as GitHubUserResponse

    return {
      avatarUrl:
        typeof user.avatar_url === "string" ? user.avatar_url : undefined,
      profileUrl:
        typeof user.html_url === "string" ? user.html_url : profileUrl,
      username,
    }
  } catch {
    return { profileUrl, username }
  } finally {
    clearTimeout(timeout)
  }
}

export function getGithubAuthorProfile(
  authorName: string
): Promise<GitHubAuthorProfile> {
  const username = toGithubUsername(authorName)

  if (!username) {
    return Promise.resolve({
      profileUrl: "https://github.com",
      username,
    })
  }

  const cachedProfile = githubAuthorProfiles.get(username)

  if (cachedProfile) {
    return cachedProfile
  }

  const profile = fetchGithubAuthorProfile(username)
  githubAuthorProfiles.set(username, profile)

  return profile
}
