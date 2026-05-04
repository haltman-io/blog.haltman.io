"use client"

import * as React from "react"
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  XIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "haltman-blog-demo-notice-seen"
const REPOSITORY_URL = "https://github.com/haltman-io/blog.haltman.io"
const STORAGE_EVENT = "haltman-blog-demo-notice-change"

function hasSeenNotice() {
  if (typeof window === "undefined") {
    return true
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
  } catch {
    return true
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(STORAGE_EVENT, callback)

  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(STORAGE_EVENT, callback)
  }
}

function markNoticeAsSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "true")
  } finally {
    window.dispatchEvent(new Event(STORAGE_EVENT))
  }
}

export function DemoNoticeModal() {
  const seen = React.useSyncExternalStore(subscribe, hasSeenNotice, () => true)
  const titleId = React.useId()
  const descriptionId = React.useId()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        markNoticeAsSeen()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  if (seen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/75 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-xl border-4 border-foreground bg-background shadow-[8px_8px_0px_var(--foreground)]"
      >
        <div className="flex items-start justify-between gap-4 border-b-4 border-foreground p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">
              Haltman.IO
            </p>
            <h2
              id={titleId}
              className="text-2xl font-black tracking-tight text-balance sm:text-3xl"
            >
              This is a demo blog.
            </h2>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Fechar aviso"
            onClick={markNoticeAsSeen}
          >
            <XIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-5 p-4 sm:p-5">
          <p
            id={descriptionId}
            className="text-sm/6 font-medium text-pretty text-muted-foreground"
          >
            This template was created by Haltman.IO to serve as the basis for a static blog in MDX. Clone the repository, adjust the settings, and modify the template to create your own blog.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              nativeButton={false}
              className="justify-center"
              render={
                <a href={REPOSITORY_URL} target="_blank" rel="noreferrer" />
              }
            >
              <GithubLogoIcon data-icon="inline-start" />
              Clone repository
              <ArrowSquareOutIcon data-icon="inline-end" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="justify-center"
              onClick={markNoticeAsSeen}
            >
              Got it
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
