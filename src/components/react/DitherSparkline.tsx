"use client"

import { useEffect, useRef, useState } from "react"
import { BAYER4, fillOf, pixelBloomStyle, type PixelBloom, type PixelColor } from "../dither-kit/pixel"
import { rgb } from "../dither-kit/palette"

type DitherSparklineProps = {
  data: number[]
  color?: PixelColor
  className?: string
}

export function DitherSparkline({
  data,
  color = "orange",
  className = "",
}: DitherSparklineProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bloomRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState(false)
  const [bloom, setBloom] = useState<PixelBloom>("off")

  useEffect(() => {
    setBloom(hovered ? "low" : "off")
  }, [hovered])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || !data?.length) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const fill = fillOf(color)

    const paint = () => {
      const box = wrap.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const cols = Math.max(4, Math.round(box.width * dpr))
      const rows = Math.max(4, Math.round(box.height * dpr))
      canvas.width = cols
      canvas.height = rows
      canvas.style.width = "100%"
      canvas.style.height = "100%"

      const max = Math.max(...data)
      const min = Math.min(...data)
      const range = max - min || 1

      const padY = Math.max(2, Math.round(rows * 0.08))
      const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * (cols - 1),
        y: padY + (1 - (v - min) / range) * (rows - padY * 2),
      }))

      ctx.clearRect(0, 0, cols, rows)

      // Draw ordered-dither fill below the line
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let lineY = rows
          for (let i = 0; i < points.length - 1; i++) {
            if (x >= points[i].x && x <= points[i + 1].x) {
              const t = (x - points[i].x) / (points[i + 1].x - points[i].x || 1)
              lineY = points[i].y + t * (points[i + 1].y - points[i].y)
              break
            }
          }
          if (y <= lineY) continue
          const density = 1 - (y - lineY) / (rows - lineY || 1)
          const lit = density > BAYER4[y & 3][x & 3]
          if (!lit) continue
          const alpha = (0.18 + 0.55 * density) * (hovered ? 1.15 : 1)
          ctx.fillStyle = rgb(fill, 1, alpha)
          ctx.fillRect(x, y, 1, 1)
        }
      }

      // Draw the line itself
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i]
        const p1 = points[i + 1]
        const steps = Math.max(Math.abs(p1.x - p0.x), Math.abs(p1.y - p0.y), 1)
        for (let s = 0; s <= steps; s++) {
          const t = s / steps
          const x = Math.round(p0.x + t * (p1.x - p0.x))
          const y = Math.round(p0.y + t * (p1.y - p0.y))
          if (x >= cols || y >= rows) continue
          ctx.fillStyle = rgb(fill, 1, 0.9)
          ctx.fillRect(x, y, 1, 1)
        }
      }

      // Draw endpoint dot
      const last = points[points.length - 1]
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const x = Math.round(last.x) + dx
          const y = Math.round(last.y) + dy
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue
          if (dx === 0 && dy === 0) {
            ctx.fillStyle = rgb(fill, 1, 1)
          } else if (Math.abs(dx) + Math.abs(dy) === 1) {
            ctx.fillStyle = rgb(fill, 1, 0.7)
          } else {
            ctx.fillStyle = rgb(fill, 1, 0.4)
          }
          ctx.fillRect(x, y, 1, 1)
        }
      }

      // Paint bloom layer
      if (bloomRef.current) {
        const bctx = bloomRef.current.getContext("2d")
        if (bctx) {
          bloomRef.current.width = cols
          bloomRef.current.height = rows
          bctx.drawImage(canvas, 0, 0)
        }
      }
    }

    paint()
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(paint)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [data, color, hovered])

  const bloomStyle = pixelBloomStyle(bloom)

  if (!data?.length) return null

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
      {bloomStyle && (
        <canvas
          ref={bloomRef}
          className="absolute inset-0 w-full h-full"
          style={bloomStyle}
        />
      )}
    </div>
  )
}
