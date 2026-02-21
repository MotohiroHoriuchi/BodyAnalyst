"use client"

import { useEffect, useState } from "react"

export function AnimatedNumber({
  value,
  decimals = 1,
  duration = 800,
  className,
  suffix = "",
  prefix = "",
}: {
  value: number
  decimals?: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = 0
    const end = value
    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (end - start) * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
