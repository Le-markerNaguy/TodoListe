import * as React from "react"
import { cn } from "@/lib/utils"

export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          disabled
            ? "bg-muted text-muted-foreground"
            : "bg-gradient-to-r from-[#B0FCF5] to-[#56D7EA] hover:from-[#B0FCF5]/90 hover:to-[#56D7EA]/90",
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
GradientButton.displayName = "GradientButton"

export { GradientButton }
