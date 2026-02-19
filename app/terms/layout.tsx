import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — DualAgree",
  description: "Terms of Service for using DualAgree. Use at your own risk; testnet only.",
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
