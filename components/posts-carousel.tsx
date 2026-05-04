"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HandGrabbingIcon } from "@phosphor-icons/react"
import { PostCard } from "@/components/post-card"
import type { PostSummary } from "@/lib/post-types"

export function PostsCarousel({ posts }: { posts: PostSummary[] }) {
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [posts])

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        <HandGrabbingIcon weight="bold" className="size-4 animate-pulse" />
        <span className="hidden sm:inline">Drag to explore</span>
        <span className="sm:hidden">Swipe to explore</span>
      </div>

      <motion.div
        ref={carousel}
        className="-mx-4 -my-4 cursor-grab overflow-hidden px-4 py-4 active:cursor-grabbing sm:mx-0 sm:px-0"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.15}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          className="flex gap-6"
        >
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              className="w-[85vw] flex-shrink-0 sm:w-[350px]"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              <PostCard post={post} priority={i === 0} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
