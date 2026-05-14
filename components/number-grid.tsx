"use client"

import { cn } from "@/lib/utils"

interface NumberGridProps {
  selectedNumbers: number[]
  onToggle: (num: number) => void
  disabled?: boolean
  highlightNumbers?: number[]
}

export function NumberGrid({
  selectedNumbers,
  onToggle,
  disabled = false,
  highlightNumbers = [],
}: NumberGridProps) {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {numbers.map((num) => {
        const isSelected = selectedNumbers.includes(num)
        const isHighlighted = highlightNumbers.includes(num)

        return (
          <button
            key={num}
            type="button"
            onClick={() => !disabled && onToggle(num)}
            disabled={disabled}
            className={cn(
              "flex h-12 w-full items-center justify-center rounded-lg text-lg font-bold transition-all",
              "sm:h-14 sm:text-xl",
              disabled && "cursor-default",
              !disabled && !isSelected && "hover:bg-accent hover:scale-105",
              isSelected && isHighlighted
                ? "bg-primary text-primary-foreground ring-2 ring-chart-5 ring-offset-2"
                : isSelected
                ? "bg-primary text-primary-foreground shadow-md"
                : isHighlighted
                ? "bg-chart-5 text-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {num.toString().padStart(2, "0")}
          </button>
        )
      })}
    </div>
  )
}
