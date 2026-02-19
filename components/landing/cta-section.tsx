import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Money only moves when both agree.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Create an agreement or bet, lock USDC on Arc Testnet. On resolution, both parties must submit the same decision. Today: single verifier (MVP). Coming: dual consensus — one deposits / one receives, or both deposit / one receives (e.g. freelancer guarantee).
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Launch App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
