# Logo Component

A comprehensive, reusable Logo component for the ITC Hub application with full theme support and multiple variants.

## Features

- **Theme Support**: Automatically adapts to light/dark themes
- **Multiple Variants**: Default, light, dark, and auto theme-based
- **Flexible Sizing**: Predefined sizes (xs, sm, md, lg, xl, 2xl) or custom dimensions
- **Different Types**: Image-only, text-only, or full logo with subtitle
- **Interactive**: Optional clickable behavior with hover effects
- **Accessible**: Proper alt text and semantic markup
- **TypeScript**: Fully typed with comprehensive interfaces

## Usage

### Basic Usage

```tsx
import { Logo } from "@/components/ui/logo"

// Default logo (auto theme)
<Logo />

// Light theme logo
<Logo variant="light" />

// Dark theme logo
<Logo variant="dark" />

// Auto theme-based logo
<Logo variant="auto" />
```

### Logo Types

```tsx
// Image only
<Logo type="image" />

// Text only
<Logo type="text-only" />

// Full logo with subtitle
<Logo type="full" showSubtitle />
```

### Sizing

```tsx
// Predefined sizes
<Logo size="xs" />
<Logo size="sm" />
<Logo size="md" />
<Logo size="lg" />
<Logo size="xl" />
<Logo size="2xl" />

// Custom dimensions
<Logo width={120} height={60} />
```

### Interactive Logo

```tsx
<Logo 
  clickable 
  onClick={() => router.push('/')}
  className="hover:scale-105 transition-transform"
/>
```

## Convenience Components

For common use cases, use these specialized components:

```tsx
import { 
  LogoImage, 
  LogoText, 
  LogoFull, 
  SidebarLogo, 
  HeaderLogo, 
  FooterLogo, 
  AuthLogo 
} from "@/components/ui/logo"

// Image only
<LogoImage />

// Text only
<LogoText />

// Full logo with subtitle
<LogoFull showSubtitle />

// Sidebar logo (full with subtitle, medium size)
<SidebarLogo />

// Header logo (image only, small size)
<HeaderLogo />

// Footer logo (full with subtitle, large size)
<FooterLogo />

// Auth page logo (full with subtitle, extra large size)
<AuthLogo />
```

## Props

### LogoProps Interface

```tsx
interface LogoProps {
  // Logo variant
  variant?: "default" | "light" | "dark" | "auto"
  
  // Logo size
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  
  // Custom dimensions
  width?: number
  height?: number
  
  // Subtitle options
  showSubtitle?: boolean
  subtitle?: string
  subtitleLine2?: string
  
  // Logo type
  type?: "image" | "full" | "text-only"
  
  // Styling
  className?: string
  imageClassName?: string
  textClassName?: string
  
  // Interactive
  clickable?: boolean
  onClick?: () => void
  
  // Accessibility
  alt?: string
  
  // Performance
  priority?: boolean
}
```

## Size Configuration

The component includes predefined size configurations:

```tsx
const sizeConfig = {
  xs: { width: 60, height: 27, textSize: "text-xs" },
  sm: { width: 75, height: 33, textSize: "text-sm" },
  md: { width: 90, height: 40, textSize: "text-sm" },
  lg: { width: 120, height: 53, textSize: "text-base" },
  xl: { width: 150, height: 67, textSize: "text-lg" },
  "2xl": { width: 180, height: 80, textSize: "text-xl" },
}
```

## Theme Support

The component automatically handles theme switching:

- **Default**: Uses the default logo file
- **Light**: Always uses light theme logo
- **Dark**: Always uses dark theme logo  
- **Auto**: Automatically switches based on current theme

## File Structure

The component expects these logo files in the `public` directory:

- `/ITC HUB Logo.svg` - Default logo
- `/ITC HUB Logo Light.svg` - Light theme logo
- `/ITC HUB Logo Dark.svg` - Dark theme logo

## Examples

### Header Usage

```tsx
import { HeaderLogo } from "@/components/ui/logo"

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <HeaderLogo />
      <nav>...</nav>
    </header>
  )
}
```

### Sidebar Usage

```tsx
import { SidebarLogo } from "@/components/ui/logo"

function Sidebar() {
  return (
    <aside className="w-64 p-4">
      <SidebarLogo />
      {/* Sidebar content */}
    </aside>
  )
}
```

### Auth Page Usage

```tsx
import { AuthLogo } from "@/components/ui/logo"

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AuthLogo />
      <LoginForm />
    </div>
  )
}
```

### Footer Usage

```tsx
import { FooterLogo } from "@/components/ui/logo"

function Footer() {
  return (
    <footer className="flex items-center justify-between p-6">
      <FooterLogo />
      <div className="text-sm text-muted-foreground">
        © 2024 ITC Hub. All rights reserved.
      </div>
    </footer>
  )
}
```

## Migration from Inline Logo

If you're migrating from inline logo implementations, replace:

```tsx
// Old way
const getLogoSrc = () => {
  if (!mounted) return "/ITC HUB Logo.svg"
  const currentTheme = resolvedTheme || theme || "dark"
  return currentTheme === "light" ? "/ITC HUB Logo Light.svg" : "/ITC HUB Logo Dark.svg"
}

<Image
  src={getLogoSrc()}
  alt="ITC Hub"
  width={90}
  height={40}
/>
```

With:

```tsx
// New way
import { Logo } from "@/components/ui/logo"

<Logo variant="auto" size="md" />
```

## Best Practices

1. **Use appropriate variants**: Use `auto` for theme-aware logos, `light`/`dark` for specific themes
2. **Choose the right size**: Use predefined sizes for consistency
3. **Consider context**: Use specialized components for common use cases
4. **Make it interactive**: Add click handlers for navigation
5. **Optimize performance**: Use `priority` prop for above-the-fold logos

## Accessibility

- Proper alt text is provided by default
- Keyboard navigation support for clickable logos
- Semantic HTML structure
- High contrast support through theme variants

## Performance

- Lazy loading by default
- Priority loading option for critical logos
- Optimized image dimensions
- Minimal re-renders with proper memoization 