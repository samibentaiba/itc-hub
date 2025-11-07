import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Roboto } from "next/font/google";
import {Wrapper} from "./wrapper";
import { VersionDisplay } from "../components/VersionDisplay";

const roboto = Roboto({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ITC Hub",
    template: "%s | ITC Hub",
  },
  description: "A modern workspace platform for the Information Technology Community",
  keywords: [
    "ITC Hub",
    "Information Technology Community",
    "Workspace",
    "Platform",
    "Community",
    "IT",
    "Tech",
    "Collaboration",
    "Productivity",
  ],
  authors: [{ name: "ITC Hub Team" }],
  creator: "ITC Hub Team",
  publisher: "ITC Hub Team",
  alternates: {
    canonical: "https://itc-hub.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: {
      url: "/ITC HUB Logo.svg",
    },
  },
  metadataBase: new URL('https://itc-hub.vercel.app'),

  openGraph: {
    title: "ITC Hub",
    description: "A modern workspace platform for the Information Technology Community",
    url: "https://itc-hub.vercel.app",
    siteName: "ITC Hub",
    type: "website",
    locale: "en_US",
    emails: "contact@itc-hub.vercel.app",
    phoneNumbers: "+1234567890",
    faxNumbers: "+1234567899",
    countryName: "USA",
    determiner: "the",
    images: [
      {
        url: "https://itc-hub.vercel.app/ITC%20HUB%20Home.png",
        width: 1200,
        height: 630,
        alt: "ITC Hub Home Page",
      },
      {
        url: "https://itc-hub.vercel.app/ITC%20HUB%20Logo.svg",
        width: 800,
        height: 600,
        alt: "ITC Hub Logo",
      },
    ],
    videos: [
      {
        url: "https://itc-hub.vercel.app/video.mp4",
        secureUrl: "https://itc-hub.vercel.app/video.mp4",
        type: "video/mp4",
        width: 1280,
        height: 720,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@itc_hub",
    siteId: "1234567890",
    creator: "@itc_hub",
    creatorId: "1234567890",
    title: "ITC Hub",
    description: "A modern workspace platform for the Information Technology Community",
    images: [
      {
        url: "https://itc-hub.vercel.app/ITC%20HUB%20Home.png",
        width: 1200,
        height: 630,
        alt: "ITC Hub Home Page",
      },
      {
        url: "https://itc-hub.vercel.app/ITC%20HUB%20Logo.svg",
        width: 800,
        height: 600,
        alt: "ITC Hub Logo",
      },
    ],
  },
}

export const viewport = {
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebPage",
                  "@id": "https://itc-hub.vercel.app/#webpage",
                  "url": "https://itc-hub.vercel.app/",
                  "name": "ITC Hub",
                  "isPartOf": {
                    "@id": "https://itc-hub.vercel.app/#website"
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://itc-hub.vercel.app/ITC%20HUB%20Home.png"
                  },
                  "description": "A modern workspace platform for the Information Technology Community",
                  "inLanguage": "en-US"
                },
                {
                  "@type": "WebSite",
                  "@id": "https://itc-hub.vercel.app/#website",
                  "url": "https://itc-hub.vercel.app/",
                  "name": "ITC Hub",
                  "description": "A modern workspace platform for the Information Technology Community",
                  "publisher": {
                    "@id": "https://itc-hub.vercel.app/#organization"
                  },
                  "inLanguage": "en-US"
                },
                {
                  "@type": "Organization",
                  "@id": "https://itc-hub.vercel.app/#organization",
                  "name": "ITC Hub",
                  "url": "https://itc-hub.vercel.app/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://itc-hub.vercel.app/ITC%20HUB%20Logo.svg"
                  },
                  "sameAs": [
                    "https://twitter.com/itc_hub",
                    "https://www.linkedin.com/company/itc-hub",
                    "https://www.facebook.com/itc_hub",
                    "https://www.instagram.com/itc_hub"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-800-555-1212",
                    "contactType": "customer service",
                    "areaServed": "US",
                    "availableLanguage": ["English"]
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className={`${roboto.className} bg-background`}>
        <Wrapper>
          {children}
          <VersionDisplay />
        </Wrapper>
      </body>
    </html>
  )
}
