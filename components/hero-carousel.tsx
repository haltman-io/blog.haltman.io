"use client"
import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, CalendarBlankIcon } from "@phosphor-icons/react"
import type { PostSummary } from "@/lib/post-types"
import { formatPostDate } from "@/lib/format"

export function HeroCarousel({ posts }: { posts: PostSummary[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState(1)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1))
  }, [posts.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1))
  }, [posts.length])

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      nextSlide()
    }, 8000) // 8 seconds per post
    return () => clearInterval(timer)
  }, [isHovered, nextSlide])

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
      className="relative w-full rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col group min-h-[400px] shadow-sm transition-all hover:shadow-md"
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
          className="w-full flex-1 flex flex-col p-8 md:p-12 justify-between gap-8"
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
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-foreground/90">
              <Link href={post.url} className="outline-none hover:text-primary transition-colors">
                {post.title}
              </Link>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed line-clamp-3 max-w-3xl">
              {post.description}
            </p>
          </div>
          
          <div className="flex gap-2.5 flex-wrap pb-16 md:pb-0 mt-4">
            {post.tags.slice(0, 5).map(tag => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10 bg-background/80 backdrop-blur-md rounded-full border border-border/50 p-1.5 shadow-sm">
        <div className="text-xs font-medium text-muted-foreground px-3 hidden sm:block">
          {currentIndex + 1} / {posts.length}
        </div>
        <button 
          onClick={prevSlide}
          className="rounded-full p-2 text-foreground/70 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          aria-label="Previous post"
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="rounded-full p-2 text-foreground/70 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          aria-label="Next post"
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
      
      {/* Time remaining indicator line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-border/30 z-20">
        <div 
          key={currentIndex}
          className="h-full bg-primary/40 animate-shrink-width"
          style={{ animationPlayState: isHovered ? "paused" : "running" }}
        />
      </div>
    </div>
  )
}
