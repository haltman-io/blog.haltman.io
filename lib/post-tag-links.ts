export function postTagHref(tag: string) {
  const params = new URLSearchParams({ tag })

  return `/posts?${params.toString()}`
}
