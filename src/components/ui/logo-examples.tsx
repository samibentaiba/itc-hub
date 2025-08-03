"use client"

import { 
  Logo, 
  LogoImage, 
  LogoText, 
  LogoFull, 
  SidebarLogo, 
  HeaderLogo, 
  FooterLogo, 
  AuthLogo 
} from "./logo"

/**
 * Examples of how to use the Logo component across the codebase
 * This file demonstrates all the different variants and use cases
 */
export function LogoExamples() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Logo Component Examples</h2>
        <p className="text-muted-foreground mb-6">
          Various ways to use the Logo component across different parts of the application
        </p>
      </div>

      {/* Basic Logo Variants */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold">Basic Logo Variants</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">Default</p>
            <Logo />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Light</p>
            <Logo variant="light" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Dark</p>
            <Logo variant="dark" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Auto (Theme-based)</p>
            <Logo variant="auto" />
          </div>
        </div>
      </section>

      {/* Logo Types */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Logo Types</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">Image Only</p>
            <Logo type="image" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Text Only</p>
            <Logo type="text-only" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Full (Image + Text)</p>
            <Logo type="full" showSubtitle />
          </div>
        </div>
      </section>

      {/* Logo Sizes */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Logo Sizes</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">XS</p>
            <Logo size="xs" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">SM</p>
            <Logo size="sm" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">MD</p>
            <Logo size="md" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">LG</p>
            <Logo size="lg" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">XL</p>
            <Logo size="xl" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">2XL</p>
            <Logo size="2xl" />
          </div>
        </div>
      </section>

      {/* Convenience Components */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Convenience Components</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">LogoImage</p>
            <LogoImage />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">LogoText</p>
            <LogoText />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">LogoFull</p>
            <LogoFull showSubtitle />
          </div>
        </div>
      </section>

      {/* Specialized Components */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Specialized Components</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">SidebarLogo</p>
            <SidebarLogo />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">HeaderLogo</p>
            <HeaderLogo />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">FooterLogo</p>
            <FooterLogo />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">AuthLogo</p>
            <AuthLogo />
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Examples</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-sm font-medium">Clickable Logo</p>
            <Logo 
              clickable 
              onClick={() => alert('Logo clicked!')}
              className="hover:scale-105 transition-transform"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Custom Subtitle</p>
            <Logo 
              type="full" 
              showSubtitle 
              subtitle="Custom Subtitle"
              subtitleLine2="Custom Line 2"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Custom Size</p>
            <Logo width={120} height={60} />
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Examples</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Header Usage</h4>
            <div className="flex items-center justify-between">
              <HeaderLogo />
              <div className="text-sm text-muted-foreground">Navigation items here</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Sidebar Usage</h4>
            <div className="flex items-start gap-4">
              <SidebarLogo />
              <div className="text-sm text-muted-foreground">Sidebar content here</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Auth Page Usage</h4>
            <div className="flex flex-col items-center">
              <AuthLogo />
              <div className="text-sm text-muted-foreground mt-4">Login form here</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Footer Usage</h4>
            <div className="flex items-center justify-between">
              <FooterLogo />
              <div className="text-sm text-muted-foreground">Footer links here</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 