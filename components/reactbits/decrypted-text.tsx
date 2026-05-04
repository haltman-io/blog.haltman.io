"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: "start" | "end" | "center"
  useOriginalCharsOnly?: boolean
  className?: string
  encryptedClassName?: string
  parentClassName?: string
  animateOn?: "view" | "hover" | "always"
}

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "hover",
}: DecryptedTextProps) {
  const [currentText, setCurrentText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const characters = useMemo(
    () =>
      useOriginalCharsOnly
        ? Array.from(new Set(text.split("").filter((char) => char !== " ")))
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=".split(
            ""
          ),
    [text, useOriginalCharsOnly]
  )

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    let iteration = 0

    const shouldAnimate =
      animateOn === "always" ||
      (animateOn === "hover" && isHovering) ||
      (animateOn === "view" && isAnimating)

    if (shouldAnimate) {
      interval = setInterval(() => {
        setCurrentText((prev) =>
          prev
            .split("")
            .map((char, index) => {
              if (char === " ") return " "

              const progress = iteration / maxIterations
              let shouldReveal = false

              if (!sequential) {
                shouldReveal = progress >= 1
              } else {
                if (revealDirection === "start") {
                  shouldReveal = index <= text.length * progress
                } else if (revealDirection === "end") {
                  shouldReveal = index >= text.length - text.length * progress
                } else {
                  const center = text.length / 2
                  const distance = Math.abs(index - center)
                  shouldReveal = distance <= center * progress
                }
              }

              if (shouldReveal) {
                return text[index]
              }

              return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("")
        )

        iteration += 1
        if (iteration > maxIterations) {
          clearInterval(interval)
          setCurrentText(text)
        }
      }, speed)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [
    animateOn,
    characters,
    isAnimating,
    isHovering,
    maxIterations,
    revealDirection,
    sequential,
    speed,
    text,
  ])

  const shouldShowAnimatedText =
    animateOn === "always" ||
    (animateOn === "hover" && isHovering) ||
    (animateOn === "view" && isAnimating)
  const displayText = shouldShowAnimatedText ? currentText : text

  return (
    <motion.span
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => animateOn === "hover" && setIsHovering(true)}
      onMouseLeave={() => animateOn === "hover" && setIsHovering(false)}
      onViewportEnter={() => animateOn === "view" && setIsAnimating(true)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={
              char === text[i] ? className : encryptedClassName || className
            }
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  )
}
