import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Providers } from "@/components/providers"
import { TermsGate } from "@/components/terms-gate"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  applicationName: 'DualAgree',
  title: 'DualAgree — Money only moves when both agree',
  description: 'Two-party escrow onchain: freelancers & clients, or bets between friends. You deposit USDC; the other party accepts. Funds release only when both submit the same outcome. No middlemen.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <TermsGate>{children}</TermsGate>
        </Providers>
        <Toaster theme="dark" position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
