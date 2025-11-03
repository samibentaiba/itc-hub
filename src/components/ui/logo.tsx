"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface LogoProps {
  /**
   * The variant of the logo to display
   * @default "default"
   */
  variant?: "default" | "light" | "dark" | "auto"
  
  /**
   * The size of the logo
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  
  /**
   * Custom width for the logo image
   */
  width?: number
  
  /**
   * Custom height for the logo image
   */
  height?: number
  
  /**
   * Whether to show the subtitle text
   * @default false
   */
  showSubtitle?: boolean | "side"
  
  /**
   * Custom subtitle text
   */
  subtitle?: string
  
  /**
   * Custom subtitle line 2 text
   */
  subtitleLine2?: string
  
  /**
   * Whether to show the full logo with text or just the image
   * @default "image"
   */
  type?: "image" | "full" | "text-only"
  
  /**
   * Custom CSS classes
   */
  className?: string
  
  /**
   * Custom CSS classes for the image
   */
  imageClassName?: string
  
  /**
   * Custom CSS classes for the text container
   */
  textClassName?: string
  
  /**
   * Whether the logo is clickable (for navigation)
   * @default false
   */
  clickable?: boolean
  
  /**
   * Click handler for the logo
   */
  onClick?: () => void
  
  /**
   * Alt text for the logo image
   * @default "ITC Hub"
   */
  alt?: string
  
  /**
   * Priority loading for the image
   * @default false
   */
  priority?: boolean
}

const sizeConfig = {
  xs: { width: 60, height: 27, textSize: "text-xs" },
  sm: { width: 75, height: 33, textSize: "text-sm" },
  md: { width: 90, height: 40, textSize: "text-sm" },
  lg: { width: 120, height: 53, textSize: "text-base" },
  xl: { width: 150, height: 67, textSize: "text-lg" },
  "2xl": { width: 180, height: 80, textSize: "text-xl" },
}

export function Logo({
  variant = "default",
  size = "md",
  width,
  height,
  showSubtitle = false,
  subtitle = "Information Technology Community",
  subtitleLine2 = "HUB",
  type = "image",
  className,
  imageClassName,
  textClassName,
  clickable = false,
  onClick,
  alt = "ITC Hub",
  priority = false,
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the appropriate logo source based on variant and theme
  const getLogoSrc = () => {
    if (!mounted) return "/ITC HUB Logo.svg" // Default during SSR
    
    const currentTheme = resolvedTheme || theme || "dark"
    
    switch (variant) {
      case "light":
        return "/ITC HUB Logo Light.svg"
      case "dark":
        return "/ITC HUB Logo Dark.svg"
      case "auto":
        return currentTheme === "light" ? "/ITC HUB Logo Light.svg" : "/ITC HUB Logo Dark.svg"
      case "default":
      default:
        return "/ITC HUB Logo.svg"
    }
  }

  // Get size configuration
  const sizeConfigValue = sizeConfig[size]
  const logoWidth = width || sizeConfigValue.width
  const logoHeight = height || sizeConfigValue.height

  // Handle click
  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  // Render just the image
  if (type === "image") {
    return (
      <div
        className={cn(
          "inline-flex items-center",
          clickable && "cursor-pointer hover:opacity-80 transition-opacity",
          className
        )}
        onClick={handleClick}
      >
        <Image
          src={getLogoSrc()}
          alt={alt}
          width={logoWidth}
          height={logoHeight}
          className={cn("object-contain", imageClassName)}
          priority={priority}
        />
      </div>
    )
  }

  // Render text-only version
  if (type === "text-only") {
    return (
      <div
        className={cn(
          "inline-flex items-start",
          clickable && "cursor-pointer hover:opacity-80 transition-opacity",
          className
        )}
        onClick={handleClick}
      >
        <span className={cn("font-bold text-foreground", sizeConfigValue.textSize)}>
          ITC Hub
        </span>
        {showSubtitle && (
          <div className={cn("flex flex-col", textClassName)}>
            <span className={cn("text-muted-foreground", sizeConfigValue.textSize === "text-xs" ? "text-[0.6rem]" : "text-xs")}>
              {subtitle}
            </span>
            <span className={cn("text-muted-foreground", sizeConfigValue.textSize === "text-xs" ? "text-[0.6rem]" : "text-xs")}>
              {subtitleLine2}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Render full version with image and text
  return (
    <div
      className={cn(
        `inline-flex ${showSubtitle == "side" ? "items-center justify-center" :"flex-col items-start"} gap-2`,
        clickable && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={handleClick}
    >
      <Image
        src={getLogoSrc()}
        alt={alt}
        width={logoWidth}
        height={logoHeight}
        className={cn("object-contain", imageClassName)}
        priority={priority}
      />
      {showSubtitle && (
        <div className={cn("sm:grid flex-1 hidden text-left leading-tight", textClassName)}>
          <span className={cn("truncate text-muted-foreground", sizeConfigValue.textSize === "text-xs" ? "text-[0.6rem]" : "text-xs")}>
            {subtitle}
          </span>
          <span className={cn("truncate text-muted-foreground", sizeConfigValue.textSize === "text-xs" ? "text-[0.6rem]" : "text-xs")}>
            {subtitleLine2}
          </span>
        </div>
      )}
    </div>
  )
}

// Convenience components for common use cases
export function LogoImage(props: Omit<LogoProps, "type">) {
  return <Logo {...props} type="image" />
}

export function LogoText(props: Omit<LogoProps, "type">) {
  return <Logo {...props} type="text-only" />
}

export function LogoFull(props: Omit<LogoProps, "type">) {
  return <Logo {...props} type="full" />
}

// Specialized components for specific contexts
export function SidebarLogo(props: Omit<LogoProps, "type" | "showSubtitle" | "size">) {
  return <Logo {...props} type="full" showSubtitle size="md"  />
}

export function HeaderLogo(props: Omit<LogoProps, "type" | "size">) {
  return <Logo {...props} type="full" showSubtitle="side" size="md" />
}

export function FooterLogo(props: Omit<LogoProps, "type" | "size">) {
  return <Logo {...props} type="full" size="lg" />
}

export function AuthLogo(props: Omit<LogoProps, "type" | "size">) {
  return <Logo {...props} type="full" size="xl"  />
}
