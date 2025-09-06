import * as React from "react"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/utils"

interface AvatarProps {
  src?: string
  alt?: string
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={cn(
      "relative inline-flex items-center justify-center rounded-full bg-muted overflow-hidden",
      sizeClasses[size],
      className
    )}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="font-medium text-muted-foreground">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}
