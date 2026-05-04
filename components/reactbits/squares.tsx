"use client"

import { useRef, useEffect, useState } from 'react'

interface SquaresProps {
  direction?: 'right' | 'left' | 'up' | 'down' | 'diagonal'
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  className?: string
}

export function Squares({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(255, 255, 255, 0.1)',
  squareSize = 50,
  hoverFillColor = 'rgba(255, 255, 255, 0.05)',
  className = '',
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredSquare, setHoveredSquare] = useState<{x: number, y: number} | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', resize)
    resize()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += speed
      
      const numCols = Math.ceil(canvas.width / squareSize) + 2
      const numRows = Math.ceil(canvas.height / squareSize) + 2
      
      let offsetX = 0
      let offsetY = 0

      if (direction === 'right' || direction === 'diagonal') offsetX = time % squareSize
      if (direction === 'left') offsetX = -(time % squareSize)
      if (direction === 'down' || direction === 'diagonal') offsetY = time % squareSize
      if (direction === 'up') offsetY = -(time % squareSize)

      for (let x = -1; x <= numCols; x++) {
        for (let y = -1; y <= numRows; y++) {
          const squareX = x * squareSize + offsetX
          const squareY = y * squareSize + offsetY

          if (hoveredSquare) {
            const hx = Math.floor((hoveredSquare.x - offsetX) / squareSize)
            const hy = Math.floor((hoveredSquare.y - offsetY) / squareSize)
            if (hx === x && hy === y) {
              ctx.fillStyle = hoverFillColor
              ctx.fillRect(squareX, squareY, squareSize, squareSize)
            }
          }

          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [direction, speed, borderColor, squareSize, hoverFillColor, hoveredSquare])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block opacity-50 ${className}`}
      onMouseMove={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          setHoveredSquare({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          })
        }
      }}
      onMouseLeave={() => setHoveredSquare(null)}
    />
  )
}
