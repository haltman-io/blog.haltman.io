"use client"
import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react"
import type { PostSummary } from "@/lib/post-types"
import { formatPostDate } from "@/lib/format"

export function HeroCarousel({ posts }: { posts: PostSummary[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState(1)
  const hasMultiplePosts = posts.length > 1

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) =>
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    )
  }, [posts.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    )
  }, [posts.length])

  useEffect(() => {
    if (!hasMultiplePosts || isHovered) return
    const timer = setInterval(() => {
      nextSlide()
    }, 8000) // 8 seconds per post
    return () => clearInterval(timer)
  }, [hasMultiplePosts, isHovered, nextSlide])

  if (posts.length === 0) return null

  const post = posts[currentIndex]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  return (
    <div
      className="group relative isolate flex min-h-[400px] w-full flex-col overflow-hidden border-2 border-border/70 bg-background/85 shadow-[8px_8px_0px_var(--foreground)] transition-[border-color,box-shadow] before:pointer-events-none before:absolute before:inset-3 before:z-0 before:border before:border-border/40 before:content-[''] hover:border-foreground motion-reduce:transition-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 flex w-full flex-1 flex-col justify-between gap-8 p-8 md:p-12"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarBlankIcon className="size-4" />
                {formatPostDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="size-4" /> {post.readingTimeLabel}
              </span>
            </div>

            <h2 className="text-3xl leading-[1.12] font-semibold tracking-tight text-foreground/90 md:text-4xl lg:text-5xl">
              <Link
                href={post.url}
                className="transition-colors outline-none hover:text-primary"
              >
                {post.title}
              </Link>
            </h2>

            <p className="line-clamp-3 max-w-3xl text-base leading-relaxed font-light text-muted-foreground md:text-lg">
              {post.description}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5 pb-16 md:pb-0">
            {post.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-muted/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {hasMultiplePosts ? (
        <>
          <div className="absolute right-6 bottom-6 z-20 flex items-center gap-2 border border-border bg-background/90 p-1.5 shadow-[4px_4px_0px_var(--foreground)]">
            <div className="hidden px-3 text-xs font-medium text-muted-foreground sm:block">
              {currentIndex + 1} / {posts.length}
            </div>
            <button
              onClick={prevSlide}
              className="grid size-9 cursor-pointer place-items-center border border-transparent text-foreground/70 transition-colors hover:border-border hover:bg-muted hover:text-foreground"
              aria-label="Previous post"
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <button
              onClick={nextSlide}
              className="grid size-9 cursor-pointer place-items-center border border-transparent text-foreground/70 transition-colors hover:border-border hover:bg-muted hover:text-foreground"
              aria-label="Next post"
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </div>

          {/* Time remaining indicator line */}
          <div className="absolute top-0 left-0 z-20 h-1 w-full bg-border/30">
            <div
              key={currentIndex}
              className="animate-shrink-width h-full bg-primary/40"
              style={{ animationPlayState: isHovered ? "paused" : "running" }}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
