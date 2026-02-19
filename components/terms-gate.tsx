"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { getTermsAccepted, setTermsAccepted } from "@/lib/terms"
import { Button } from "@/components/ui/button"

export function TermsGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [accepted, setAccepted] = useState<boolean | null>(null)
  const [checkbox, setCheckbox] = useState(false)

  useEffect(() => {
    setAccepted(getTermsAccepted())
  }, [])

  const isTermsPage = pathname === "/terms"

  if (accepted === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isTermsPage || accepted) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">
          Terms of Service
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          To use DualAgree you must read and accept our Terms of Service. They describe your rights, our limitations, and that the app and testnet use are at your own risk.
        </p>
        <Link
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          Read Terms of Service →
        </Link>
        <label className="mt-4 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={checkbox}
            onChange={(e) => setCheckbox(e.target.checked)}
            className="mt-0.5 rounded border-border"
          />
          <span className="text-sm text-foreground">
            I have read and accept the{" "}
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">
              Terms of Service
            </Link>
          </span>
        </label>
        <Button
          className="mt-5 w-full"
          disabled={!checkbox}
          onClick={() => {
            setTermsAccepted()
            setAccepted(true)
          }}
        >
          Accept and continue
        </Button>
      </div>
    </div>
  )
}
